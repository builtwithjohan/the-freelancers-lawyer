import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI exception captured by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#090d16',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: 'rgba(18, 24, 38, 0.95)',
            border: '1px solid rgba(255, 59, 92, 0.4)',
            borderRadius: '16px',
            padding: '36px',
            maxWidth: '550px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 59, 92, 0.15)',
              color: '#ff3b5c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertOctagon size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
              Unexpected Application State
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
              The application encountered an unexpected runtime error. Your contract data remains safe.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #ff3b5c 0%, #d91b42 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
