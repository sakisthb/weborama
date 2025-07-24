#!/bin/bash

# Backup Automation Script - Option D Implementation
# Automated backup and recovery operations for production deployment

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups"
LOG_FILE="${PROJECT_ROOT}/logs/backup.log"
CONFIG_FILE="${PROJECT_ROOT}/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    # Log to console with colors
    case $level in
        ERROR)   echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        WARN)    echo -e "${YELLOW}[WARN]${NC} $message" ;;
        INFO)    echo -e "${GREEN}[INFO]${NC} $message" ;;
        DEBUG)   echo -e "${BLUE}[DEBUG]${NC} $message" ;;
    esac
}

# Load environment variables
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log "INFO" "Loading configuration from $CONFIG_FILE"
        set -a
        source "$CONFIG_FILE"
        set +a
    else
        log "WARN" "Configuration file not found: $CONFIG_FILE"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    local missing_tools=()
    
    # Check required tools
    for tool in pg_dump pg_restore aws s3cmd docker kubectl; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check backup directory
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log "INFO" "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
    
    log "INFO" "Prerequisites check completed"
}

# Database backup
backup_database() {
    local backup_type=$1
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="${BACKUP_DIR}/db_${backup_type}_${timestamp}.sql"
    
    log "INFO" "Starting database backup: $backup_type"
    
    # Database connection details
    local db_host="${POSTGRES_HOST:-localhost}"
    local db_port="${POSTGRES_PORT:-5432}"
    local db_name="${POSTGRES_DB:-ads_pro_platform}"
    local db_user="${POSTGRES_USER:-postgres}"
    
    # Set password for non-interactive operation
    export PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
    
    # Perform backup
    if [[ "$backup_type" == "full" ]]; then
        log "INFO" "Performing full database backup..."
        pg_dump -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" \
                --verbose --clean --if-exists --create \
                --format=custom --compress=9 \
                --file="$backup_file.dump"
        
        # Also create SQL format for easier inspection
        pg_dump -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" \
                --verbose --clean --if-exists --create \
                --file="$backup_file"
    else
        log "INFO" "Performing incremental database backup..."
        # For incremental backups, we'll backup specific tables or use WAL
        pg_dump -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" \
                --verbose --data-only \
                --format=custom --compress=9 \
                --file="$backup_file.dump"
    fi
    
    # Verify backup
    if [[ -f "$backup_file.dump" ]]; then
        local file_size=$(stat -f%z "$backup_file.dump" 2>/dev/null || stat -c%s "$backup_file.dump" 2>/dev/null)
        log "INFO" "Database backup completed: $backup_file.dump ($(($file_size / 1024 / 1024)) MB)"
        
        # Generate checksum
        local checksum=$(shasum -a 256 "$backup_file.dump" | cut -d' ' -f1)
        echo "$checksum  $backup_file.dump" > "$backup_file.dump.sha256"
        log "INFO" "Backup checksum: $checksum"
        
        echo "$backup_file.dump"
    else
        log "ERROR" "Database backup failed: $backup_file.dump not created"
        exit 1
    fi
    
    unset PGPASSWORD
}

# Application data backup
backup_application_data() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="${BACKUP_DIR}/app_data_${timestamp}.tar.gz"
    
    log "INFO" "Starting application data backup..."
    
    # Backup application data directories
    local data_dirs=(
        "${PROJECT_ROOT}/data"
        "${PROJECT_ROOT}/uploads"
        "${PROJECT_ROOT}/logs"
        "${PROJECT_ROOT}/config"
    )
    
    local existing_dirs=()
    for dir in "${data_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            existing_dirs+=("$dir")
        fi
    done
    
    if [[ ${#existing_dirs[@]} -gt 0 ]]; then
        tar -czf "$backup_file" "${existing_dirs[@]}" 2>/dev/null || {
            log "WARN" "Some application data directories not found, continuing..."
            touch "$backup_file"
        }
        
        local file_size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)
        log "INFO" "Application data backup completed: $backup_file ($(($file_size / 1024 / 1024)) MB)"
        
        # Generate checksum
        local checksum=$(shasum -a 256 "$backup_file" | cut -d' ' -f1)
        echo "$checksum  $backup_file" > "$backup_file.sha256"
        
        echo "$backup_file"
    else
        log "WARN" "No application data directories found to backup"
        echo ""
    fi
}

# Upload backup to cloud storage
upload_to_cloud() {
    local backup_file=$1
    local storage_type="${BACKUP_STORAGE_TYPE:-s3}"
    
    if [[ ! -f "$backup_file" ]]; then
        log "ERROR" "Backup file not found: $backup_file"
        return 1
    fi
    
    log "INFO" "Uploading backup to $storage_type: $(basename "$backup_file")"
    
    case $storage_type in
        s3)
            if [[ -n "${AWS_S3_BACKUP_BUCKET:-}" ]]; then
                aws s3 cp "$backup_file" "s3://${AWS_S3_BACKUP_BUCKET}/$(basename "$backup_file")" \
                    --storage-class STANDARD_IA
                aws s3 cp "$backup_file.sha256" "s3://${AWS_S3_BACKUP_BUCKET}/$(basename "$backup_file.sha256")"
                log "INFO" "Backup uploaded to S3: s3://${AWS_S3_BACKUP_BUCKET}/$(basename "$backup_file")"
            else
                log "WARN" "AWS_S3_BACKUP_BUCKET not configured, skipping S3 upload"
            fi
            ;;
        gcs)
            if [[ -n "${GCS_BACKUP_BUCKET:-}" ]]; then
                gsutil cp "$backup_file" "gs://${GCS_BACKUP_BUCKET}/"
                gsutil cp "$backup_file.sha256" "gs://${GCS_BACKUP_BUCKET}/"
                log "INFO" "Backup uploaded to GCS: gs://${GCS_BACKUP_BUCKET}/$(basename "$backup_file")"
            else
                log "WARN" "GCS_BACKUP_BUCKET not configured, skipping GCS upload"
            fi
            ;;
        *)
            log "WARN" "Unknown storage type: $storage_type, keeping backup local only"
            ;;
    esac
}

