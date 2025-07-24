import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  // Navigation
  navigation: {
    title: 'Menu',
    dashboard: 'Dashboard',
    campaigns: 'Campaigns',
    analytics: 'Analytics',
    campaignAnalysis: 'Campaign Analysis',
    funnelAnalysis: 'Funnel Analysis',
    settings: 'Settings',
    quickActions: 'Quick Actions',
    refresh: 'Refresh',
    export: 'Export',
    search: 'Search...',
    toggleTheme: 'Toggle Theme',
    logout: 'Logout',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to Ads Pro',
    overview: 'Platform Analysis Overview',
    totalRevenue: 'Total Revenue',
    totalSpend: 'Total Spend',
    totalClicks: 'Total Clicks',
    totalImpressions: 'Total Impressions',
    roas: 'ROAS',
    conversionRate: 'Conversion Rate',
    cpc: 'CPC',
    cpm: 'CPM'
  },

  // Campaigns
  campaigns: {
    title: 'Campaigns',
    description: 'Manage and monitor your campaigns',
    management: 'Campaign Management',
    loading: 'Loading Campaigns...',
    searchPlaceholder: 'Search campaigns...',
    newCampaign: 'New Campaign',
    totalCost: 'Total Cost',
    status: {
      active: 'Active',
      paused: 'Paused',
      completed: 'Completed'
    },
    allStatuses: 'All Statuses',
    platform: 'Platform',
    allPlatforms: 'All Platforms',
    budget: 'Budget',
    spent: 'Spent',
    optionsFor: 'Options for',
    editCampaign: 'Edit Campaign',
    noCampaignsFound: 'No campaigns found',
    noCampaignsDescription: 'Try changing the filters or create a new campaign',
    createCampaign: 'Create Campaign',
    filterAll: 'All',
    filterActive: 'Active',
    filterPaused: 'Paused',
    filterCompleted: 'Completed',
    deleted: 'Deleted',
    spend: 'Spend',
    impressions: 'Impressions',
    clicks: 'Clicks',
    conversions: 'Conversions',
    roas: 'ROAS',
    actions: 'Actions',
    edit: 'Edit',
    pause: 'Pause',
    resume: 'Resume',
    delete: 'Delete',
    refresh: 'Refresh',
    noCampaigns: 'No campaigns found',
    aiInsights: 'AI Insights for All Campaigns'
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    basic: 'Basic',
    advanced: 'Advanced',
    salesKPIs: 'Sales KPIs',
    funnelAnalysis: 'Funnel Analysis',
    dateRange: 'Date Range',
    filters: 'Filters',
    campaign: 'Campaign',
    device: 'Device',
    ageGroup: 'Age Group',
    region: 'Region',
    applyFilters: 'Apply Filters',
    clearFilters: 'Clear Filters',
    export: 'Export',
    refresh: 'Refresh',
    impressions: 'Impressions',
    clicks: 'Clicks',
    ctr: 'CTR',
    cpc: 'CPC'
  },

  // AI Insights
  aiInsights: {
    title: 'Advanced AI Insights',
    subtitle: 'Predictive analytics and automated optimization powered by AI',
    totalInsights: 'Total Insights',
    criticalAlerts: 'Critical Alerts',
    optimizationOpportunities: 'Optimization Opportunities',
    predictedImprovements: 'Predicted Improvements',
    automatedActions: 'Automated Actions',
    aiGeneratedInsights: 'AI-generated insights',
    requireImmediateAttention: 'Require immediate attention',
    readyToImplement: 'Ready to implement',
    expectedPerformanceGains: 'Expected performance gains',
    aiExecutedOptimizations: 'AI-executed optimizations',
    autoOptimizationOn: 'Auto-Optimization ON',
    autoOptimizationOff: 'Auto-Optimization OFF',
    predictions: 'Predictions',
    optimizations: 'Optimizations',
    anomalies: 'Anomalies',
    seasonality: 'Seasonality',
    audience: 'Audience',
    automation: 'Automation',
    performancePredictions: 'Performance Predictions (30 Days)',
    aiPoweredForecasts: 'AI-powered forecasts for key metrics',
    detailedPredictions: 'Detailed Predictions',
    confidenceLevels: 'Confidence levels and contributing factors',
    confidence: 'confidence',
    factors: 'Factors',
    searchOptimizations: 'Search optimizations...',
    allCategories: 'All Categories',
    performance: 'Performance',
    efficiency: 'Efficiency',
    growth: 'Growth',
    costSaving: 'Cost Saving',
    expectedImpact: 'Expected Impact',
    implementation: 'Implementation',
    implementationSteps: 'Implementation Steps',
    risk: 'Risk',
    automated: 'Automated',
    autoApply: 'Auto-Apply',
    applyManually: 'Apply Manually',
    possibleCauses: 'Possible Causes',
    recommendations: 'Recommendations',
    detected: 'Detected',
    pattern: 'Pattern',
    peakDays: 'Peak Days',
    peakHours: 'Peak Hours',
    seasonalFactors: 'Seasonal Factors',
    preferredTime: 'Preferred Time',
    preferredDevice: 'Preferred Device',
    engagementRate: 'Engagement Rate',
    retentionRate: 'Retention Rate',
    opportunities: 'Opportunities',
    risks: 'Risks',
    aiExecutedOptimizationsDesc: 'AI-executed optimizations and their results',
    budgetOptimizations: 'Budget Optimizations',
    aiRecommendedBudget: 'AI-recommended budget adjustments',
    currentBudget: 'Current Budget',
    recommended: 'Recommended',
    expectedROI: 'Expected ROI',
    currentValue: 'Current Value',
    expectedValue: 'Expected Value'
  },

  // Funnel Analysis
  funnelAnalysis: {
    title: 'Funnel Analysis',
    subtitle: 'Track your customer journey from awareness to conversion',
    awareness: 'Awareness',
    consideration: 'Consideration',
    conversion: 'Conversion',
    retention: 'Retention',
    advocacy: 'Advocacy',
    impressions: 'Impressions',
    clicks: 'Clicks',
    leads: 'Leads',
    sales: 'Sales',
    repeatCustomers: 'Repeat Customers',
    referrals: 'Referrals',
    conversionRate: 'Conversion Rate',
    dropOffRate: 'Drop-off Rate',
    costPerStage: 'Cost per Stage',
    revenuePerStage: 'Revenue per Stage',
    tofuToMofu: 'Awareness to Consideration',
    mofuToBofu: 'Consideration to Conversion',
    awarenessStage: 'Awareness Stage',
    considerationStage: 'Consideration Stage',
    conversionStage: 'Conversion Stage',
    fromLastPeriod: 'from last period',
    overallConversion: 'Overall Conversion',
    totalFunnelRevenue: 'Total Funnel Revenue',
    funnelROAS: 'Funnel ROAS',
    filters: 'Filters',
    // Stage descriptions
    awarenessDescription: 'Top of funnel campaigns focused on brand awareness and reaching new audiences',
    considerationDescription: 'Middle of funnel campaigns targeting users who are considering your product',
    conversionDescription: 'Bottom of funnel campaigns focused on converting interested users into customers',
    // Optimization recommendations title
    optimizationRecommendations: 'Funnel Optimization Recommendations',
    optimizationSubtitle: 'AI-powered recommendations to improve funnel performance',
    stagePerformanceComparison: 'Stage Performance Comparison',
    stagePerformanceDescription: 'Detailed comparison of TOFU, MOFU, and BOFU performance metrics',
    // Recommendations
    improveAwarenessCreatives: 'Improve awareness stage ad creatives to increase click-through rates',
    optimizeConsiderationPages: 'Optimize consideration stage landing pages and targeting for better conversion',
    reviewConversionPricing: 'Review conversion stage pricing strategy and offer optimization',
    recommendations: 'Recommendations',
    improveAwarenessCreativesTitle: 'Improve Awareness Stage Ad Creatives',
    improveAwarenessCreativesDesc: 'Low click-through rate indicates ad creative needs optimization',
    optimizeAwarenessFlowTitle: 'Optimize Awareness to Consideration Flow',
    optimizeAwarenessFlowDesc: 'Low conversion from awareness to consideration stage',
    enhanceConsiderationPagesTitle: 'Enhance Consideration Stage Landing Pages',
    enhanceConsiderationPagesDesc: 'Low conversion rate suggests landing page optimization needed',
    optimizeConversionOffersTitle: 'Optimize Conversion Stage Offers',
    optimizeConversionOffersDesc: 'Low ROAS indicates pricing or offer optimization needed',
    endToEndOptimizationTitle: 'End-to-End Funnel Optimization',
    endToEndOptimizationDesc: 'Overall conversion rate is below industry average',
    priorityHigh: 'high priority',
    priorityMedium: 'medium priority',
    priorityLow: 'low priority',
    effortHigh: 'high effort',
    effortMedium: 'medium effort',
    effortLow: 'low effort',
    impact: 'Impact',
    category: 'Category'
  },

  // Sales KPIs
  salesKPIs: {
    title: 'Sales KPIs',
    roas: 'ROAS (Return on Ad Spend)',
    revenue: 'Revenue',
    conversionRate: 'Conversion Rate',
    cpa: 'CPA (Cost per Acquisition)',
    aov: 'AOV (Average Order Value)',
    cac: 'CAC (Customer Acquisition Cost)',
    salesGrowth: 'Sales Growth',
    leadToSaleRate: 'Lead-to-Sale Rate',
    churnRate: 'Churn Rate',
    ltv: 'LTV (Lifetime Value)',
    currentPeriod: 'Current Period',
    previousPeriod: 'Previous Period',
    change: 'Change',
    trend: 'Trend'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    apply: 'Apply',
    clear: 'Clear',
    all: 'All',
    none: 'None',
    select: 'Select',
    choose: 'Choose',
    date: 'Date',
    time: 'Time',
    from: 'From',
    to: 'To',
    between: 'Between',
    and: 'and',
    or: 'or',
    of: 'of',
    total: 'Total',
    average: 'Average',
    minimum: 'Minimum',
    maximum: 'Maximum',
    count: 'Count',
    percentage: 'Percentage',
    currency: 'Currency',
    number: 'Number',
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    name: 'Name',
    description: 'Description',
    status: 'Status',
    type: 'Type',
    category: 'Category',
    priority: 'Priority',
    difficulty: 'Difficulty',
    timeRequired: 'Time Required',
    steps: 'Steps',
    impact: 'Impact',
    improvement: 'Improvement',
    confidence: 'Confidence',
    risk: 'Risk',
    automated: 'Automated',
    manual: 'Manual',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    low: 'Low',
    high: 'High',
    critical: 'Critical',
    pending: 'Pending',
    applied: 'Applied',
    failed: 'Failed',
    reverted: 'Reverted',
    warning: 'Warning',
    info: 'Info',
    saving: 'Saving...',
    testing: 'Testing...',
    analytics: 'Analytics'
  },

  // Landing Page
  landing: {
    // Navigation
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      about: 'About',
      signIn: 'Sign In',
      getStarted: 'Get Started'
    },
    
    // Hero Section
    hero: {
      badge: '#1 Attribution Platform in Greece',
      title: 'Transform Data Into Revenue Through Digital Growth',
      subtitle: 'Professional Digital Marketing & Attribution Platform',
      description: 'Transform your advertising performance with enterprise-grade attribution modeling, AI-powered insights, and data-driven optimization strategies. Trusted by leading agencies to deliver exceptional ROI and sustainable growth.',
      cta: 'Start Free Trial',
      demo: 'Watch Demo (2 min)',
      stats: {
        campaigns: 'Active Campaigns',
        attribution: 'Attribution Models',
        platforms: 'Platform Integrations',
        accuracy: 'Attribution Accuracy'
      }
    },
    
    // Features Section
    features: {
      title: 'Complete Digital Marketing Intelligence Suite',
      subtitle: 'Everything you need to optimize your digital marketing performance and attribution modeling',
      items: {
        attribution: {
          title: 'Multi-Touch Attribution',
          description: 'Advanced attribution modeling across all touchpoints with real-time data processing and cross-platform journey mapping.'
        },
        analytics: {
          title: 'Real-Time Analytics',
          description: 'Comprehensive dashboard with live performance metrics, automated reporting, and intelligent insights.'
        },
        optimization: {
          title: 'AI-Powered Optimization',
          description: 'Smart budget allocation, automated bid management, and predictive performance modeling powered by machine learning.'
        },
        integration: {
          title: 'Platform Integration',
          description: 'Seamless integration with Facebook Ads, Google Ads, TikTok, WooCommerce, and 50+ marketing platforms.'
        },
        funnel: {
          title: 'Funnel Analysis',
          description: 'Complete customer journey tracking from awareness to conversion with detailed performance analysis.'
        },
        reporting: {
          title: 'Advanced Reporting',
          description: 'Custom reports, automated insights, and white-label dashboards for clients and stakeholders.'
        }
      }
    },
    
    // Pricing Section
    pricing: {
      title: 'Choose Your Growth Plan',
      subtitle: 'Flexible pricing designed for agencies, marketers, and enterprises of all sizes',
      monthly: 'Monthly',
      annually: 'Annually',
      save: 'Save 25%',
      plans: {
        starter: {
          name: 'Starter',
          price: '€99',
          description: 'Perfect for small agencies',
          features: [
            'Up to 5 platforms',
            'Basic attribution models',
            'Standard reporting',
            'Email support'
          ],
          cta: 'Start Free Trial'
        },
        professional: {
          name: 'Professional',
          price: '€299', 
          description: 'Most popular for growing agencies',
          popular: 'Most Popular',
          features: [
            'Unlimited platforms',
            'Advanced attribution models',
            'Custom reporting',
            'Priority support',
            'White-label dashboards'
          ],
          cta: 'Start Free Trial'
        },
        enterprise: {
          name: 'Enterprise',
          price: 'Custom',
          description: 'For large organizations',
          features: [
            'Everything in Professional',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantees'
          ],
          cta: 'Contact Sales'
        }
      }
    },
    
    // Testimonials
    testimonials: {
      title: 'Trusted by Marketing Leaders',
      subtitle: 'Join 500+ agencies and brands that trust ADPD for their attribution and performance optimization'
    },
    
    // FAQ Section  
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about ADPD and attribution modeling',
      items: {
        whatIs: {
          question: 'What is multi-touch attribution and why do I need it?',
          answer: 'Multi-touch attribution tracks the entire customer journey across all touchpoints, giving you accurate insights into which channels and campaigns actually drive conversions. This helps you optimize budget allocation and improve ROAS.'
        },
        platforms: {
          question: 'Which platforms does ADPD integrate with?',
          answer: 'ADPD integrates with all major advertising platforms including Facebook Ads, Google Ads, TikTok Ads, LinkedIn Ads, WooCommerce, Shopify, and 50+ other marketing tools and analytics platforms.'
        },
        setup: {
          question: 'How long does setup take?',
          answer: 'Most clients are up and running within 24-48 hours. Our onboarding team will help you connect your platforms and configure attribution models to match your business goals.'
        },
        data: {
          question: 'Is my data secure and compliant?',
          answer: 'Yes, ADPD is GDPR compliant and uses enterprise-grade security. Your data is encrypted, stored securely, and never shared with third parties. We maintain SOC 2 Type II certification.'
        },
        support: {
          question: 'What kind of support do you provide?',
          answer: 'We offer comprehensive support including onboarding assistance, training, email support, and for Enterprise clients, dedicated account management with SLA guarantees.'
        }
      }
    },
    
    // CTA Section
    cta: {
      badge: 'LIMITED TIME: 50% Off First 3 Months',
      title: 'Ready to Transform Your Marketing ROI?',
      subtitle: 'Join leading agencies already using ADPD to optimize their attribution and boost performance',
      button: 'Start Free Trial - Save 50%',
      features: {
        setup: '✅ 15-minute setup',
        trial: '✅ 14-day free trial',
        support: '✅ Free onboarding support',
        cancel: '✅ Cancel anytime'
      }
    }
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'Application Settings',
    description: 'Customize the application to your needs',
    breadcrumb: 'Settings',
    
    // Sections
    generalSettings: 'General Settings',
    displaySettings: 'Display',
    notificationSettings: 'Notifications', 
    advancedSettings: 'Advanced Settings',
    
    // General Settings
    demoMode: 'Demo Mode',
    demoModeDescription: 'Display simulated data for presentations',
    autoRefresh: 'Auto Refresh',
    autoRefreshDescription: 'Automatically refresh data every 5 minutes',
    
    // Display Settings
    theme: 'Theme',
    themeDescription: 'Choose the application theme',
    language: 'Language',
    languageDescription: 'Choose the application language',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    greek: 'Greek',
    english: 'English',
    
    // Notifications
    notifications: 'Notifications',
    notificationsDescription: 'Receive notifications for important events',
    
    // Advanced Settings
    showAdvanced: 'Show Advanced',
    showAdvancedDescription: 'Show advanced configuration options',
    debugMode: 'Debug Mode',
    debugModeDescription: 'Enable debug mode for development',
    performanceMode: 'Performance Mode',
    performanceModeDescription: 'Optimize for better performance',
    advancedWarning: '⚠️ Warning: Advanced settings may affect application performance.',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    quickActionsDescription: 'Useful actions for the application',
    keyboardShortcuts: 'Keyboard Shortcuts',
    keyboardShortcutsDescription: 'View all shortcuts',
    restartTour: 'Restart Tour',
    restartTourDescription: 'Revisit the onboarding',
    exportSettings: 'Export Settings',
    exportSettingsDescription: 'Save your settings',
    importSettings: 'Import Settings',
    importSettingsDescription: 'Load settings',
    
    // Actions
    applyChanges: 'Apply Changes',
    resetSettings: 'Reset',
    save: 'Save Changes',
    cancel: 'Cancel',
    
    // Messages
    settingsExported: 'Settings exported successfully!',
    settingsImported: 'Settings imported successfully!',
    settingsReset: 'Settings reset to defaults',
    onboardingReset: 'Onboarding tour will restart on next visit!',
    invalidSettingsFile: 'Invalid settings file. Please check the file format.',
    settingsLoadError: 'Error loading settings',
    settingsSaveError: 'Error saving settings',
    facebook: {
      title: 'Facebook Connection',
      description: 'Connect your Facebook Ads account to get real campaign data',
      status: 'Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      accessToken: 'Access Token',
      accessTokenPlaceholder: 'Enter your Facebook access token',
      accessTokenHelp: 'Get your access token from Facebook Graph API Explorer',
      adAccountId: 'Ad Account ID',
      adAccountIdHelp: 'Your Facebook Ad Account ID (e.g., act_1234567890)',
      save: 'Save Connection',
      test: 'Test Connection',
      reset: 'Disconnect',
      validationError: 'Please fill in both Access Token and Ad Account ID',
      saveSuccess: 'Facebook connection saved successfully',
      saveError: 'Failed to save Facebook connection',
      resetSuccess: 'Facebook connection reset successfully',
      testSuccess: 'Connection test successful',
      testError: 'Connection test failed',
      testFailed: 'Test Failed',
      campaigns: 'campaigns found',
      helpTitle: 'Need Help?',
      developersLink: 'Facebook Developers',
      graphExplorerLink: 'Graph API Explorer'
    }
  }
};

