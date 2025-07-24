// Production Environment Configuration - Option D Implementation
// Enterprise-grade environment management with security and scalability

export interface EnvironmentConfig {
  environment: 'development' | 'staging' | 'production';
  app: {
    name: string;
    version: string;
    port: number;
    host: string;
    baseUrl: string;
    corsOrigins: string[];
  };
  database: {
    supabase: {
      url: string;
      anonKey: string;
      serviceRoleKey?: string;
      maxConnections: number;
      connectionTimeout: number;
    };
  };
  apis: {
    meta: {
      baseUrl: string;
      version: string;
      rateLimit: {
        requestsPerSecond: number;
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      timeout: number;
    };
    googleAds: {
      baseUrl: string;
      version: string;
      rateLimit: {
        requestsPerSecond: number;
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      timeout: number;
    };
    tiktok: {
      baseUrl: string;
      version: string;
      rateLimit: {
        requestsPerSecond: number;
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      timeout: number;
    };
    linkedin: {
      baseUrl: string;
      version: string;
      rateLimit: {
        requestsPerSecond: number;
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      timeout: number;
    };
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    maxRetries: number;
    retryDelayOnFailover: number;
  };
  monitoring: {
    sentry: {
      dsn: string;
      environment: string;
      sampleRate: number;
      tracesSampleRate: number;
    };
    analytics: {
      enabled: boolean;
      provider: 'mixpanel' | 'amplitude' | 'google-analytics';
      apiKey: string;
    };
    performance: {
      enabled: boolean;
      sampleRate: number;
      webVitals: boolean;
    };
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
    bcryptRounds: number;
    rateLimiting: {
      enabled: boolean;
      windowMs: number;
      maxRequests: number;
    };
    cors: {
      enabled: boolean;
      credentials: boolean;
      optionsSuccessStatus: number;
    };
    helmet: {
      enabled: boolean;
      contentSecurityPolicy: boolean;
      crossOriginEmbedderPolicy: boolean;
    };
  };
  cache: {
    ttl: number;
    maxSize: number;
    checkPeriod: number;
  };
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'text';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
    maxFiles: number;
    maxSize: string;
  };
  features: {
    realApiIntegration: boolean;
    advancedFeatures: boolean;
    experimentalFeatures: boolean;
    maintenanceMode: boolean;
  };
  performance: {
    bundleAnalyzer: boolean;
    lazyLoading: boolean;
    caching: boolean;
    compression: boolean;
    preloadCritical: boolean;
  };
}

class EnvironmentManager {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadEnvironmentConfig();
    this.validateConfig();
    console.log(`🌍 [Environment] Loaded ${this.config.environment} configuration`);
  }

  private loadEnvironmentConfig(): EnvironmentConfig {
    const env = (import.meta.env.MODE || 'development') as 'development' | 'staging' | 'production';
    
    // Base configuration
    const baseConfig: EnvironmentConfig = {
      environment: env,
      app: {
        name: 'Ads Pro Platform',
        version: '1.0.0',
        port: parseInt(import.meta.env.VITE_PORT || '3000'),
        host: import.meta.env.VITE_HOST || 'localhost',
        baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
        corsOrigins: this.parseCorsOrigins(import.meta.env.VITE_CORS_ORIGINS)
      },
      database: {
        supabase: {
          url: import.meta.env.VITE_SUPABASE_URL || '',
          anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
          maxConnections: parseInt(import.meta.env.VITE_DB_MAX_CONNECTIONS || '20'),
          connectionTimeout: parseInt(import.meta.env.VITE_DB_CONNECTION_TIMEOUT || '10000')
        }
      },
      apis: {
        meta: {
          baseUrl: import.meta.env.VITE_META_API_BASE_URL || 'https://graph.facebook.com',
          version: import.meta.env.VITE_META_API_VERSION || 'v18.0',
          rateLimit: {
            requestsPerSecond: parseInt(import.meta.env.VITE_META_RATE_LIMIT_PER_SECOND || '1'),
            requestsPerMinute: parseInt(import.meta.env.VITE_META_RATE_LIMIT_PER_MINUTE || '25'),
            requestsPerHour: parseInt(import.meta.env.VITE_META_RATE_LIMIT_PER_HOUR || '1500')
          },
          timeout: parseInt(import.meta.env.VITE_META_API_TIMEOUT || '30000')
        },
        googleAds: {
          baseUrl: import.meta.env.VITE_GOOGLE_ADS_API_BASE_URL || 'https://googleads.googleapis.com',
          version: import.meta.env.VITE_GOOGLE_ADS_API_VERSION || 'v14',
          rateLimit: {
            requestsPerSecond: parseInt(import.meta.env.VITE_GOOGLE_ADS_RATE_LIMIT_PER_SECOND || '2'),
            requestsPerMinute: parseInt(import.meta.env.VITE_GOOGLE_ADS_RATE_LIMIT_PER_MINUTE || '100'),
            requestsPerHour: parseInt(import.meta.env.VITE_GOOGLE_ADS_RATE_LIMIT_PER_HOUR || '5000')
          },
          timeout: parseInt(import.meta.env.VITE_GOOGLE_ADS_API_TIMEOUT || '30000')
        },
        tiktok: {
          baseUrl: import.meta.env.VITE_TIKTOK_API_BASE_URL || 'https://business-api.tiktok.com',
          version: import.meta.env.VITE_TIKTOK_API_VERSION || 'v1.3',
          rateLimit: {
            requestsPerSecond: parseInt(import.meta.env.VITE_TIKTOK_RATE_LIMIT_PER_SECOND || '1'),
            requestsPerMinute: parseInt(import.meta.env.VITE_TIKTOK_RATE_LIMIT_PER_MINUTE || '60'),
            requestsPerHour: parseInt(import.meta.env.VITE_TIKTOK_RATE_LIMIT_PER_HOUR || '3600')
          },
          timeout: parseInt(import.meta.env.VITE_TIKTOK_API_TIMEOUT || '30000')
        },
        linkedin: {
          baseUrl: import.meta.env.VITE_LINKEDIN_API_BASE_URL || 'https://api.linkedin.com',
          version: import.meta.env.VITE_LINKEDIN_API_VERSION || 'v2',
          rateLimit: {
            requestsPerSecond: parseInt(import.meta.env.VITE_LINKEDIN_RATE_LIMIT_PER_SECOND || '1'),
            requestsPerMinute: parseInt(import.meta.env.VITE_LINKEDIN_RATE_LIMIT_PER_MINUTE || '100'),
            requestsPerHour: parseInt(import.meta.env.VITE_LINKEDIN_RATE_LIMIT_PER_HOUR || '5000')
          },
          timeout: parseInt(import.meta.env.VITE_LINKEDIN_API_TIMEOUT || '30000')
        }
      },
      redis: {
        host: import.meta.env.VITE_REDIS_HOST || 'localhost',
        port: parseInt(import.meta.env.VITE_REDIS_PORT || '6379'),
        password: import.meta.env.VITE_REDIS_PASSWORD,
        db: parseInt(import.meta.env.VITE_REDIS_DB || '0'),
        maxRetries: parseInt(import.meta.env.VITE_REDIS_MAX_RETRIES || '3'),
        retryDelayOnFailover: parseInt(import.meta.env.VITE_REDIS_RETRY_DELAY || '100')
      },
      monitoring: {
        sentry: {
          dsn: import.meta.env.VITE_SENTRY_DSN || '',
          environment: env,
          sampleRate: parseFloat(import.meta.env.VITE_SENTRY_SAMPLE_RATE || '1.0'),
          tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1')
        },
        analytics: {
          enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
          provider: (import.meta.env.VITE_ANALYTICS_PROVIDER || 'mixpanel') as any,
          apiKey: import.meta.env.VITE_ANALYTICS_API_KEY || ''
        },
        performance: {
          enabled: import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED === 'true',
          sampleRate: parseFloat(import.meta.env.VITE_PERFORMANCE_SAMPLE_RATE || '0.1'),
          webVitals: import.meta.env.VITE_WEB_VITALS_ENABLED === 'true'
        }
      },
      security: {
        jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        jwtExpiresIn: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',
        refreshTokenExpiresIn: import.meta.env.VITE_REFRESH_TOKEN_EXPIRES_IN || '30d',
        bcryptRounds: parseInt(import.meta.env.VITE_BCRYPT_ROUNDS || '12'),
        rateLimiting: {
          enabled: import.meta.env.VITE_RATE_LIMITING_ENABLED === 'true',
          windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
          maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100')
        },
        cors: {
          enabled: import.meta.env.VITE_CORS_ENABLED === 'true',
          credentials: import.meta.env.VITE_CORS_CREDENTIALS === 'true',
          optionsSuccessStatus: parseInt(import.meta.env.VITE_CORS_OPTIONS_SUCCESS_STATUS || '200')
        },
        helmet: {
          enabled: import.meta.env.VITE_HELMET_ENABLED === 'true',
          contentSecurityPolicy: import.meta.env.VITE_CSP_ENABLED === 'true',
          crossOriginEmbedderPolicy: import.meta.env.VITE_COEP_ENABLED === 'true'
        }
      },
      cache: {
        ttl: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'), // 5 minutes
        maxSize: parseInt(import.meta.env.VITE_CACHE_MAX_SIZE || '1000'),
        checkPeriod: parseInt(import.meta.env.VITE_CACHE_CHECK_PERIOD || '600000') // 10 minutes
      },
      logging: {
        level: (import.meta.env.VITE_LOG_LEVEL || 'info') as any,
        format: (import.meta.env.VITE_LOG_FORMAT || 'json') as any,
        enableConsole: import.meta.env.VITE_LOG_CONSOLE_ENABLED !== 'false',
        enableFile: import.meta.env.VITE_LOG_FILE_ENABLED === 'true',
        filePath: import.meta.env.VITE_LOG_FILE_PATH,
        maxFiles: parseInt(import.meta.env.VITE_LOG_MAX_FILES || '5'),
        maxSize: import.meta.env.VITE_LOG_MAX_SIZE || '10m'
      },
      features: {
        realApiIntegration: import.meta.env.VITE_REAL_API_INTEGRATION === 'true',
        advancedFeatures: import.meta.env.VITE_ADVANCED_FEATURES === 'true',
        experimentalFeatures: import.meta.env.VITE_EXPERIMENTAL_FEATURES === 'true',
        maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true'
      },
      performance: {
        bundleAnalyzer: import.meta.env.VITE_BUNDLE_ANALYZER === 'true',
        lazyLoading: import.meta.env.VITE_LAZY_LOADING !== 'false',
        caching: import.meta.env.VITE_CACHING !== 'false',
        compression: import.meta.env.VITE_COMPRESSION !== 'false',
        preloadCritical: import.meta.env.VITE_PRELOAD_CRITICAL !== 'false'
      }
    };

    // Environment-specific overrides
    return this.applyEnvironmentOverrides(baseConfig, env);
  }

  private applyEnvironmentOverrides(config: EnvironmentConfig, env: string): EnvironmentConfig {
    switch (env) {
      case 'production':
        return {
          ...config,
          app: {
            ...config.app,
            baseUrl: import.meta.env.VITE_PRODUCTION_BASE_URL || 'https://ads-pro-platform.com',
            corsOrigins: this.parseCorsOrigins(import.meta.env.VITE_PRODUCTION_CORS_ORIGINS || 'https://ads-pro-platform.com')
          },
          database: {
            ...config.database,
            supabase: {
              ...config.database.supabase,
              maxConnections: 50,
              connectionTimeout: 5000
            }
          },
          security: {
            ...config.security,
            bcryptRounds: 14,
            rateLimiting: {
              ...config.security.rateLimiting,
              enabled: true,
              maxRequests: 1000, // Higher limit for production
              windowMs: 900000 // 15 minutes
            },
            helmet: {
              ...config.security.helmet,
              enabled: true,
              contentSecurityPolicy: true,
              crossOriginEmbedderPolicy: true
            }
          },
          monitoring: {
            ...config.monitoring,
            sentry: {
              ...config.monitoring.sentry,
              sampleRate: 0.2, // Sample 20% of errors in production
              tracesSampleRate: 0.05 // Sample 5% of traces
            },
            analytics: {
              ...config.monitoring.analytics,
              enabled: true
            },
            performance: {
              ...config.monitoring.performance,
              enabled: true,
              sampleRate: 0.1,
              webVitals: true
            }
          },
          logging: {
            ...config.logging,
            level: 'warn',
            enableFile: true,
            enableConsole: false
          },
          features: {
            ...config.features,
            realApiIntegration: true,
            advancedFeatures: true,
            experimentalFeatures: false
          },
          performance: {
            ...config.performance,
            bundleAnalyzer: false,
            lazyLoading: true,
            caching: true,
            compression: true,
            preloadCritical: true
          }
        };

      case 'staging':
        return {
          ...config,
          app: {
            ...config.app,
            baseUrl: import.meta.env.VITE_STAGING_BASE_URL || 'https://staging-ads-pro-platform.com',
            corsOrigins: this.parseCorsOrigins(import.meta.env.VITE_STAGING_CORS_ORIGINS || 'https://staging-ads-pro-platform.com')
          },
          database: {
            ...config.database,
            supabase: {
              ...config.database.supabase,
              maxConnections: 30,
              connectionTimeout: 10000
            }
          },
          security: {
            ...config.security,
            bcryptRounds: 12,
            rateLimiting: {
              ...config.security.rateLimiting,
              enabled: true,
              maxRequests: 500,
              windowMs: 900000
            }
          },
          monitoring: {
            ...config.monitoring,
            sentry: {
              ...config.monitoring.sentry,
              sampleRate: 1.0, // Sample all errors in staging
              tracesSampleRate: 0.1
            },
            analytics: {
              ...config.monitoring.analytics,
              enabled: true
            }
          },
          logging: {
            ...config.logging,
            level: 'info',
            enableFile: true,
            enableConsole: true
          },
          features: {
            ...config.features,
            realApiIntegration: true,
            advancedFeatures: true,
            experimentalFeatures: true
          }
        };

      case 'development':
      default:
        return {
          ...config,
          security: {
            ...config.security,
            bcryptRounds: 10, // Faster for development
            rateLimiting: {
              ...config.security.rateLimiting,
              enabled: false // Disabled for development
            }
          },
          monitoring: {
            ...config.monitoring,
            sentry: {
              ...config.monitoring.sentry,
              sampleRate: 0.0, // No error sampling in development
              tracesSampleRate: 0.0
            },
            analytics: {
              ...config.monitoring.analytics,
              enabled: false // Disabled for development
            }
          },
          logging: {
            ...config.logging,
            level: 'debug',
            enableFile: false,
            enableConsole: true
          },
          features: {
            ...config.features,
            realApiIntegration: false, // Use mock data in development
            advancedFeatures: true,
            experimentalFeatures: true
          },
          performance: {
            ...config.performance,
            bundleAnalyzer: true,
            lazyLoading: false, // Disabled for easier development
            caching: false,
            compression: false
          }
        };
    }
  }

  private parseCorsOrigins(corsOriginsEnv?: string): string[] {
    if (!corsOriginsEnv) return ['http://localhost:3000'];
    return corsOriginsEnv.split(',').map(origin => origin.trim());
  }

  private validateConfig(): void {
    const errors: string[] = [];

    // Validate required environment variables
    if (!this.config.database.supabase.url) {
      errors.push('VITE_SUPABASE_URL is required');
    }

    if (!this.config.database.supabase.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required');
    }

    if (this.config.environment === 'production') {
      if (this.config.security.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
        errors.push('JWT_SECRET must be changed in production');
      }

      if (!this.config.monitoring.sentry.dsn) {
        console.warn('⚠️ [Environment] Sentry DSN not configured for production');
      }
    }

    // Validate API rate limits
    Object.entries(this.config.apis).forEach(([platform, apiConfig]) => {
      if (apiConfig.rateLimit.requestsPerSecond > apiConfig.rateLimit.requestsPerMinute / 60) {
        errors.push(`${platform} rate limit configuration is invalid: requests per second exceeds minute limit`);
      }
    });

    if (errors.length > 0) {
      console.error('❌ [Environment] Configuration validation failed:');
      errors.forEach(error => console.error(`  - ${error}`));
      throw new Error(`Environment configuration validation failed: ${errors.join(', ')}`);
    }

    console.log('✅ [Environment] Configuration validation passed');
  }

  // **PUBLIC INTERFACE METHODS**

  public getConfig(): EnvironmentConfig {
    return { ...this.config }; // Return a copy to prevent mutation
  }

  public get(key: keyof EnvironmentConfig): any {
    return this.config[key];
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.config.features[feature];
  }

  public getApiConfig(platform: keyof EnvironmentConfig['apis']): EnvironmentConfig['apis'][keyof EnvironmentConfig['apis']] {
    return this.config.apis[platform];
  }

  public getDatabaseConfig(): EnvironmentConfig['database'] {
    return this.config.database;
  }

  public getSecurityConfig(): EnvironmentConfig['security'] {
    return this.config.security;
  }

  public getMonitoringConfig(): EnvironmentConfig['monitoring'] {
    return this.config.monitoring;
  }

  public updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('🔄 [Environment] Configuration updated');
  }

  public getHealthCheck(): {
    environment: string;
    timestamp: string;
    uptime: number;
    features: EnvironmentConfig['features'];
    apiEndpoints: { [key: string]: boolean };
  } {
    return {
      environment: this.config.environment,
      timestamp: new Date().toISOString(),
      uptime: performance.now(),
      features: this.config.features,
      apiEndpoints: Object.keys(this.config.apis).reduce((acc, platform) => {
        acc[platform] = true; // In real implementation, this would check actual connectivity
        return acc;
      }, {} as { [key: string]: boolean })
    };
  }

  public exportConfig(): string {
    // Export configuration for deployment (excluding sensitive data)
    const exportConfig = {
      ...this.config,
      security: {
        ...this.config.security,
        jwtSecret: '[REDACTED]'
      },
      database: {
        ...this.config.database,
        supabase: {
          ...this.config.database.supabase,
          serviceRoleKey: '[REDACTED]'
        }
      },
      redis: {
        ...this.config.redis,
        password: '[REDACTED]'
      }
    };

    return JSON.stringify(exportConfig, null, 2);
  }
}

// Singleton instance
export const environmentManager = new EnvironmentManager();
export const config = environmentManager.getConfig();