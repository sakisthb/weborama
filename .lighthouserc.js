// Lighthouse CI Configuration - Option D Implementation
// Performance testing configuration for automated CI/CD pipeline

module.exports = {
  ci: {
    // Server configuration
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/campaigns',
        'http://localhost:3000/analytics',
        'http://localhost:3000/reports'
      ],
      
      // Lighthouse settings
      numberOfRuns: 3,
      settings: {
        // Performance-focused audit
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        
        // Chrome flags for consistent testing
        chromeFlags: [
          '--headless',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--ignore-certificate-errors'
        ],
        
        // Throttling settings for consistent results
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        
        // Desktop form factor for consistent testing
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    },
    
    // Assertions for performance thresholds
    assert: {
      assertions: {
        // Performance metrics
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 4000 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 1 }],
        'unused-javascript': ['warn', { maxLength: 1 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        'uses-webp-images': ['warn', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        
        // Accessibility
        'color-contrast': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'label': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        
        // Best practices
        'is-on-https': ['error', { minScore: 1 }],
        'uses-http2': ['warn', { minScore: 1 }],
        'no-vulnerable-libraries': ['error', { minScore: 1 }],
        
        // SEO
        'meta-description': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'crawlable-anchors': ['error', { minScore: 1 }]
      }
    },
    
    // Upload configuration
    upload: {
      target: 'temporary-public-storage',
      
      // GitHub App configuration (when available)
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      
      // Server upload (if using LHCI server)
      serverBaseUrl: process.env.LHCI_SERVER_BASE_URL,
      token: process.env.LHCI_SERVER_TOKEN
    },
    
    // Server configuration (if running LHCI server)
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db'
      }
    }
  }
};