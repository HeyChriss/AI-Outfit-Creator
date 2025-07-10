import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png'; 
import { useAuth } from '../../contexts/AuthContext';


interface HeaderProps {
  onLoginClick: () => void;
  onAboutUsClick?: () => void;
  onLogoClick?: () => void;
  onOutfitClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onAboutUsClick, onLogoClick, onOutfitClick }) => {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      // Add backdrop blur when scrolled
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogoutConfirmation = () => {
    const shouldLogout = window.confirm(
      `Are you sure you want to logout?\n\nYou'll need to sign in again to access your account.`
    );
    
    if (shouldLogout) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
      alert('Successfully logged out! Returning to home page...');
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Error logging out. Please try again.');
    }
  };

  const handleAuthClick = async () => {
    if (user) {
      handleLogoutConfirmation();
    } else {
      onLoginClick();
    }
  };
  


  const styles = {
    header: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      background: isScrolled 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'rgba(255, 255, 255, 0.98)',
      backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
      borderBottom: 'none',
      boxShadow: isScrolled 
        ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
        : '0 2px 10px rgba(0, 0, 0, 0.05)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '80px',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    logoImage: {
      height: '80px',
      width: 'auto',
      transition: 'transform 0.2s ease',
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem',
    },
    navLink: {
      color: '#64748b',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      padding: '0.5rem 0',
      position: 'relative' as const,
      cursor: 'pointer',
    },
    navLinkHover: {
      color: '#667eea',
    },
    authSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    userGreeting: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    onlineIndicator: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%',
      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
      animation: 'pulse 2s infinite',
    },
    userName: {
      color: '#667eea',
      fontWeight: '600',
      fontSize: '0.9rem',
    },
    authButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    loginButton: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
    },
    logoutButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    },
    mobileNav: {
      display: 'none',
      // Mobile styles would go here
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container} className="header-container">
        {/* Logo Section */}
        <div 
          style={styles.logoSection}
          className="logo-section"
          onClick={onLogoClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src={logo} 
            alt="DrippedUp Logo" 
            style={styles.logoImage}
            className="logo-image"
          />
          <div style={styles.logoText} className="logo-text">
            DrippedUp
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={styles.nav} className="nav">
          <a 
            style={styles.navLink}
            onClick={onAboutUsClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            About Us
          </a>
          <a 
            style={styles.navLink}
            onClick={onOutfitClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Outfits
          </a>
          <a 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Shop
          </a>
        </nav>

        {/* Auth Section */}
        <div style={styles.authSection} className="auth-section">
          {user && (
            <div style={styles.userGreeting} className="user-greeting">
              <div style={styles.onlineIndicator}></div>
              <span style={styles.userName}>
                Hi, {user.user_metadata?.first_name || user.email?.split('@')[0]}!
              </span>
            </div>
          )}
          
          <button 
            onClick={handleAuthClick}
            style={{
              ...styles.authButton,
              ...(user ? styles.logoutButton : styles.loginButton)
            }}
            className="auth-button"
            onMouseEnter={(e) => {
              if (user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              } else {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (user) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
              } else {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {user ? (
              <>
                🚪 Logout
              </>
            ) : (
              <>
                🔑 Login
              </>
            )}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .header-container {
            padding: 0 1rem !important;
            height: 70px !important;
          }
          
          .logo-section {
            gap: 0.5rem !important;
          }
          
          .logo-image {
            height: 60px !important;
          }
          
          .logo-text {
            font-size: 1.2rem !important;
          }
          
          .nav {
            display: none !important;
          }
          
          .auth-section {
            gap: 0.5rem !important;
          }
          
          .user-greeting {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.8rem !important;
          }
          
          .auth-button {
            padding: 0.5rem 1rem !important;
            font-size: 0.85rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-container {
            padding: 0 0.5rem !important;
            height: 60px !important;
          }
          
          .logo-image {
            height: 50px !important;
          }
          
          .logo-text {
            font-size: 1rem !important;
          }
          
          .user-greeting {
            display: none !important;
          }
          
          .auth-button {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;