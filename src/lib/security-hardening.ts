// Security Hardening System - Option D Implementation
// Comprehensive security measures and vulnerability protection

import { errorHandler } from './error-handler';
import { performanceMonitor } from './performance-monitoring';
import { config } from '../config/environment';

export interface SecurityConfig {
  csp: {
    enabled: boolean;
    policy: string;
    reportUri?: string;
  };
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
    skipSuccessfulRequests: boolean;
  };
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  session: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
  xss: {
    enabled: boolean;
    mode: 'block' | 'filter';
  };
  csrf: {
    enabled: boolean;
    tokenLength: number;
    cookieName: string;
  };
}

export interface SecurityViolation {
  id: string;
  type: 'xss' | 'csrf' | 'injection' | 'bruteforce' | 'suspicious' | 'ratelimit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  payload?: string;
  timestamp: Date;
  blocked: boolean;
  details: { [key: string]: any };
}

export interface SecurityMetrics {
  totalViolations: number;
  blockedAttacks: number;
  suspiciousRequests: number;
  rateLimitHits: number;
  xssAttempts: number;
  csrfAttempts: number;
  injectionAttempts: number;
  bruteForceAttempts: number;
  last24Hours: {
    violations: number;
    blocked: number;
    topAttackTypes: { [type: string]: number };
  };
}

class SecurityHardeningSystem {
  private violations: SecurityViolation[] = [];
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private csrfTokens: Map<string, { token: string; expiry: number }> = new Map();
  private suspiciousIPs: Set<string> = new Set();
  private config: SecurityConfig;

  constructor() {
    this.config = this.loadSecurityConfig();
    this.initializeSecurity();
    console.log('🛡️ [Security] Hardening system initialized');
  }

  private loadSecurityConfig(): SecurityConfig {
    return {
      csp: {
        enabled: config.security.helmet.contentSecurityPolicy,
        policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.ads-pro-platform.com wss:; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';",
        reportUri: '/api/csp-report'
      },
      rateLimit: {
        enabled: config.security.rateLimiting.enabled,
        maxRequests: config.security.rateLimiting.maxRequests,
        windowMs: config.security.rateLimiting.windowMs,
        skipSuccessfulRequests: false
      },
      encryption: {
        algorithm: 'aes-256-gcm',
        keyLength: 32,
        ivLength: 16
      },
      session: {
        secure: config.environment === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      xss: {
        enabled: true,
        mode: 'block'
      },
      csrf: {
        enabled: true,
        tokenLength: 32,
        cookieName: '_csrf'
      }
    };
  }

  private initializeSecurity(): void {
    // Initialize CSP
    if (this.config.csp.enabled) {
      this.setupContentSecurityPolicy();
    }

    // Initialize XSS protection
    if (this.config.xss.enabled) {
      this.setupXSSProtection();
    }

    // Initialize CSRF protection
    if (this.config.csrf.enabled) {
      this.setupCSRFProtection();
    }

    // Setup security headers
    this.setupSecurityHeaders();

    // Initialize input validation
    this.setupInputValidation();

    // Setup request monitoring
    this.setupRequestMonitoring();

    console.log('✅ [Security] All security measures activated');
  }

  private setupContentSecurityPolicy(): void {
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = this.config.csp.policy;
      document.head.appendChild(meta);

      // CSP violation reporting
      document.addEventListener('securitypolicyviolation', (e) => {
        this.reportSecurityViolation({
          type: 'xss',
          severity: 'high',
          description: `CSP violation: ${e.violatedDirective}`,
          url: e.documentURI,
          payload: e.blockedURI,
          details: {
            directive: e.violatedDirective,
            originalPolicy: e.originalPolicy,
            sourceFile: e.sourceFile,
            lineNumber: e.lineNumber
          }
        });
      });
    }

    console.log('🛡️ [Security] Content Security Policy activated');
  }

