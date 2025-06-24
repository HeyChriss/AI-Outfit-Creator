import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Sparkles, Heart, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onAboutUsClick?: () => void;  // Add this prop
}

const Footer: React.FC<FooterProps> = ({ onAboutUsClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show footer when very close to bottom of page (99% instead of 80%)
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      const nearBottom = scrollPercentage > 0.99;
      
      setIsVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles = {
    footer: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: 'none',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem 2rem 1rem',
      color: 'white',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1rem',
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.75rem',
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
    description: {
      color: '#94a3b8',
      lineHeight: '1.5',
      fontSize: '0.85rem',
      marginBottom: '1rem',
    },
    socialLinks: {
      display: 'flex',
      gap: '0.75rem',
    },
    socialLink: {
      width: '36px',
      height: '36px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    section: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      color: 'white',
    },
    link: {
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      padding: '0.25rem 0',
    },
    contactInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#94a3b8',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
      margin: '1rem 0',
    },
    bottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '1rem',
      paddingTop: '0.75rem',
    },
    copyright: {
      color: '#64748b',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    madeWith: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      fontSize: '0.85rem',
    },
    newsletter: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    newsletterInput: {
      display: 'flex',
      gap: '0.5rem',
    },
    emailInput: {
      flex: 1,
      padding: '0.75rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    subscribeButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Sparkles size={18} color="white" />
              </div>
              DrippedUp
            </div>
            <p style={styles.description}>
              Transform your wardrobe with AI-powered style recommendations. 
              Organize, discover, and express your unique fashion sense.
            </p>
            <div style={styles.socialLinks}>
              <a 
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1877f2 0%, #1877f2 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaFacebookF size={16} />
              </a>
              <a 
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1da1f2 0%, #1da1f2 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaTwitter size={16} />
              </a>
              <a 
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0077b5 0%, #0077b5 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaLinkedinIn size={16} />
              </a>
              <a 
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e4405f 0%, #e4405f 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="#" 
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff0000 0%, #ff0000 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Quick Links</h3>
            <a 
              onClick={onAboutUsClick}
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              About Us
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Features
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Pricing
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Blog
            </a>
          </div>

          {/* Support */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Support</h3>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Help Center
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Contact Us
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              Terms of Service
            </a>
          </div>

          {/* Contact Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Contact</h3>
            <div style={styles.contactInfo}>
              <Mail size={16} />
              <span>hello@drippedup.com</span>
            </div>
            <div style={styles.contactInfo}>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={styles.contactInfo}>
              <MapPin size={16} />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* Bottom Section */}
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            © 2025 DrippedUp. All rights reserved.
          </div>
          <div style={styles.madeWith}>
            Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> by DrippedUp Team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;