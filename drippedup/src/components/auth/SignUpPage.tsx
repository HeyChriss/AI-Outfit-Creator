// src/components/SignUpPage.tsx - COMPLETE RESPONSIVE VERSION
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
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
  const isSmallHeight = screenSize.height < 800;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignUpFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'This email is already registered' });
        } else {
          setErrors({ email: error.message });
        }
      } else {
        if (data.user && !data.session) {
          setSuccessMessage('Please check your email and click the confirmation link to activate your account.');
        } else {
          setSuccessMessage('Account created successfully!');
          setTimeout(() => onSignUpSuccess(), 2000);
        }
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ email: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];
    
    return {
      strength: Math.min(strength, 4),
      label: labels[Math.min(strength, 4)],
      color: colors[Math.min(strength, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
      maxWidth: isMobile ? '350px' : isTablet ? '480px' : '520px',
      transform: 'scale(1)',
      transition: 'transform 0.3s ease',
      maxHeight: isSmallHeight ? '95vh' : 'none',
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
    successMessage: {
      background: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.5)',
      borderRadius: isMobile ? '10px' : '12px',
      padding: '1rem',
      marginBottom: '1.5rem',
      textAlign: 'center' as const,
    },
    successText: {
      color: '#6ee7b7',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: isMobile ? '1.25rem' : '1.5rem',
    },
    nameRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: isMobile ? '0.75rem' : '1rem',
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
    inputNoIcon: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
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
    passwordStrength: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    strengthHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    strengthLabel: {
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    strengthBar: {
      width: '100%',
      height: '6px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '3px',
      overflow: 'hidden' as const,
    },
    strengthFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'all 0.3s ease',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start' as const,
      gap: '0.75rem',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      marginTop: '2px',
      accentColor: '#8B5CF6',
    },
    checkboxLabel: {
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.5',
    },
    linkButton: {
      color: '#a78bfa',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'color 0.2s ease',
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
            left: '10%', 
            width: isTablet ? '150px' : '200px', 
            height: isTablet ? '150px' : '200px', 
            background: 'radial-gradient(circle, #ff9a9e, #fecfef)',
            animationDelay: '4s'
          }} />
          <div style={{
            ...styles.backgroundOrb, 
            top: '20%', 
            right: '15%', 
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
            <UserPlus size={isMobile ? 28 : 32} color="white" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join us and start your journey</p>
        </div>

        {successMessage && (
          <div style={styles.successMessage}>
            <p style={styles.successText}>{successMessage}</p>
          </div>
        )}

        <div style={styles.form}>
          {/* Name Fields */}
          <div style={styles.nameRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>First Name</label>
              <div style={styles.inputContainer}>
                <User size={isMobile ? 18 : 20} style={styles.inputIcon} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  style={{
                    ...styles.input,
                    ...(errors.firstName ? styles.inputError : {})
                  }}
                />
              </div>
              {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                style={{
                  ...styles.inputNoIcon,
                  ...(errors.lastName ? styles.inputError : {})
                }}
              />
              {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}
            </div>
          </div>

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
                placeholder="john@example.com"
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
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
                placeholder="Create a strong password"
                style={{
                  ...styles.input,
                  paddingRight: isMobile ? '36px' : '40px',
                  ...(errors.password ? styles.inputError : {})
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
            
            {formData.password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthHeader}>
                  <span style={styles.strengthLabel}>Password Strength:</span>
                  <span style={styles.strengthLabel}>{passwordStrength.label}</span>
                </div>
                <div style={styles.strengthBar}>
                  <div
                    style={{
                      ...styles.strengthFill,
                      width: `${(passwordStrength.strength + 1) * 20}%`,
                      background: passwordStrength.color
                    }}
                  />
                </div>
              </div>
            )}
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputContainer}>
              <Lock size={isMobile ? 18 : 20} style={styles.inputIcon} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                style={{
                  ...styles.input,
                  paddingRight: isMobile ? '36px' : '40px',
                  ...(errors.confirmPassword ? styles.inputError : {})
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {showConfirmPassword ? <EyeOff size={isMobile ? 18 : 20} /> : <Eye size={isMobile ? 18 : 20} />}
              </button>
            </div>
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={styles.checkbox}
            />
            <label htmlFor="acceptTerms" style={styles.checkboxLabel}>
              I agree to the{' '}
              <button 
                style={styles.linkButton}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button 
                style={styles.linkButton}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={styles.loadingSpinner}></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Social Sign Up */}
        <div style={styles.socialButtons}>
          <button 
            style={styles.socialButton}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
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
            style={styles.socialButton}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Sign In Link */}
        <p style={styles.switchText}>
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin}
            style={styles.switchButton}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
          >
            Sign in
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

export default SignUpPage;