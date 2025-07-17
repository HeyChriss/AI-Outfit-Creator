// src/components/LoadingSpinner.tsx - Fixed for Vite/React
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#667eea',
  text 
}) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const spinnerSize = sizeMap[size];

  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `3px solid rgba(102, 126, 234, 0.1)`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  };

  const textStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500',
  };

  return (
    <>
      {/* Add the CSS animation as a global style */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
      
      <div style={containerStyle}>
        <div style={spinnerStyle} />
        {text && <p style={textStyle}>{text}</p>}
      </div>
    </>
  );
};

export default LoadingSpinner;