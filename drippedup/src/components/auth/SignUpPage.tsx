// src/components/SignUpPage.tsx - SIMPLIFIED VERSION
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

  const styles = {
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: '2.5rem',
      width: '100%',
      maxWidth: '520px',
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
    successMessage: {
      background: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.5)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1.5rem',
      textAlign: 'center' as const,
    },
    successText: {
      color: '#6ee7b7',
      fontSize: '0.9rem',
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
    },
    nameRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
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
    inputNoIcon: {
      width: '100%',
      padding: '12px',
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
      fontSize: '0.75rem',
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
      fontSize: '0.9rem',
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
          <UserPlus size={32} color="white" />
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
              <User size={20} style={styles.inputIcon} />
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
            <Mail size={20} style={styles.inputIcon} />
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
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              style={{
                ...styles.input,
                paddingRight: '40px',
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              style={{
                ...styles.input,
                paddingRight: '40px',
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
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            <button style={styles.linkButton}>Terms of Service</button>
            {' '}and{' '}
            <button style={styles.linkButton}>Privacy Policy</button>
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
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </div>

      {/* Switch to Login */}
      <p style={styles.switchText}>
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          style={styles.switchButton}
          onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
        >
          Sign in here
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

export default SignUpPage;