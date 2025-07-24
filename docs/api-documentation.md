# Ads Pro Platform - API Documentation

## Overview

The Ads Pro Platform API provides comprehensive endpoints for campaign management, analytics, reporting, and multi-touch attribution. This RESTful API supports both traditional HTTP requests and real-time WebSocket connections for live data updates.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL and Versioning](#base-url-and-versioning)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Authentication Endpoints](#authentication-endpoints)
7. [Campaign Management](#campaign-management)
8. [Analytics Endpoints](#analytics-endpoints)
9. [Attribution Engine](#attribution-engine)
10. [Reporting APIs](#reporting-apis)
11. [User Management](#user-management)
12. [Integration APIs](#integration-apis)
13. [Real-time WebSocket](#real-time-websocket)
14. [Webhooks](#webhooks)
15. [SDK Examples](#sdk-examples)

## Authentication

### Bearer Token Authentication
All API requests require authentication using JWT tokens:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key Authentication (for server-to-server)
```http
X-API-Key: your-api-key-here
```

### Refresh Token Flow
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

## Base URL and Versioning

- **Base URL**: `https://api.ads-pro-platform.com`
- **Current Version**: `v1`
- **Full Base URL**: `https://api.ads-pro-platform.com/v1`

## Request/Response Format

### Content Types
- **Request**: `application/json`
- **Response**: `application/json`
- **File Uploads**: `multipart/form-data`

### Standard Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Error Codes
```typescript
enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

## Rate Limiting

- **Default**: 1000 requests per hour per API key
- **Burst**: 100 requests per minute
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Authentication Endpoints

### POST /auth/login
Authenticate user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "role": "CLIENT",
      "name": "John Doe"
    },
    "tokens": {
      "access_token": "jwt-access-token",
      "refresh_token": "jwt-refresh-token",
      "expires_in": 3600
    }
  }
}
```

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "John Doe",
  "company": "Acme Corp"
}
```

### POST /auth/logout
Invalidate current session.

### POST /auth/refresh
Refresh access token using refresh token.

### POST /auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset-token",
  "password": "new-secure-password"
}
```

## Campaign Management

### GET /campaigns
List user's campaigns with filtering and pagination.

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (DRAFT, ACTIVE, PAUSED, COMPLETED)
- `platform` (string): Filter by platform (META, GOOGLE, TIKTOK, LINKEDIN)
- `search` (string): Search campaigns by name
- `sort` (string): Sort field (name, created_at, budget, status)
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "camp_123",
        "name": "Summer Sale Campaign",
        "platform": "META",
        "status": "ACTIVE",
        "budget": 5000.00,
        "spent": 2347.83,
        "impressions": 125000,
        "clicks": 3420,
        "conversions": 156,
        "ctr": 2.74,
        "cpc": 0.69,
        "conversion_rate": 4.56,
        "roas": 3.21,
        "created_at": "2024-01-10T09:00:00Z",
        "updated_at": "2024-01-15T14:30:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

### POST /campaigns
Create a new campaign.

**Request:**
```json
{
  "name": "New Campaign",
  "platform": "META",
  "objective": "CONVERSIONS",
  "budget": 1000.00,
  "budget_type": "DAILY",
  "target_audience": {
    "age_min": 25,
    "age_max": 45,
    "genders": ["male", "female"],
    "locations": ["US", "CA"],
    "interests": ["technology", "marketing"]
  },
  "creative": {
    "headline": "Amazing Product",
    "description": "Get 50% off today!",
    "image_url": "https://example.com/image.jpg",
    "call_to_action": "SHOP_NOW"
  },
  "schedule": {
    "start_date": "2024-01-20T00:00:00Z",
    "end_date": "2024-02-20T23:59:59Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "camp_456",
      "name": "New Campaign",
      "platform": "META",
      "status": "DRAFT",
      // ... other campaign fields
    }
  }
}
```

### GET /campaigns/{id}
Get campaign details by ID.

### PUT /campaigns/{id}
Update campaign configuration.

### DELETE /campaigns/{id}
Delete a campaign.

### POST /campaigns/{id}/actions
Perform campaign actions (start, pause, stop).

**Request:**
```json
{
  "action": "start"  // start, pause, stop
}
```

## Analytics Endpoints

### GET /analytics/overview
Get high-level analytics overview.

**Query Parameters:**
- `period` (string): Time period (today, yesterday, last_7_days, last_30_days, custom)
- `start_date` (string): Start date for custom period (YYYY-MM-DD)
- `end_date` (string): End date for custom period (YYYY-MM-DD)
- `campaigns` (string): Comma-separated campaign IDs

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_spend": 12450.67,
      "total_impressions": 890000,
      "total_clicks": 23400,
      "total_conversions": 1240,
      "average_ctr": 2.63,
      "average_cpc": 0.53,
      "average_conversion_rate": 5.30,
      "total_roas": 3.45,
      "active_campaigns": 8,
      "period": {
        "start": "2024-01-01T00:00:00Z",
        "end": "2024-01-15T23:59:59Z"
      }
    }
  }
}
```

### GET /analytics/performance
Get detailed performance metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "performance": {
      "daily_metrics": [
        {
          "date": "2024-01-15",
          "spend": 834.50,
          "impressions": 45000,
          "clicks": 1230,
          "conversions": 67,
          "ctr": 2.73,
          "cpc": 0.68,
          "conversion_rate": 5.45,
          "roas": 3.21
        }
      ],
      "platform_breakdown": [
        {
          "platform": "META",
          "spend": 8340.50,
          "impressions": 450000,
          "clicks": 12300,
          "conversions": 670,
          "roas": 3.45
        }
      ]
    }
  }
}
```

### GET /analytics/audience
Get audience insights and demographics.

### GET /analytics/conversion-funnel
Get conversion funnel analysis.

### GET /analytics/cohort
Get cohort analysis data.

## Attribution Engine

### GET /attribution/touchpoints
Get user touchpoints for attribution analysis.

**Query Parameters:**
- `user_id` (string): Specific user ID
- `session_id` (string): Specific session ID
- `campaign_id` (string): Filter by campaign
- `start_date` (string): Date range start
- `end_date` (string): Date range end

**Response:**
```json
{
  "success": true,
  "data": {
    "touchpoints": [
      {
        "id": "touch_123",
        "user_id": "user_456",
        "session_id": "sess_789",
        "campaign_id": "camp_123",
        "platform": "META",
        "touchpoint_type": "IMPRESSION",
        "timestamp": "2024-01-15T10:30:00Z",
        "attribution_weight": 0.25,
        "position": "first_touch",
        "time_to_conversion": 86400,
        "conversion_value": 150.00
      }
    ]
  }
}
```

### POST /attribution/analyze
Analyze attribution for specific conversion events.

**Request:**
```json
{
  "conversion_events": [
    {
      "user_id": "user_456",
      "timestamp": "2024-01-15T15:30:00Z",
      "value": 150.00,
      "event_type": "purchase"
    }
  ],
  "attribution_model": "time_decay",  // first_touch, last_touch, linear, time_decay, position_based
  "lookback_window": 30  // days
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attribution_results": [
      {
        "conversion_id": "conv_123",
        "total_value": 150.00,
        "attributed_touchpoints": [
          {
            "campaign_id": "camp_123",
            "platform": "META",
            "attribution_weight": 0.40,
            "attributed_value": 60.00
          },
          {
            "campaign_id": "camp_456",
            "platform": "GOOGLE",
            "attribution_weight": 0.35,
            "attributed_value": 52.50
          }
        ]
      }
    ]
  }
}
```

### GET /attribution/models
Get available attribution models and their configurations.

## Reporting APIs

### GET /reports
List available reports.

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "report_123",
        "name": "Campaign Performance Report",
        "type": "campaign_performance",
        "status": "completed",
        "created_at": "2024-01-15T09:00:00Z",
        "file_url": "https://storage.ads-pro-platform.com/reports/report_123.pdf",
        "parameters": {
          "period": "last_30_days",
          "campaigns": ["camp_123", "camp_456"]
        }
      }
    ]
  }
}
```

### POST /reports
Generate a new report.

**Request:**
```json
{
  "type": "campaign_performance",  // campaign_performance, attribution_analysis, audience_insights, conversion_funnel
  "name": "Monthly Performance Report",
  "parameters": {
    "period": "last_30_days",
    "campaigns": ["camp_123", "camp_456"],
    "include_charts": true,
    "format": "pdf"  // pdf, excel, csv
  },
  "schedule": {
    "frequency": "monthly",  // once, daily, weekly, monthly
    "start_date": "2024-02-01T00:00:00Z"
  }
}
```

### GET /reports/{id}
Get report details and download link.

### DELETE /reports/{id}
Delete a report.

### GET /reports/templates
Get available report templates.

## User Management

### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CLIENT",
      "company": "Acme Corp",
      "timezone": "America/New_York",
      "preferences": {
        "dashboard_layout": "standard",
        "email_notifications": true,
        "data_retention_days": 90
      },
      "subscription": {
        "plan": "pro",
        "status": "active",
        "billing_cycle": "monthly",
        "next_billing_date": "2024-02-15T00:00:00Z"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "last_login_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /users/profile
Update user profile.

### POST /users/change-password
Change user password.

### GET /users/api-keys
List user's API keys.

### POST /users/api-keys
Generate new API key.

### DELETE /users/api-keys/{id}
Revoke API key.

## Integration APIs

### GET /integrations
List connected integrations.

**Response:**
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "id": "int_123",
        "platform": "META",
        "status": "connected",
        "account_id": "act_123456789",
        "account_name": "Acme Corp - Main",
        "connected_at": "2024-01-10T09:00:00Z",
        "last_sync_at": "2024-01-15T14:30:00Z",
        "permissions": ["read_campaigns", "read_insights"]
      }
    ]
  }
}
```

### POST /integrations/connect
Connect a new platform integration.

**Request:**
```json
{
  "platform": "META",
  "auth_code": "oauth-authorization-code",
  "redirect_uri": "https://your-app.com/callback"
}
```

### DELETE /integrations/{id}
Disconnect an integration.

### POST /integrations/{id}/sync
Trigger manual data synchronization.

### GET /integrations/{id}/status
Get integration sync status and health.

## Real-time WebSocket

### Connection
```javascript
const ws = new WebSocket('wss://api.ads-pro-platform.com/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your-jwt-token'
}));
```

### Event Types

#### Campaign Updates
```json
{
  "type": "campaign_updated",
  "data": {
    "campaign_id": "camp_123",
    "changes": {
      "status": "ACTIVE",
      "spent": 2450.75
    },
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

#### Real-time Metrics
```json
{
  "type": "metrics_update",
  "data": {
    "campaign_id": "camp_123",
    "metrics": {
      "impressions": 125000,
      "clicks": 3420,
      "spend": 2347.83
    },
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

#### Alerts
```json
{
  "type": "alert",
  "data": {
    "alert_id": "alert_123",
    "type": "budget_exceeded",
    "severity": "warning",
    "message": "Campaign budget 80% spent",
    "campaign_id": "camp_123",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

### Subscription Management
```json
// Subscribe to campaign updates
{
  "type": "subscribe",
  "channel": "campaigns",
  "filters": {
    "campaign_ids": ["camp_123", "camp_456"]
  }
}

// Unsubscribe
{
  "type": "unsubscribe",
  "channel": "campaigns"
}
```

## Webhooks

### Configuration
Configure webhooks in your dashboard or via API:

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/ads-pro",
  "events": ["campaign.updated", "conversion.tracked", "budget.exceeded"],
  "secret": "your-webhook-secret"
}
```

### Event Format
```json
{
  "id": "evt_123456789",
  "type": "campaign.updated",
  "data": {
    "campaign": {
      "id": "camp_123",
      "name": "Summer Sale Campaign",
      "status": "ACTIVE",
      // ... campaign data
    }
  },
  "timestamp": "2024-01-15T14:30:00Z",
  "api_version": "v1"
}
```

### Signature Verification
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const AdsProAPI = require('@ads-pro/api-client');

const client = new AdsProAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.ads-pro-platform.com/v1'
});

// Get campaigns
const campaigns = await client.campaigns.list({
  status: 'ACTIVE',
  platform: 'META'
});

// Create campaign
const newCampaign = await client.campaigns.create({
  name: 'New Campaign',
  platform: 'META',
  budget: 1000.00
});

// Real-time updates
client.websocket.on('campaign_updated', (data) => {
  console.log('Campaign updated:', data);
});
```

### Python
```python
from ads_pro_api import Client

client = Client(
    api_key='your-api-key',
    base_url='https://api.ads-pro-platform.com/v1'
)

# Get campaigns
campaigns = client.campaigns.list(
    status='ACTIVE',
    platform='META'
)

# Create campaign
new_campaign = client.campaigns.create({
    'name': 'New Campaign',
    'platform': 'META',
    'budget': 1000.00
})

# Analytics
analytics = client.analytics.overview(
    period='last_30_days'
)
```

### cURL Examples

#### Get Campaigns
```bash
curl -X GET \
  'https://api.ads-pro-platform.com/v1/campaigns?status=ACTIVE' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json'
```

#### Create Campaign
```bash
curl -X POST \
  'https://api.ads-pro-platform.com/v1/campaigns' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New Campaign",
    "platform": "META",
    "budget": 1000.00
  }'
```

---

## Support

For API support and questions:
- **Documentation**: https://docs.ads-pro-platform.com
- **Support Email**: api-support@ads-pro-platform.com
- **Status Page**: https://status.ads-pro-platform.com

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Campaign management endpoints
- Analytics and reporting APIs
- Attribution engine integration
- Real-time WebSocket support
- Webhook system implementation