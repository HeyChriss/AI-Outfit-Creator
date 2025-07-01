import React from 'react';
import { Camera, Palette, TrendingUp, Users, Heart, Target } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onAboutUsClick?: () => void; 
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignUpClick, onAboutUsClick }) => {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center' as const,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      minHeight: '60vh'
    }}>
      {/* Hero Section */}
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #667eea 50%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Your personal closet at hand...
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#64748b',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem'
      }}>
        Organize, style and discover your wardrobe. The closet is now a personal space that can serve you, while adding more value to your style.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap' as const
      }}>
        <button 
          onClick={onSignUpClick}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          Get Started Today
        </button>
        
        <button 
          onClick={onLoginClick}
          style={{
            padding: '1rem 2rem',
            background: 'transparent',
            border: '2px solid #667eea',
            borderRadius: '12px',
            color: '#667eea',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#667eea';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#667eea';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Sign In
        </button>
        
        {/* Add About Us Button */}
        {onAboutUsClick && (
          <button 
            onClick={onAboutUsClick}
            style={{
              padding: '1rem 2rem',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              color: '#64748b',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.color = '#667eea';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            Learn More
          </button>
        )}
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto 3rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          textAlign: 'center' as const,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}>
            <Camera size={24} color="white" />
          </div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Closet Database</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>Upload and catalog your entire wardrobe with smart photo organization and easy categorization.</p>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          textAlign: 'center' as const,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}>
            <Palette size={24} color="white" />
          </div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Style Matching</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>AI-powered outfit suggestions based on your preferences, weather, and occasions.</p>
        </div>

        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          textAlign: 'center' as const,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>Trend Analytics</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>Track your style evolution and discover new trends that match your personal aesthetic.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '3rem 2rem',
        margin: '3rem auto 0',
        maxWidth: '800px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#1e293b',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Why DrippedUp?
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}>
          We understand the daily struggle of standing in front of your closet, feeling like you have nothing to wear. 
          Our mission is to help you rediscover your wardrobe and feel confident in your style choices every single day.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}>
              <Heart size={20} color="white" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
              Passionate About Style
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              Helping you rediscover amazing pieces hiding in your closet
            </p>
          </div>

          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            }}>
              <Users size={20} color="white" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
              Time Management
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              Save time planning outfits while looking your best every day
            </p>
          </div>

          <div style={{ textAlign: 'center' as const }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            }}>
              <Target size={20} color="white" />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
              Confidence Building
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              Feel more confident by maximizing your existing wardrobe
            </p>
          </div>
        </div>

        {/* Learn More CTA */}
        {onAboutUsClick && (
          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={onAboutUsClick}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Learn More About Our Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;