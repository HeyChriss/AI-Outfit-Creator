// src/components/LoginPage.tsx - SIMPLIFIED VERSION
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

  // Add auth-page class to body
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

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

  const styles = {
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '450px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    headerIcon: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 0.5rem',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '1rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    inputContainer: {
      position: 'relative' as const,
    },
    inputIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.6)',
      pointerEvents: 'none' as const,
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
    inputError: {
      borderColor: '#ef4444',
    },
    eyeButton: {
      position: 'absolute' as const,
      right: '12px',
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
      fontSize: '0.875rem',
      margin: 0,
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
      fontSize: '0.9rem',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      color: 'white',
      fontWeight: '600',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
    switchText: {
      textAlign: 'center' as const,
      marginTop: '2rem',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    switchButton: {
      color: '#a78bfa',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '1rem',
      transition: 'color 0.2s ease',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <User size={32} color="white" />
        </div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
      </div>

      <div style={styles.form}>
        {/* Email Field */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inputContainer}>
            <Mail size={20} style={styles.inputIcon} />
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
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              style={{
                ...styles.input,
                paddingRight: '40px',
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        {/* Remember Me */}
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

      {/* Switch to Sign Up */}
      <p style={styles.switchText}>
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          style={styles.switchButton}
          onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
        >
          Sign up here
        </button>
      </p>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;