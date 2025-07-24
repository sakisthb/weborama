import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">⚠️ Κάτι πήγε στραβά!</h1>
          <pre className="bg-red-100 p-4 rounded text-left overflow-x-auto">{String(this.state.error)}</pre>
          <p className="mt-4 text-gray-500">Δες το browser console για περισσότερες λεπτομέρειες.</p>
        </div>
      );
    }
    return this.props.children;
  }
} 