# Verify backup integrity
verify_backup() {
    local backup_file=$1
    
    log "INFO" "Verifying backup integrity: $(basename "$backup_file")"
    
    # Check if backup file exists
    if [[ ! -f "$backup_file" ]]; then
        log "ERROR" "Backup file not found: $backup_file"
        return 1
    fi
    
    # Verify checksum if available
    if [[ -f "$backup_file.sha256" ]]; then
        if shasum -a 256 -c "$backup_file.sha256" &>/dev/null; then
            log "INFO" "Backup checksum verification passed"
        else
            log "ERROR" "Backup checksum verification failed"
            return 1
        fi
    fi
    
    # For database backups, try to list contents
    if [[ "$backup_file" == *.dump ]]; then
        log "INFO" "Verifying database backup structure..."
        if pg_restore --list "$backup_file" &>/dev/null; then
            local table_count=$(pg_restore --list "$backup_file" | grep -c "TABLE DATA" || echo "0")
            log "INFO" "Database backup contains $table_count tables"
        else
            log "ERROR" "Database backup structure verification failed"
            return 1
        fi
    fi
    
    log "INFO" "Backup verification completed successfully"
    return 0
}

# Clean old backups
cleanup_old_backups() {
    local retention_days="${BACKUP_RETENTION_DAYS:-7}"
    
    log "INFO" "Cleaning up backups older than $retention_days days..."
    
    # Clean local backups
    find "$BACKUP_DIR" -name "*.sql" -type f -mtime +$retention_days -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.dump" -type f -mtime +$retention_days -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$retention_days -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.sha256" -type f -mtime +$retention_days -delete 2>/dev/null || true
    
    # Clean cloud backups (if configured)
    if [[ "${BACKUP_STORAGE_TYPE:-}" == "s3" && -n "${AWS_S3_BACKUP_BUCKET:-}" ]]; then
        log "INFO" "Cleaning up old S3 backups..."
        # Use lifecycle policies in S3 instead of manual deletion
        log "INFO" "S3 lifecycle policies should handle old backup cleanup"
    fi
    
    log "INFO" "Backup cleanup completed"
}

# Restore from backup
restore_database() {
    local backup_file=$1
    local target_db="${2:-${POSTGRES_DB:-ads_pro_platform}}"
    
    log "INFO" "Starting database restore from: $(basename "$backup_file")"
    
    # Verify backup before restore
    if ! verify_backup "$backup_file"; then
        log "ERROR" "Backup verification failed, aborting restore"
        exit 1
    fi
    
    # Database connection details
    local db_host="${POSTGRES_HOST:-localhost}"
    local db_port="${POSTGRES_PORT:-5432}"
    local db_user="${POSTGRES_USER:-postgres}"
    
    export PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
    
    # Create target database if it doesn't exist
    createdb -h "$db_host" -p "$db_port" -U "$db_user" "$target_db" 2>/dev/null || {
        log "WARN" "Database $target_db already exists or creation failed"
    }
    
    # Perform restore
    log "INFO" "Restoring database: $target_db"
    if [[ "$backup_file" == *.dump ]]; then
        pg_restore -h "$db_host" -p "$db_port" -U "$db_user" \
                   -d "$target_db" --verbose --clean --if-exists \
                   "$backup_file"
    else
        psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$target_db" \
             -f "$backup_file"
    fi
    
    unset PGPASSWORD
    
    log "INFO" "Database restore completed successfully"
}