  private setupXSSProtection(): void {
    // Input sanitization for common XSS vectors
    this.addGlobalInputSanitization();

    // DOM mutation observer for suspicious changes
    if (typeof window !== 'undefined' && window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.scanForSuspiciousContent(node as Element);
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'onclick', 'onload']
      });
    }

    console.log('🛡️ [Security] XSS protection activated');
  }

  private addGlobalInputSanitization(): void {
    if (typeof window !== 'undefined') {
      // Override dangerous methods
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        
        // Monitor script creation
        if (tagName.toLowerCase() === 'script') {
          console.warn('🚨 [Security] Script element created dynamically');
        }
        
        return element;
      };

      // Monitor innerHTML assignments
      const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')?.set;
      if (originalInnerHTMLSetter) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
          set: function(value: string) {
            const sanitized = this.sanitizeHTML(value);
            if (sanitized !== value) {
              console.warn('🚨 [Security] Potentially malicious HTML blocked');
            }
            originalInnerHTMLSetter.call(this, sanitized);
          },
          get: function() {
            return this.innerHTML;
          }
        });
      }
    }
  }

  private sanitizeHTML(html: string): string {
    // Basic HTML sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, 'data:text/plain')
      .replace(/vbscript:/gi, '')
      .replace(/file:/gi, '');
  }

  private scanForSuspiciousContent(element: Element): void {
    // Check for suspicious attributes
    const suspiciousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    suspiciousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        this.reportSecurityViolation({
          type: 'xss',
          severity: 'high',
          description: `Suspicious event handler detected: ${attr}`,
          payload: element.getAttribute(attr) || '',
          details: {
            tagName: element.tagName,
            attribute: attr
          }
        });
      }
    });

    // Check for suspicious URLs
    const urlAttributes = ['src', 'href', 'action'];
    urlAttributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && this.isSuspiciousURL(value)) {
        this.reportSecurityViolation({
          type: 'xss',
          severity: 'medium',
          description: `Suspicious URL detected in ${attr}`,
          payload: value,
          details: {
            tagName: element.tagName,
            attribute: attr
          }
        });
      }
    });
  }

  private isSuspiciousURL(url: string): boolean {
    const suspiciousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /file:/i,
      /\.exe$/i,
      /\.bat$/i,
      /\.scr$/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  private setupCSRFProtection(): void {
    // Generate CSRF token for the session
    const token = this.generateCSRFToken();
    this.setCSRFToken(token);

    // Add CSRF token to all forms
    if (typeof document !== 'undefined') {
      this.addCSRFTokenToForms();

      // Monitor form submissions
      document.addEventListener('submit', (e) => {
        if (e.target instanceof HTMLFormElement) {
          this.validateCSRFToken(e.target);
        }
      });
    }

    console.log('🛡️ [Security] CSRF protection activated');
  }

  private generateCSRFToken(): string {
    const array = new Uint8Array(this.config.csrf.tokenLength);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for non-browser environments
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private setCSRFToken(token: string): void {
    const sessionId = this.getCurrentSessionId();
    this.csrfTokens.set(sessionId, {
      token,
      expiry: Date.now() + this.config.session.maxAge
    });

    // Set cookie
    if (typeof document !== 'undefined') {
      document.cookie = `${this.config.csrf.cookieName}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${this.config.session.maxAge / 1000}`;
    }
  }

  private getCurrentSessionId(): string {
    // In a real implementation, this would get the actual session ID
    return 'current-session';
  }

  private addCSRFTokenToForms(): void {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (!form.querySelector('input[name="_csrf"]')) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = '_csrf';
        input.value = this.getCSRFToken();
        form.appendChild(input);
      }
    });
  }

  private getCSRFToken(): string {
    const sessionId = this.getCurrentSessionId();
    const tokenData = this.csrfTokens.get(sessionId);
    
    if (!tokenData || tokenData.expiry < Date.now()) {
      const newToken = this.generateCSRFToken();
      this.setCSRFToken(newToken);
      return newToken;
    }
    
    return tokenData.token;
  }

  private validateCSRFToken(form: HTMLFormElement): boolean {
    const tokenInput = form.querySelector('input[name="_csrf"]') as HTMLInputElement;
    if (!tokenInput) {
      this.reportSecurityViolation({
        type: 'csrf',
        severity: 'high',
        description: 'Form submission without CSRF token',
        details: {
          formAction: form.action,
          formMethod: form.method
        }
      });
      return false;
    }

    const sessionId = this.getCurrentSessionId();
    const tokenData = this.csrfTokens.get(sessionId);
    
    if (!tokenData || tokenData.token !== tokenInput.value) {
      this.reportSecurityViolation({
        type: 'csrf',
        severity: 'critical',
        description: 'Invalid CSRF token in form submission',
        details: {
          formAction: form.action,
          providedToken: tokenInput.value
        }
      });
      return false;
    }

    return true;
  }

  private setupSecurityHeaders(): void {
    // This would typically be handled by the server/nginx
    // But we can set some via meta tags for client-side enforcement
    if (typeof document !== 'undefined') {
      const headers = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
      ];

      headers.forEach(header => {
        const meta = document.createElement('meta');
        meta.httpEquiv = header.name;
        meta.content = header.content;
        document.head.appendChild(meta);
      });
    }

    console.log('🛡️ [Security] Security headers configured');
  }

  private setupInputValidation(): void {
    // Global input validation
    if (typeof document !== 'undefined') {
      document.addEventListener('input', (e) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          this.validateInput(e.target);
        }
      });
    }

    console.log('🛡️ [Security] Input validation activated');
  }

  private validateInput(input: HTMLInputElement | HTMLTextAreaElement): void {
    const value = input.value;
    
    // Check for common injection patterns
    const injectionPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+.*set/i
    ];

    injectionPatterns.forEach(pattern => {
      if (pattern.test(value)) {
        this.reportSecurityViolation({
          type: 'injection',
          severity: 'high',
          description: 'Potential injection attempt detected in input',
          payload: value,
          details: {
            inputType: input.type,
            inputName: input.name,
            pattern: pattern.source
          }
        });

        // Sanitize the input
        input.value = this.sanitizeInput(value);
      }
    });
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/[<>'"]/g, '');
  }

  private setupRequestMonitoring(): void {
    // Monitor fetch requests
    if (typeof window !== 'undefined' && window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        
        // Check rate limiting
        if (!this.checkRateLimit()) {
          this.reportSecurityViolation({
            type: 'ratelimit',
            severity: 'medium',
            description: 'Rate limit exceeded',
            url: url
          });
          throw new Error('Rate limit exceeded');
        }

        // Monitor suspicious requests
        if (this.isSuspiciousRequest(url, init)) {
          this.reportSecurityViolation({
            type: 'suspicious',
            severity: 'medium',
            description: 'Suspicious request detected',
            url: url,
            details: {
              method: init?.method,
              headers: init?.headers
            }
          });
        }

        return originalFetch.call(this, input, init);
      };
    }

    console.log('🛡️ [Security] Request monitoring activated');
  }

  private checkRateLimit(): boolean {
    if (!this.config.rateLimit.enabled) return true;

    const now = Date.now();
    const clientId = this.getClientIdentifier();
    const limit = this.rateLimitMap.get(clientId);

    if (!limit || now > limit.resetTime) {
      this.rateLimitMap.set(clientId, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs
      });
      return true;
    }

    if (limit.count >= this.config.rateLimit.maxRequests) {
      return false;
    }

    limit.count++;
    return true;
  }

  private getClientIdentifier(): string {
    // In a real implementation, this would use IP address or user ID
    return 'client-' + (typeof window !== 'undefined' ? window.location.hostname : 'unknown');
  }

  private isSuspiciousRequest(url: string, init?: RequestInit): boolean {
    // Check for suspicious URLs
    if (this.isSuspiciousURL(url)) return true;

    // Check for suspicious headers
    if (init?.headers) {
      const headers = new Headers(init.headers);
      for (const [name, value] of headers.entries()) {
        if (this.isSuspiciousHeader(name, value)) return true;
      }
    }

    return false;
  }

  private isSuspiciousHeader(name: string, value: string): boolean {
    const suspiciousPatterns = [
      /x-forwarded-for:\s*127\.0\.0\.1/i,
      /user-agent:.*bot/i,
      /x-real-ip:\s*localhost/i
    ];

    const header = `${name}: ${value}`;
    return suspiciousPatterns.some(pattern => pattern.test(header));
  }

  private reportSecurityViolation(violation: Omit<SecurityViolation, 'id' | 'timestamp' | 'blocked' | 'ip' | 'userAgent'>): void {
    const fullViolation: SecurityViolation = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      blocked: true,
      ip: this.getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ...violation
    };

    this.violations.push(fullViolation);

    // Log to error handler
    errorHandler.logWarn(`Security violation: ${violation.description}`, {
      component: 'SecurityHardening',
      action: 'security_violation',
      metadata: {
        violationType: violation.type,
        severity: violation.severity,
        details: violation.details
      }
    });

    // Track metrics
    performanceMonitor.recordMetric({
      name: 'security_violation',
      type: 'counter',
      value: 1,
      unit: 'count',
      tags: {
        type: violation.type,
        severity: violation.severity,
        blocked: fullViolation.blocked.toString()
      }
    });

    console.warn(`🚨 [Security] ${violation.severity.toUpperCase()} - ${violation.description}`);
  }

  private getClientIP(): string {
    // In a real implementation, this would get the actual client IP
    return 'unknown';
  }

  // **PUBLIC INTERFACE METHODS**

  public getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const recent = this.violations.filter(v => v.timestamp.getTime() > last24h);

    const topAttackTypes = recent.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as { [type: string]: number });

    return {
      totalViolations: this.violations.length,
      blockedAttacks: this.violations.filter(v => v.blocked).length,
      suspiciousRequests: this.violations.filter(v => v.type === 'suspicious').length,
      rateLimitHits: this.violations.filter(v => v.type === 'ratelimit').length,
      xssAttempts: this.violations.filter(v => v.type === 'xss').length,
      csrfAttempts: this.violations.filter(v => v.type === 'csrf').length,
      injectionAttempts: this.violations.filter(v => v.type === 'injection').length,
      bruteForceAttempts: this.violations.filter(v => v.type === 'bruteforce').length,
      last24Hours: {
        violations: recent.length,
        blocked: recent.filter(v => v.blocked).length,
        topAttackTypes
      }
    };
  }

  public getViolations(filters?: {
    type?: string;
    severity?: string;
    blocked?: boolean;
    limit?: number;
  }): SecurityViolation[] {
    let violations = [...this.violations];

    if (filters) {
      if (filters.type) {
        violations = violations.filter(v => v.type === filters.type);
      }
      if (filters.severity) {
        violations = violations.filter(v => v.severity === filters.severity);
      }
      if (filters.blocked !== undefined) {
        violations = violations.filter(v => v.blocked === filters.blocked);
      }
      if (filters.limit) {
        violations = violations.slice(0, filters.limit);
      }
    }

    return violations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public clearViolations(): void {
    this.violations = [];
    console.log('🧹 [Security] Violation log cleared');
  }

  public updateSecurityConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('🔄 [Security] Security configuration updated');
  }

  public getSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  public exportSecurityReport(): string {
    const report = {
      metrics: this.getSecurityMetrics(),
      violations: this.violations,
      config: this.config,
      generatedAt: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

// Singleton instance
export const securityHardening = new SecurityHardeningSystem();

// React hook for security hardening
export function useSecurityHardening() {
  return {
    getSecurityMetrics: securityHardening.getSecurityMetrics.bind(securityHardening),
    getViolations: securityHardening.getViolations.bind(securityHardening),
    clearViolations: securityHardening.clearViolations.bind(securityHardening),
    updateSecurityConfig: securityHardening.updateSecurityConfig.bind(securityHardening),
    getSecurityConfig: securityHardening.getSecurityConfig.bind(securityHardening),
    exportSecurityReport: securityHardening.exportSecurityReport.bind(securityHardening)
  };
}