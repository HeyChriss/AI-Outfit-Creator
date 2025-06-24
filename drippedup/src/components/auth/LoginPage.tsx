// src/components/LoginPage.tsx - RESPONSIVE VERSION
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isSmallHeight = screenSize.height < 700;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Invalid email or password' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ email: 'Please verify your email address' });
        } else {
          setErrors({ email: error.message });
        }
      } else {
        console.log('User logged in:', data.user);
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) console.error('Google sign in error:', error);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) console.error('Facebook sign in error:', error);
    } catch (error) {
      console.error('Facebook sign in error:', error);
    }
  };

  const getResponsiveStyles = () => ({
    container: {
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #5b73e8 50%, #8e44ad 75%, #9b59b6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '1rem 0.5rem' : isTablet ? '1.5rem' : '2rem',
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto' as const,
      zIndex: 9999,
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    },
    backgroundOrb: {
      position: 'absolute' as const,
      borderRadius: '50%',
      filter: 'blur(60px)',
      opacity: isMobile ? 0.15 : 0.2,
      animation: 'float 8s ease-in-out infinite',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: isMobile ? '20px' : '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: isMobile ? '1.5rem' : isTablet ? '2rem' : '2.5rem',
      width: '100%',
      maxWidth: isMobile ? '350px' : isTablet ? '420px' : '450px',
      transform: 'scale(1)',
      transition: 'transform 0.3s ease',
      maxHeight: isSmallHeight ? '90vh' : 'none',
      overflowY: (isSmallHeight ? 'auto' : 'visible') as 'auto' | 'visible',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: isMobile ? '1.5rem' : '2rem',
    },
    headerIcon: {
      width: isMobile ? '56px' : '64px',
      height: isMobile ? '56px' : '64px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
    },
    title: {
      fontSize: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 0.5rem',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: isMobile ? '0.9rem' : '1rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: isMobile ? '1.25rem' : '1.5rem',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    label: {
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    inputContainer: {
      position: 'relative' as const,
    },
    inputIcon: {
      position: 'absolute' as const,
      left: isMobile ? '10px' : '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.6)',
      pointerEvents: 'none' as const,
    },
    input: {
      width: '100%',
      padding: isMobile ? '10px 10px 10px 36px' : '12px 12px 12px 40px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: isMobile ? '10px' : '12px',
      color: 'white',
      fontSize: isMobile ? '14px' : '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
    inputError: {
      borderColor: '#ef4444',
    },
    inputFocus: {
      borderColor: '#8B5CF6',
      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
    },
    eyeButton: {
      position: 'absolute' as const,
      right: isMobile ? '10px' : '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
      padding: '4px',
      transition: 'color 0.2s ease',
    },
    error: {
      color: '#fca5a5',
      fontSize: isMobile ? '0.8rem' : '0.875rem',
      margin: 0,
    },
    rememberForgot: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' as 'flex-start' : 'center' as 'center',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
      gap: isMobile ? '0.75rem' : '0',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#8B5CF6',
    },
    checkboxLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
    },
    forgotPassword: {
      color: '#a78bfa',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      color: 'white',
      fontWeight: '600',
      padding: isMobile ? '10px' : '12px',
      borderRadius: isMobile ? '10px' : '12px',
      border: 'none',
      fontSize: isMobile ? '0.95rem' : '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
    },
    loadingSpinner: {
      width: isMobile ? '18px' : '20px',
      height: isMobile ? '18px' : '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: isMobile ? '1.5rem 0 1rem' : '2rem 0 1.5rem',
      gap: '1rem',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255, 255, 255, 0.2)',
    },
    dividerText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '0.5rem' : '0.75rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '10px' : '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: isMobile ? '10px' : '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      gap: '0.5rem',
    },
    switchText: {
      textAlign: 'center' as const,
      marginTop: isMobile ? '1.5rem' : '2rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: isMobile ? '0.9rem' : '1rem',
    },
    switchButton: {
      color: '#a78bfa',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline',
      transition: 'color 0.2s ease',
      fontSize: isMobile ? '0.9rem' : '1rem',
    },
  });

  const styles = getResponsiveStyles();

  return (
    <div style={styles.container}>
      {/* Enhanced background orbs with better animations */}
      <div style={{
        ...styles.backgroundOrb, 
        top: isMobile ? '-80px' : '-100px', 
        right: isMobile ? '-80px' : '-100px', 
        width: isMobile ? '200px' : isTablet ? '250px' : '300px', 
        height: isMobile ? '200px' : isTablet ? '250px' : '300px', 
        background: 'radial-gradient(circle, #ff6b6b, #4ecdc4)',
        animationDelay: '0s'
      }} />
      <div style={{
        ...styles.backgroundOrb, 
        bottom: isMobile ? '-80px' : '-100px', 
        left: isMobile ? '-80px' : '-100px', 
        width: isMobile ? '200px' : isTablet ? '250px' : '300px', 
        height: isMobile ? '200px' : isTablet ? '250px' : '300px', 
        background: 'radial-gradient(circle, #a8e6cf, #ffd93d)',
        animationDelay: '2s'
      }} />
      {!isMobile && (
        <>
          <div style={{
            ...styles.backgroundOrb, 
            top: '40%', 
            left: '40%', 
            width: isTablet ? '150px' : '200px', 
            height: isTablet ? '150px' : '200px', 
            background: 'radial-gradient(circle, #ff9a9e, #fecfef)',
            animationDelay: '4s'
          }} />
          <div style={{
            ...styles.backgroundOrb, 
            top: '20%', 
            right: '20%', 
            width: '120px', 
            height: '120px', 
            background: 'radial-gradient(circle, #a18cd1, #fbc2eb)',
            animationDelay: '6s'
          }} />
        </>
      )}
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <User size={isMobile ? 28 : 32} color="white" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <div style={styles.form}>
          {/* Email Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={isMobile ? 18 : 20} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#8B5CF6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={isMobile ? 18 : 20} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={{
                  ...styles.input,
                  paddingRight: isMobile ? '36px' : '40px',
                  ...(errors.password ? styles.inputError : {})
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#8B5CF6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showPassword ? <EyeOff size={isMobile ? 18 : 20} /> : <Eye size={isMobile ? 18 : 20} />}
              </button>
            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.rememberForgot}>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="rememberMe"
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <button 
              style={styles.forgotPassword}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={styles.loadingSpinner}></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Social Login */}
        <div style={styles.socialButtons}>
          <button 
            onClick={handleGoogleSignIn}
            style={styles.socialButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button 
            onClick={handleFacebookSignIn}
            style={styles.socialButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToSignup}
            style={styles.switchButton}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
          >
            Sign up
          </button>
        </p>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.15;
          }
          33% { 
            transform: translateY(-20px) rotate(120deg);
            opacity: 0.25;
          }
          66% { 
            transform: translateY(10px) rotate(240deg);
            opacity: 0.2;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;