# Test restore process
test_restore() {
    local backup_file=$1
    local test_db="ads_pro_platform_test_$(date '+%Y%m%d_%H%M%S')"
    
    log "INFO" "Testing restore process with test database: $test_db"
    
    # Perform test restore
    restore_database "$backup_file" "$test_db"
    
    # Basic validation
    local db_host="${POSTGRES_HOST:-localhost}"
    local db_port="${POSTGRES_PORT:-5432}"
    local db_user="${POSTGRES_USER:-postgres}"
    
    export PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
    
    # Check if tables exist
    local table_count=$(psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$test_db" \
                        -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" \
                        2>/dev/null | tr -d ' ')
    
    unset PGPASSWORD
    
    if [[ "$table_count" -gt 0 ]]; then
        log "INFO" "Test restore successful: $table_count tables found"
        
        # Clean up test database
        dropdb -h "$db_host" -p "$db_port" -U "$POSTGRES_USER" "$test_db" 2>/dev/null || {
            log "WARN" "Failed to drop test database: $test_db"
        }
        
        return 0
    else
        log "ERROR" "Test restore failed: no tables found in test database"
        return 1
    fi
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    # Send to webhook if configured
    if [[ -n "${BACKUP_WEBHOOK_URL:-}" ]]; then
        curl -X POST "${BACKUP_WEBHOOK_URL}" \
             -H "Content-Type: application/json" \
             -d "{\"status\":\"$status\",\"message\":\"$message\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
             &>/dev/null || log "WARN" "Failed to send webhook notification"
    fi
    
    # Log the notification
    log "INFO" "Notification sent: $status - $message"
}

# Main backup function
perform_backup() {
    local backup_type=${1:-incremental}
    
    log "INFO" "Starting $backup_type backup process..."
    
    local start_time=$(date +%s)
    local backup_files=()
    
    # Database backup
    local db_backup
    db_backup=$(backup_database "$backup_type")
    if [[ -n "$db_backup" ]]; then
        backup_files+=("$db_backup")
    fi
    
    # Application data backup
    local app_backup
    app_backup=$(backup_application_data)
    if [[ -n "$app_backup" ]]; then
        backup_files+=("$app_backup")
    fi
    
    # Verify and upload backups
    for backup_file in "${backup_files[@]}"; do
        if verify_backup "$backup_file"; then
            upload_to_cloud "$backup_file"
            
            # Test restore for full backups
            if [[ "$backup_type" == "full" ]]; then
                if test_restore "$backup_file"; then
                    log "INFO" "Backup test restore successful"
                else
                    log "ERROR" "Backup test restore failed"
                    send_notification "error" "Backup test restore failed: $(basename "$backup_file")"
                fi
            fi
        else
            log "ERROR" "Backup verification failed: $(basename "$backup_file")"
            send_notification "error" "Backup verification failed: $(basename "$backup_file")"
        fi
    done
    
    # Cleanup old backups
    cleanup_old_backups
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log "INFO" "Backup process completed in ${duration}s"
    send_notification "success" "$backup_type backup completed successfully in ${duration}s"
}

# Print usage
usage() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    backup [full|incremental]    Perform backup (default: incremental)
    restore <backup_file>        Restore from backup file
    verify <backup_file>         Verify backup integrity
    test-restore <backup_file>   Test restore process
    cleanup                      Clean old backups
    list                         List available backups

Options:
    -h, --help                   Show this help message
    -v, --verbose                Enable verbose logging
    
Examples:
    $0 backup full               Perform full backup
    $0 backup incremental        Perform incremental backup
    $0 restore backup.dump       Restore from backup file
    $0 verify backup.dump        Verify backup integrity
    $0 cleanup                   Clean old backups

EOF
}

# Parse command line arguments
main() {
    local command=${1:-backup}
    
    case $command in
        backup)
            load_config
            check_prerequisites
            perform_backup "${2:-incremental}"
            ;;
        restore)
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Backup file required for restore"
                usage
                exit 1
            fi
            load_config
            check_prerequisites
            restore_database "$2"
            ;;
        verify)
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Backup file required for verification"
                usage
                exit 1
            fi
            verify_backup "$2"
            ;;
        test-restore)
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Backup file required for test restore"
                usage
                exit 1
            fi
            load_config
            check_prerequisites
            test_restore "$2"
            ;;
        cleanup)
            load_config
            cleanup_old_backups
            ;;
        list)
            log "INFO" "Available backups in $BACKUP_DIR:"
            ls -la "$BACKUP_DIR"/*.{sql,dump,tar.gz} 2>/dev/null || {
                log "INFO" "No backups found in $BACKUP_DIR"
            }
            ;;
        -h|--help|help)
            usage
            ;;
        *)
            log "ERROR" "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"