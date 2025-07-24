// Main App Component - Ads Pro Platform
// Complete SaaS Application με Professional Routing
// Δημιουργήθηκε με προσοχή για να διατηρηθεί όλη η existing functionality

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { SaaSProvider } from '@/lib/clerk-provider';
import { AuthGuard } from '@/components/auth-guard';
import { ProtectedLayout } from '@/components/protected-layout';
import { Toaster } from '@/components/ui/sonner';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NotificationsProvider } from '@/lib/notifications-context';
import { DataSourceProvider } from '@/contexts/DataSourceContext';
import { LazyLoader } from '@/components/lazy-loader';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DevUserSwitcher } from '@/components/dev-user-switcher';
import { DevModeBanner } from '@/components/dev-mode-banner';

// Pages - Using named imports
import { OptimizedLandingPage } from '@/components/optimized-landing-page';
import { Login } from '@/pages/Login';
import ClerkLogin from '@/pages/ClerkLogin';
import { SupabaseLogin } from '@/pages/SupabaseLogin';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import Campaigns from '@/pages/Campaigns';
import { CampaignAnalysis } from '@/pages/CampaignAnalysis';
import { FunnelAnalysis } from '@/pages/FunnelAnalysis';
import { AdvancedAnalytics } from '@/pages/AdvancedAnalytics';
import { AIPredictions } from '@/pages/AIPredictions';
import { AIMLPredictions } from '@/pages/AIMLPredictions';
import { ReportingHub } from '@/pages/ReportingHub';
import AnalyticsStudio from '@/pages/AnalyticsStudio';
import { MultiTouchAttribution } from '@/pages/MultiTouchAttribution';
import { WebSocketMonitor } from '@/pages/WebSocketMonitor';
import { Settings } from '@/pages/Settings';
import { Onboarding } from '@/pages/Onboarding';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { ButtonTest } from '@/pages/ButtonTest';
import Profile from '@/pages/Profile';
import Billing from '@/pages/Billing';
import Notifications from '@/pages/Notifications';
import Help from '@/pages/Help';
import Debug from '@/pages/Debug';
import AuthTest from '@/pages/AuthTest';
import LayoutTest from '@/pages/LayoutTest';
import DashboardTest from '@/pages/DashboardTest';
import DashboardIncremental from '@/pages/DashboardIncremental';

// Realtime component lazy loading με correct casing
const RealtimeDashboard = lazy(() => 
  import('@/components/realtime-dashboard').then(module => ({ 
    default: module.RealTimeDashboard 
  }))
);

// Protected Route Wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  requiredFeature?: string;
}

function ProtectedRoute({ children, requiredRole, requiredPermission, requiredFeature }: ProtectedRouteProps) {
  return (
    <AuthGuard 
      requiredRole={requiredRole as any}
      requiredPermission={requiredPermission}
      requiredFeature={requiredFeature}
      redirectTo="/login"
    >
      <ProtectedLayout>
        {children}
      </ProtectedLayout>
    </AuthGuard>
  );
}

// Enhanced Loading Component για Suspense
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-primary/10"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Loading Ads Pro Platform...</p>
          <p className="text-sm text-muted-foreground">
            {import.meta.env.DEV && "🔧 Development Mode Active"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <SaaSProvider>
      <ThemeProvider defaultTheme="system" storageKey="ads-pro-theme">
          <NotificationsProvider>
            <SettingsProvider>
              <DataSourceProvider>
              <Router>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <DevModeBanner />
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Landing page at root */}
                        <Route path="/" element={<OptimizedLandingPage />} />
                        {/* Production Login - SUPABASE AUTH */}
                        <Route path="/welcome" element={<SupabaseLogin />} />
                        {/* Mock Auth (development/testing) */}
                        <Route path="/hidden-welcome" element={<Login />} />
                        {/* Legacy Clerk login (disabled) */}
                        <Route path="/clerk-login" element={<ClerkLogin />} />
                        {/* Redirect /login to appropriate auth method */}
                        <Route path="/login" element={<Navigate to="/welcome" replace />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        
                        {/* Protected Routes με Professional Layout */}
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <ErrorBoundary>
                              <Dashboard />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/campaigns" element={
                          <ProtectedRoute requiredPermission="campaigns:read">
                            <Campaigns />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/analytics" element={
                          <ProtectedRoute requiredPermission="analytics:read">
                            <Analytics />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/campaign-analysis" element={
                          <ProtectedRoute requiredPermission="analytics:read">
                            <CampaignAnalysis />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/realtime" element={
                          <ProtectedRoute requiredPermission="realtime:read">
                            <Suspense fallback={<LazyLoader>Loading realtime dashboard...</LazyLoader>}>
                              <RealtimeDashboard />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/funnel-analysis" element={
                          <ProtectedRoute requiredPermission="analytics:advanced">
                            <FunnelAnalysis />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/advanced-analytics" element={
                          <ProtectedRoute requiredPermission="analytics:advanced">
                            <AdvancedAnalytics />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/ai-predictions" element={
                          <ProtectedRoute requiredFeature="ai_predictions">
                            <AIPredictions />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/ai-ml-predictions" element={
                          <ProtectedRoute requiredFeature="ml_engine">
                            <AIMLPredictions />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/reporting-hub" element={
                          <ProtectedRoute requiredPermission="reports:create">
                            <ReportingHub />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/analytics-studio" element={
                          <ProtectedRoute requiredPermission="analytics:advanced">
                            <AnalyticsStudio />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/multi-touch-attribution" element={
                          <ProtectedRoute requiredFeature="attribution_modeling">
                            <MultiTouchAttribution />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/websocket-monitor" element={
                          <ProtectedRoute requiredRole="admin">
                            <WebSocketMonitor />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/admin" element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/billing" element={
                          <ProtectedRoute>
                            <Billing />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <Notifications />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/help" element={
                          <ProtectedRoute>
                            <Help />
                          </ProtectedRoute>
                        } />
                        
                        {/* Emergency Button Test Page */}
                        <Route path="/button-test" element={<ButtonTest />} />
                        
                        {/* Debug Page */}
                        <Route path="/debug" element={<Debug />} />
                        
                        {/* Auth Test Page */}
                        <Route path="/auth-test" element={<AuthTest />} />
                        
                        {/* Layout Test Page */}
                        <Route path="/layout-test" element={<LayoutTest />} />
                        
                        {/* Dashboard Test Page */}
                        <Route path="/dashboard-test" element={<DashboardTest />} />
                        
                        {/* Dashboard Incremental Test Page */}
                        <Route path="/dashboard-incremental" element={<DashboardIncremental />} />

                        {/* Fallback Routes */}
                        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/landing" element={<Navigate to="/" replace />} />
                        
                        {/* 404 Handler */}
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h1 className="text-6xl font-bold text-gray-400">404</h1>
                              <p className="text-xl text-gray-600 mt-4">Page not found</p>
                              <p className="text-gray-500 mt-2">
                                The page you're looking for doesn't exist.
                              </p>
                              <button
                                onClick={() => window.location.href = '/'}
                                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                Go to Dashboard
                              </button>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                    
                    {/* Global UI Components */}
                    <Toaster />
                    
                    {/* Development Tools */}
                    <DevUserSwitcher />
                  </div>
                </Router>
              </DataSourceProvider>
              </SettingsProvider>
            </NotificationsProvider>
          </ThemeProvider>
    </SaaSProvider>
  );
}