// Greek translations
const elTranslations = {
  navigation: {
    title: 'Μενού',
    dashboard: 'Αρχική',
    campaigns: 'Καμπάνιες',
    analytics: 'Αναλυτικά Στοιχεία',
    campaignAnalysis: 'Ανάλυση Καμπάνιας',
    funnelAnalysis: 'Funnel Analysis',
    settings: 'Ρυθμίσεις',
    quickActions: 'Γρήγορες Ενέργειες',
    refresh: 'Ανανέωση',
    export: 'Εξαγωγή',
    search: 'Αναζήτηση...',
    toggleTheme: 'Εναλλαγή Θέματος',
    logout: 'Αποσύνδεση',
  },
  // Dashboard
  dashboard: {
    title: 'Αρχική Σελίδα',
    welcome: 'Καλώς ήρθατε στο Ads Pro',
    overview: 'Επισκόπηση Πλατφόρμας',
    totalRevenue: 'Συνολικά Έσοδα',
    totalSpend: 'Συνολικές Δαπάνες',
    totalClicks: 'Συνολικά Κλικ',
    totalImpressions: 'Συνολικές Προβολές',
    roas: 'ROAS',
    conversionRate: 'Conversion Rate',
    cpc: 'CPC',
    cpm: 'CPM'
  },

  // Campaigns
  campaigns: {
    title: 'Καμπάνιες',
    description: 'Διαχείριση και παρακολούθηση των καμπανιών σας',
    management: 'Διαχείριση Καμπανιών',
    loading: 'Φόρτωση Καμπανιών...',
    searchPlaceholder: 'Αναζήτηση καμπανιών...',
    newCampaign: 'Νέα Καμπάνια',
    totalCost: 'Συνολικό Κόστος',
    status: {
      active: 'Ενεργή',
      paused: 'Σε Παύση',
      completed: 'Ολοκληρωμένη'
    },
    allStatuses: 'Όλες οι Καταστάσεις',
    platform: 'Πλατφόρμα',
    allPlatforms: 'Όλες οι Πλατφόρμες',
    budget: 'Προϋπολογισμός',
    spent: 'Δαπάνες',
    optionsFor: 'Επιλογές για',
    editCampaign: 'Επεξεργασία καμπάνιας',
    noCampaignsFound: 'Δεν βρέθηκαν καμπάνιες',
    noCampaignsDescription: 'Δοκιμάστε να αλλάξετε τα φίλτρα ή δημιουργήστε μια νέα καμπάνια',
    createCampaign: 'Δημιουργία Καμπάνιας',
    filterAll: 'Όλες',
    filterActive: 'Ενεργές',
    filterPaused: 'Σε Παύση',
    filterCompleted: 'Ολοκληρωμένες',
    deleted: 'Διαγραμμένες',
    spend: 'Δαπάνες',
    impressions: 'Εμφανίσεις',
    clicks: 'Κλικ',
    conversions: 'Μετατροπές',
    roas: 'ROAS',
    actions: 'Ενέργειες',
    edit: 'Επεξεργασία',
    pause: 'Παύση',
    resume: 'Συνέχιση',
    delete: 'Διαγραφή',
    refresh: 'Ανανέωση',
    noCampaigns: 'Δεν βρέθηκαν καμπάνιες',
    aiInsights: 'AI Insights για Όλες τις Καμπάνιες'
  },

  // Analytics
  analytics: {
    title: 'Αναλυτικά Στοιχεία',
    basic: 'Βασικά',
    advanced: 'Προχωρημένα',
    salesKPIs: 'Sales KPIs',
    funnelAnalysis: 'Funnel Analysis',
    dateRange: 'Εύρος Ημερομηνιών',
    filters: 'Φίλτρα',
    campaign: 'Καμπάνια',
    device: 'Συσκευή',
    ageGroup: 'Ομάδα Ηλικίας',
    region: 'Περιοχή',
    applyFilters: 'Εφαρμογή Φίλτρων',
    clearFilters: 'Καθαρισμός Φίλτρων',
    export: 'Εξαγωγή',
    refresh: 'Ανανέωση',
    impressions: 'Εμφανίσεις',
    clicks: 'Κλικ',
    ctr: 'CTR',
    cpc: 'CPC'
  },

  // AI Insights
  aiInsights: {
    title: 'Advanced AI Insights',
    subtitle: 'Προγνωστική ανάλυση και αυτόματη βελτιστοποίηση με AI',
    totalInsights: 'Total Insights',
    criticalAlerts: 'Κρίσιμες Ειδοποιήσεις',
    optimizationOpportunities: 'Ευκαιρίες Βελτιστοποίησης',
    predictedImprovements: 'Προβλεπόμενες Βελτιώσεις',
    automatedActions: 'Αυτόματες Ενέργειες',
    aiGeneratedInsights: 'AI-generated insights',
    requireImmediateAttention: 'Απαιτούν άμεση προσοχή',
    readyToImplement: 'Έτοιμα για εφαρμογή',
    expectedPerformanceGains: 'Αναμενόμενα κέρδη απόδοσης',
    aiExecutedOptimizations: 'AI-executed optimizations',
    autoOptimizationOn: 'Αυτόματη Βελτιστοποίηση ΕΝΕΡΓΗ',
    autoOptimizationOff: 'Αυτόματη Βελτιστοποίηση ΑΝΕΝΕΡΓΗ',
    predictions: 'Προβλέψεις',
    optimizations: 'Βελτιστοποιήσεις',
    anomalies: 'Ανωμαλίες',
    seasonality: 'Εποχικότητα',
    audience: 'Κοινό',
    automation: 'Αυτοματισμός',
    performancePredictions: 'Προβλέψεις Απόδοσης (30 Ημέρες)',
    aiPoweredForecasts: 'AI-powered forecasts για βασικά metrics',
    detailedPredictions: 'Λεπτομερείς Προβλέψεις',
    confidenceLevels: 'Επίπεδα εμπιστοσύνης και συντελεστές',
    confidence: 'εμπιστοσύνη',
    factors: 'Παράγοντες',
    searchOptimizations: 'Αναζήτηση βελτιστοποιήσεων...',
    allCategories: 'Όλες οι Κατηγορίες',
    performance: 'Απόδοση',
    efficiency: 'Αποδοτικότητα',
    growth: 'Ανάπτυξη',
    costSaving: 'Εξοικονόμηση Κόστους',
    expectedImpact: 'Αναμενόμενο Αντίκτυπο',
    implementation: 'Εφαρμογή',
    implementationSteps: 'Βήματα Εφαρμογής',
    risk: 'Κίνδυνος',
    automated: 'Αυτοματοποιημένο',
    autoApply: 'Αυτόματη Εφαρμογή',
    applyManually: 'Χειροκίνητη Εφαρμογή',
    possibleCauses: 'Πιθανές Αιτίες',
    recommendations: 'Συστάσεις',
    detected: 'Ανιχνεύθηκε',
    pattern: 'Μοτίβο',
    peakDays: 'Ημέρες Κορύφωσης',
    peakHours: 'Ώρες Κορύφωσης',
    seasonalFactors: 'Εποχικοί Παράγοντες',
    preferredTime: 'Προτιμώμενη Ώρα',
    preferredDevice: 'Προτιμώμενη Συσκευή',
    engagementRate: 'Engagement Rate',
    retentionRate: 'Retention Rate',
    opportunities: 'Ευκαιρίες',
    risks: 'Κίνδυνοι',
    aiExecutedOptimizationsDesc: 'AI-executed optimizations και τα αποτελέσματά τους',
    budgetOptimizations: 'Βελτιστοποιήσεις Προϋπολογισμού',
    aiRecommendedBudget: 'AI-recommended budget adjustments',
    currentBudget: 'Τρέχων Προϋπολογισμός',
    recommended: 'Προτεινόμενο',
    expectedROI: 'Expected ROI',
    currentValue: 'Τρέχουσα Τιμή',
    expectedValue: 'Αναμενόμενη Τιμή'
  },

  // Funnel Analysis
  funnelAnalysis: {
    title: 'Funnel Analysis',
    subtitle: 'Παρακολούθηση του customer journey από την ευαισθητοποίηση έως τη μετατροπή',
    awareness: 'Ευαισθητοποίηση',
    consideration: 'Εξέταση',
    conversion: 'Μετατροπή',
    retention: 'Διατήρηση',
    advocacy: 'Advocacy',
    impressions: 'Εμφανίσεις',
    clicks: 'Κλικ',
    leads: 'Leads',
    sales: 'Πωλήσεις',
    repeatCustomers: 'Επαναλαμβανόμενοι Πελάτες',
    referrals: 'Προσφορές',
    conversionRate: 'Conversion Rate',
    dropOffRate: 'Ποσοστό Εγκατάλειψης',
    costPerStage: 'Κόστος ανά Στάδιο',
    revenuePerStage: 'Έσοδα ανά Στάδιο',
    tofuToMofu: 'Ευαισθητοποίηση σε Εξέταση',
    mofuToBofu: 'Εξέταση σε Μετατροπή',
    awarenessStage: 'Στάδιο Ευαισθητοποίησης',
    considerationStage: 'Στάδιο Εξέτασης',
    conversionStage: 'Στάδιο Μετατροπής',
    fromLastPeriod: 'από την προηγούμενη περίοδο',
    overallConversion: 'Συνολική Μετατροπή',
    totalFunnelRevenue: 'Συνολικά Έσοδα Funnel',
    funnelROAS: 'Funnel ROAS',
    filters: 'Φίλτρα',
    // Stage descriptions
    awarenessDescription: 'Καμπάνιες κορυφής του funnel που στοχεύουν στην ευαισθητοποίηση του brand και την προσέγγιση νέου κοινού',
    considerationDescription: 'Καμπάνιες μέσου του funnel που στοχεύουν χρήστες που εξετάζουν το προϊόν σας',
    conversionDescription: 'Καμπάνιες βάσης του funnel που στοχεύουν στη μετατροπή ενδιαφερόμενων χρηστών σε πελάτες',
    // Optimization recommendations title
    optimizationRecommendations: 'Προτάσεις Βελτιστοποίησης Funnel',
    optimizationSubtitle: 'Προτάσεις βασισμένες σε AI για βελτίωση της απόδοσης του funnel',
    stagePerformanceComparison: 'Σύγκριση Απόδοσης Σταδίων',
    stagePerformanceDescription: 'Λεπτομερής σύγκριση των μετρικών απόδοσης TOFU, MOFU και BOFU',
    // Recommendations
    improveAwarenessCreatives: 'Βελτιώστε τις διαφημίσεις ευαισθητοποίησης για αύξηση των κλικ',
    optimizeConsiderationPages: 'Βελτιστοποιήστε τις σελίδες και το targeting του σταδίου εξέτασης',
    reviewConversionPricing: 'Αναθεωρήστε τη στρατηγική τιμολόγησης στο στάδιο μετατροπής',
    recommendations: 'Προτάσεις',
    improveAwarenessCreativesTitle: 'Βελτίωση Διαφημίσεων Ευαισθητοποίησης',
    improveAwarenessCreativesDesc: 'Το χαμηλό ποσοστό κλικ δείχνει ότι χρειάζεται βελτιστοποίηση των διαφημίσεων',
    optimizeAwarenessFlowTitle: 'Βελτιστοποίηση Ροής Ευαισθητοποίησης σε Εξέταση',
    optimizeAwarenessFlowDesc: 'Χαμηλή μετατροπή από το στάδιο ευαισθητοποίησης στο στάδιο εξέτασης',
    enhanceConsiderationPagesTitle: 'Βελτίωση Σελίδων Σταδίου Εξέτασης',
    enhanceConsiderationPagesDesc: 'Το χαμηλό ποσοστό μετατροπής δείχνει ανάγκη βελτιστοποίησης των σελίδων',
    optimizeConversionOffersTitle: 'Βελτιστοποίηση Προσφορών Μετατροπής',
    optimizeConversionOffersDesc: 'Το χαμηλό ROAS δείχνει ανάγκη βελτιστοποίησης τιμολόγησης ή προσφορών',
    endToEndOptimizationTitle: 'Βελτιστοποίηση από Άκρο σε Άκρο',
    endToEndOptimizationDesc: 'Το συνολικό ποσοστό μετατροπής είναι κάτω από τον μέσο όρο της βιομηχανίας',
    priorityHigh: 'υψηλή προτεραιότητα',
    priorityMedium: 'μέτρια προτεραιότητα',
    priorityLow: 'χαμηλή προτεραιότητα',
    effortHigh: 'υψηλή προσπάθεια',
    effortMedium: 'μέτρια προσπάθεια',
    effortLow: 'χαμηλή προσπάθεια',
    impact: 'Επίδραση',
    category: 'Κατηγορία'
  },

  // Sales KPIs
  salesKPIs: {
    title: 'KPIs Πωλήσεων',
    roas: 'ROAS (Return on Ad Spend)',
    revenue: 'Έσοδα',
    conversionRate: 'Conversion Rate',
    cpa: 'CPA (Cost per Acquisition)',
    aov: 'AOV (Average Order Value)',
    cac: 'CAC (Customer Acquisition Cost)',
    salesGrowth: 'Ανάπτυξη Πωλήσεων',
    leadToSaleRate: 'Ποσοστό Lead-to-Sale',
    churnRate: 'Ποσοστό Churn',
    ltv: 'LTV (Lifetime Value)',
    currentPeriod: 'Τρέχουσα Περίοδος',
    previousPeriod: 'Προηγούμενη Περίοδος',
    change: 'Αλλαγή',
    trend: 'Τάση'
  },

  // Common
  common: {
    loading: 'Φόρτωση...',
    error: 'Σφάλμα',
    success: 'Επιτυχία',
    save: 'Αποθήκευση',
    cancel: 'Ακύρωση',
    delete: 'Διαγραφή',
    edit: 'Επεξεργασία',
    add: 'Προσθήκη',
    remove: 'Αφαίρεση',
    search: 'Αναζήτηση',
    filter: 'Φίλτρο',
    sort: 'Ταξινόμηση',
    export: 'Εξαγωγή',
    import: 'Εισαγωγή',
    download: 'Λήψη',
    upload: 'Μεταφόρτωση',
    yes: 'Ναι',
    no: 'Όχι',
    ok: 'OK',
    close: 'Κλείσιμο',
    back: 'Πίσω',
    next: 'Επόμενο',
    previous: 'Προηγούμενο',
    submit: 'Υποβολή',
    reset: 'Επαναφορά',
    apply: 'Εφαρμογή',
    clear: 'Καθαρισμός',
    all: 'Όλα',
    none: 'Κανένα',
    select: 'Επιλογή',
    choose: 'Επιλογή',
    date: 'Ημερομηνία',
    time: 'Ώρα',
    from: 'Από',
    to: 'Έως',
    between: 'Μεταξύ',
    and: 'και',
    or: 'ή',
    of: 'από',
    total: 'Σύνολο',
    average: 'Μέσος Όρος',
    minimum: 'Ελάχιστο',
    maximum: 'Μέγιστο',
    count: 'Αριθμός',
    percentage: 'Ποσοστό',
    currency: 'Νόμισμα',
    number: 'Αριθμός',
    text: 'Κείμενο',
    email: 'Email',
    phone: 'Τηλέφωνο',
    address: 'Διεύθυνση',
    name: 'Όνομα',
    description: 'Περιγραφή',
    status: 'Κατάσταση',
    type: 'Τύπος',
    category: 'Κατηγορία',
    priority: 'Προτεραιότητα',
    difficulty: 'Δυσκολία',
    timeRequired: 'Απαιτούμενος Χρόνος',
    steps: 'Βήματα',
    impact: 'Αντίκτυπο',
    improvement: 'Βελτίωση',
    confidence: 'Εμπιστοσύνη',
    risk: 'Κίνδυνος',
    automated: 'Αυτοματοποιημένο',
    manual: 'Χειροκίνητο',
    easy: 'Εύκολο',
    medium: 'Μεσαίο',
    hard: 'Δύσκολο',
    low: 'Χαμηλό',
    high: 'Υψηλό',
    critical: 'Κρίσιμο',
    pending: 'Σε Εκκρεμότητα',
    applied: 'Εφαρμοσμένο',
    failed: 'Αποτυχία',
    reverted: 'Αναστρέφθηκε',
    warning: 'Προειδοποίηση',
    info: 'Πληροφορίες',
    saving: 'Αποθήκευση...',
    testing: 'Δοκιμή...',
    analytics: 'Αναλυτικά'
  },

  // Landing Page
  landing: {
    // Navigation
    nav: {
      features: 'Χαρακτηριστικά',
      pricing: 'Τιμολόγηση',
      about: 'Σχετικά',
      signIn: 'Σύνδεση',
      getStarted: 'Ξεκινήστε'
    },
    
    // Hero Section
    hero: {
      badge: '#1 Attribution Platform στην Ελλάδα',
      title: 'Μετατρέπουμε Δεδομένα σε Έσοδα Μέσω Digital Growth',
      subtitle: 'Professional Digital Marketing & Attribution Platform',
      description: 'Μετασχηματίστε την απόδοση των διαφημίσεών σας με enterprise-grade attribution modeling, AI-powered insights και data-driven στρατηγικές βελτιστοποίησης. Εμπιστεύονται κορυφαία agencies για εξαιρετικό ROI και βιώσιμη ανάπτυξη.',
      cta: 'Ξεκινήστε Δωρεάν Δοκιμή',
      demo: 'Δείτε Demo (2 λεπτά)',
      stats: {
        campaigns: 'Ενεργές Καμπάνιες',
        attribution: 'Attribution Models',
        platforms: 'Platform Integrations',
        accuracy: 'Attribution Accuracy'
      }
    },
    
    // Features Section
    features: {
      title: 'Ολοκληρωμένη Suite Digital Marketing Intelligence',
      subtitle: 'Όλα όσα χρειάζεστε για να βελτιστοποιήσετε την απόδοση του digital marketing και το attribution modeling σας',
      items: {
        attribution: {
          title: 'Multi-Touch Attribution',
          description: 'Προηγμένο attribution modeling σε όλα τα touchpoints με real-time επεξεργασία δεδομένων και cross-platform journey mapping.'
        },
        analytics: {
          title: 'Real-Time Analytics',
          description: 'Ολοκληρωμένο dashboard με live performance metrics, αυτοματοποιημένη αναφορά και intelligent insights.'
        },
        optimization: {
          title: 'AI-Powered Optimization',
          description: 'Smart budget allocation, αυτοματοποιημένη διαχείριση bids και predictive performance modeling με machine learning.'
        },
        integration: {
          title: 'Platform Integration',
          description: 'Απρόσκοπτη ενσωμάτωση με Facebook Ads, Google Ads, TikTok, WooCommerce και 50+ marketing πλατφόρμες.'
        },
        funnel: {
          title: 'Funnel Analysis',
          description: 'Πλήρης παρακολούθηση του customer journey από την ευαισθητοποίηση έως τη μετατροπή με λεπτομερή ανάλυση απόδοσης.'
        },
        reporting: {
          title: 'Advanced Reporting',
          description: 'Custom αναφορές, αυτοματοποιημένα insights και white-label dashboards για πελάτες και stakeholders.'
        }
      }
    },
    
    // Pricing Section
    pricing: {
      title: 'Επιλέξτε το Πλάνο Ανάπτυξής σας',
      subtitle: 'Ευέλικτη τιμολόγηση σχεδιασμένη για agencies, marketers και επιχειρήσεις κάθε μεγέθους',
      monthly: 'Μηνιαίο',
      annually: 'Ετήσιο',
      save: 'Εξοικονομήστε 25%',
      plans: {
        starter: {
          name: 'Starter',
          price: '€99',
          description: 'Ιδανικό για μικρά agencies',
          features: [
            'Έως 5 πλατφόρμες',
            'Βασικά attribution models',
            'Standard αναφορές',
            'Email υποστήριξη'
          ],
          cta: 'Ξεκινήστε Δωρεάν Δοκιμή'
        },
        professional: {
          name: 'Professional',
          price: '€299', 
          description: 'Το πιο δημοφιλές για αναπτυσσόμενα agencies',
          popular: 'Πιο Δημοφιλές',
          features: [
            'Απεριόριστες πλατφόρμες',
            'Προηγμένα attribution models',
            'Custom αναφορές',
            'Priority υποστήριξη',
            'White-label dashboards'
          ],
          cta: 'Ξεκινήστε Δωρεάν Δοκιμή'
        },
        enterprise: {
          name: 'Enterprise',
          price: 'Custom',
          description: 'Για μεγάλους οργανισμούς',
          features: [
            'Όλα τα Professional',
            'Αφιερωμένος account manager',
            'Custom integrations',
            'SLA εγγυήσεις'
          ],
          cta: 'Επικοινωνήστε με Πωλήσεις'
        }
      }
    },
    
    // Testimonials
    testimonials: {
      title: 'Εμπιστεύονται οι Ηγέτες του Marketing',
      subtitle: 'Συμμετέχετε σε 500+ agencies και brands που εμπιστεύονται το ADPD για το attribution και την βελτιστοποίηση απόδοσής τους'
    },
    
    // FAQ Section  
    faq: {
      title: 'Συχνές Ερωτήσεις',
      subtitle: 'Όλα όσα χρειάζεται να γνωρίζετε για το ADPD και το attribution modeling',
      items: {
        whatIs: {
          question: 'Τι είναι το multi-touch attribution και γιατί το χρειάζομαι;',
          answer: 'Το multi-touch attribution παρακολουθεί ολόκληρο το customer journey σε όλα τα touchpoints, δίνοντάς σας ακριβή insights για το ποια κανάλια και καμπάνιες πραγματικά οδηγούν σε conversions. Αυτό σας βοηθά να βελτιστοποιήσετε την κατανομή budget και να βελτιώσετε το ROAS.'
        },
        platforms: {
          question: 'Με ποιες πλατφόρμες ενσωματώνεται το ADPD;',
          answer: 'Το ADPD ενσωματώνεται με όλες τις μεγάλες διαφημιστικές πλατφόρμες συμπεριλαμβανομένων Facebook Ads, Google Ads, TikTok Ads, LinkedIn Ads, WooCommerce, Shopify και 50+ άλλα marketing tools και analytics πλατφόρμες.'
        },
        setup: {
          question: 'Πόσο χρόνο χρειάζεται η εγκατάσταση;',
          answer: 'Οι περισσότεροι πελάτες είναι έτοιμοι εντός 24-48 ωρών. Η ομάδα onboarding μας θα σας βοηθήσει να συνδέσετε τις πλατφόρμες σας και να ρυθμίσετε attribution models που ταιριάζουν στους επιχειρηματικούς σας στόχους.'
        },
        data: {
          question: 'Είναι τα δεδομένα μου ασφαλή και compliant;',
          answer: 'Ναι, το ADPD είναι GDPR compliant και χρησιμοποιεί enterprise-grade ασφάλεια. Τα δεδομένα σας είναι κρυπτογραφημένα, αποθηκευμένα ασφαλώς και δεν μοιράζονται ποτέ με τρίτους. Διατηρούμε SOC 2 Type II πιστοποίηση.'
        },
        support: {
          question: 'Τι είδους υποστήριξη παρέχετε;',
          answer: 'Προσφέρουμε ολοκληρωμένη υποστήριξη συμπεριλαμβανομένης της βοήθειας onboarding, εκπαίδευσης, email υποστήριξης και για Enterprise πελάτες, αφιερωμένη διαχείριση λογαριασμού με SLA εγγυήσεις.'
        }
      }
    },
    
    // CTA Section
    cta: {
      badge: 'ΠΕΡΙΟΡΙΣΜΕΝΟΣ ΧΡΟΝΟΣ: 50% Έκπτωση Πρώτους 3 Μήνες',
      title: 'Έτοιμοι να Μετασχηματίσετε το Marketing ROI σας;',
      subtitle: 'Συμμετέχετε σε κορυφαία agencies που ήδη χρησιμοποιούν το ADPD για να βελτιστοποιήσουν το attribution τους και να ενισχύσουν την απόδοση',
      button: 'Ξεκινήστε Δωρεάν Δοκιμή - Εξοικονομήστε 50%',
      features: {
        setup: '✅ 15-λεπτη εγκατάσταση',
        trial: '✅ 14-ημερη δωρεάν δοκιμή',
        support: '✅ Δωρεάν onboarding υποστήριξη',
        cancel: '✅ Ακύρωση οποτεδήποτε'
      }
    }
  },

  // Settings
  settings: {
    title: 'Ρυθμίσεις',
    subtitle: 'Ρυθμίσεις Εφαρμογής',
    description: 'Προσαρμόστε την εφαρμογή στις ανάγκες σας',
    breadcrumb: 'Ρυθμίσεις',
    
    // Sections
    generalSettings: 'Γενικές Ρυθμίσεις',
    displaySettings: 'Εμφάνιση',
    notificationSettings: 'Ειδοποιήσεις',
    advancedSettings: 'Προχωρημένες Ρυθμίσεις',
    
    // General Settings
    demoMode: 'Demo Mode',
    demoModeDescription: 'Εμφάνιση προσομοιωμένων δεδομένων για παρουσιάσεις',
    autoRefresh: 'Αυτόματη Ενημέρωση',
    autoRefreshDescription: 'Αυτόματη ενημέρωση δεδομένων κάθε 5 λεπτά',
    
    // Display Settings
    theme: 'Θέμα',
    themeDescription: 'Επιλέξτε το θέμα της εφαρμογής',
    language: 'Γλώσσα',
    languageDescription: 'Επιλέξτε τη γλώσσα της εφαρμογής',
    lightTheme: 'Φωτεινό',
    darkTheme: 'Σκοτεινό',
    systemTheme: 'Σύστημα',
    greek: 'Ελληνικά',
    english: 'English',
    
    // Notifications
    notifications: 'Ειδοποιήσεις',
    notificationsDescription: 'Λήψη ειδοποιήσεων για σημαντικά γεγονότα',
    
    // Advanced Settings
    showAdvanced: 'Εμφάνιση Προχωρημένων',
    showAdvancedDescription: 'Εμφάνιση προχωρημένων επιλογών ρυθμίσεων',
    debugMode: 'Debug Mode',
    debugModeDescription: 'Ενεργοποίηση debug mode για ανάπτυξη',
    performanceMode: 'Performance Mode',
    performanceModeDescription: 'Βελτιστοποίηση για καλύτερη απόδοση',
    advancedWarning: '⚠️ Προσοχή: Οι προχωρημένες ρυθμίσεις μπορεί να επηρεάσουν την απόδοση της εφαρμογής.',
    
    // Quick Actions
    quickActions: 'Γρήγορες Ενέργειες',
    quickActionsDescription: 'Χρήσιμες ενέργειες για την εφαρμογή',
    keyboardShortcuts: 'Keyboard Shortcuts',
    keyboardShortcutsDescription: 'Δείτε όλα τα shortcuts',
    restartTour: 'Επανεκκίνηση Tour',
    restartTourDescription: 'Ξαναδείτε το onboarding',
    exportSettings: 'Εξαγωγή Ρυθμίσεων',
    exportSettingsDescription: 'Αποθηκεύστε τις ρυθμίσεις',
    importSettings: 'Εισαγωγή Ρυθμίσεων',
    importSettingsDescription: 'Φόρτωση ρυθμίσεων',
    
    // Actions
    applyChanges: 'Εφαρμογή Αλλαγών',
    resetSettings: 'Επαναφορά',
    save: 'Αποθήκευση Αλλαγών',
    cancel: 'Ακύρωση',
    
    // Messages
    settingsExported: 'Οι ρυθμίσεις εξήχθησαν επιτυχώς!',
    settingsImported: 'Οι ρυθμίσεις εισήχθησαν επιτυχώς!',
    settingsReset: 'Οι ρυθμίσεις επαναφέρθηκαν στις προεπιλογές',
    onboardingReset: 'Το onboarding tour θα ξεκινήσει στην επόμενη επίσκεψη!',
    invalidSettingsFile: 'Μη έγκυρο αρχείο ρυθμίσεων. Παρακαλώ ελέγξτε τη μορφή του αρχείου.',
    settingsLoadError: 'Σφάλμα κατά τη φόρτωση των ρυθμίσεων',
    settingsSaveError: 'Σφάλμα κατά την αποθήκευση των ρυθμίσεων',
    facebook: {
      title: 'Σύνδεση Facebook',
      description: 'Συνδέστε τον λογαριασμό Facebook Ads σας για πραγματικά δεδομένα καμπανιών',
      status: 'Κατάσταση',
      connected: 'Συνδεδεμένο',
      disconnected: 'Μη Συνδεδεμένο',
      accessToken: 'Access Token',
      accessTokenPlaceholder: 'Εισάγετε το access token σας',
      accessTokenHelp: 'Πάρτε το access token από το Facebook Graph API Explorer',
      adAccountId: 'Ad Account ID',
      adAccountIdHelp: 'Το Facebook Ad Account ID σας (π.χ., act_1234567890)',
      save: 'Αποθήκευση Σύνδεσης',
      test: 'Δοκιμή Σύνδεσης',
      reset: 'Αποσύνδεση',
      validationError: 'Παρακαλώ συμπληρώστε τόσο το Access Token όσο και το Ad Account ID',
      saveSuccess: 'Η σύνδεση Facebook αποθηκεύτηκε επιτυχώς',
      saveError: 'Αποτυχία αποθήκευσης σύνδεσης Facebook',
      resetSuccess: 'Η σύνδεση Facebook επαναφέρθηκε επιτυχώς',
      testSuccess: 'Η δοκιμή σύνδεσης ήταν επιτυχής',
      testError: 'Η δοκιμή σύνδεσης απέτυχε',
      testFailed: 'Η Δοκιμή Απέτυχε',
      campaigns: 'καμπάνιες βρέθηκαν',
      helpTitle: 'Χρειάζεστε Βοήθεια;',
      developersLink: 'Facebook Developers',
      graphExplorerLink: 'Graph API Explorer'
    }
  }
};

// i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      el: {
        translation: elTranslations
      }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n; 