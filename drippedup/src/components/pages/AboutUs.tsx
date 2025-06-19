import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Sparkles, 
  Camera,
  Lightbulb,
  Target,
  Award,
  ArrowLeft,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

interface AboutUsProps {
  onBackToDashboard?: () => void;
  onLoginClick: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBackToDashboard, onLoginClick }) => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;

  const teamMembers = [
    {
      name: 'Brandon Ansbergs',
      role: 'Co-Founder',
      bio: 'Passionate about helping people rediscover their wardrobe and feel confident in their style choices every day.',
      emoji: '👨‍💼'
    },
    {
      name: 'Chris Mijangos',
      role: 'Co-Founder',
      bio: 'Dedicated to building innovative solutions that simplify daily routines and boost personal confidence through better styling.',
      emoji: '👨‍💻'
    }
  ];

  const milestones = [
    { year: 'April 2025', event: 'Founded with a vision to revolutionize daily styling', icon: '🚀' },
    { year: 'Summer 2025', event: 'Building our core features and user experience', icon: '🛠️' },
    { year: 'Fall 2025', event: 'Preparing for our official launch', icon: '📱' },
    { year: 'Future', event: 'Helping thousands rediscover their style confidence', icon: '✨' }
  ];

  const values = [
    {
      icon: <Heart size={24} color="white" />,
      title: 'Passionate About Style',
      description: 'We believe everyone has amazing pieces in their closet - sometimes they just need help rediscovering them and feeling confident wearing them.'
    },
    {
      icon: <Users size={24} color="white" />,
      title: 'Time Management Focus',
      description: 'Helping busy people save time in their daily routine while still looking and feeling their best every day.'
    },
    {
      icon: <Lightbulb size={24} color="white" />,
      title: 'Innovation Driven',
      description: 'Building smart solutions that make outfit planning effortless and help you break out of wearing the same few pieces repeatedly.'
    },
    {
      icon: <Target size={24} color="white" />,
      title: 'Confidence Building',
      description: 'Empowering individuals to feel more confident by making the most of their existing wardrobe and discovering new styling possibilities.'
    }
  ];

  const stats = [
    { number: 'April', label: 'Project Started', icon: <Users size={20} /> },
    { number: '2', label: 'Co-Founders', icon: <Camera size={20} /> },
    { number: '100%', label: 'Passion Driven', icon: <Sparkles size={20} /> },
    { number: 'Soon', label: 'Launching', icon: <Award size={20} /> }
  ];

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      fontWeight: '500',
    },
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '24px',
      padding: isMobile ? '3rem 2rem' : '4rem 3rem',
      color: 'white',
      marginBottom: '3rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      textAlign: 'center' as const,
    },
    heroOverlay: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
    },
    heroContent: {
      position: 'relative' as const,
      zIndex: 2,
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: isMobile ? '2.5rem' : '3.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      opacity: 0.9,
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto',
    },
    section: {
      background: 'white',
      borderRadius: '24px',
      padding: isMobile ? '2rem' : '3rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    sectionTitle: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem',
      textAlign: 'center' as const,
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      textAlign: 'center' as const,
      marginBottom: '2.5rem',
      maxWidth: '600px',
      margin: '0 auto 2.5rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    statCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '2rem 1.5rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(226, 232, 240, 0.5)',
      transition: 'all 0.3s ease',
    },
    statNumber: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#64748b',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    valuesGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: '2rem',
    },
    valueCard: {
      textAlign: 'center' as const,
      transition: 'all 0.3s ease',
    },
    valueIcon: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    },
    valueTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.75rem',
    },
    valueDescription: {
      fontSize: '0.95rem',
      color: '#64748b',
      lineHeight: '1.6',
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
    },
    teamCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      padding: '2rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(226, 232, 240, 0.5)',
      transition: 'all 0.3s ease',
    },
    teamEmoji: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'block',
    },
    teamName: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    teamRole: {
      fontSize: '0.9rem',
      color: '#667eea',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    teamBio: {
      fontSize: '0.85rem',
      color: '#64748b',
      lineHeight: '1.5',
    },
    timelineContainer: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    timelineItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    timelineIcon: {
      fontSize: '2rem',
      minWidth: '60px',
      textAlign: 'center' as const,
    },
    timelineContent: {
      flex: 1,
    },
    timelineYear: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.25rem',
    },
    timelineEvent: {
      fontSize: '0.95rem',
      color: '#1e293b',
      lineHeight: '1.5',
    },
    contactSection: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      padding: '2.5rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    contactTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem',
    },
    contactText: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '2rem',
      lineHeight: '1.6',
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '1.5rem',
    },
    contactItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    contactIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactLabel: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    contactValue: {
      fontSize: '0.85rem',
      color: '#64748b',
    },
  };

  return (
    <>
      <Header onLoginClick={onLoginClick} />
      <main style={{
        marginTop: '120px',
        marginBottom: '120px',
        minHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        <div style={styles.container}>
      {/* Header */}
      {onBackToDashboard && (
        <div style={styles.header}>
          <button 
            onClick={onBackToDashboard}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Transforming Style, One Outfit at a Time ✨
          </h1>
          <p style={styles.heroSubtitle}>
            We're building an app to help you rediscover your wardrobe, plan your outfits effortlessly, and boost your confidence through better styling and time management.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Vision</h2>
        <p style={styles.sectionSubtitle}>
          Building an app that helps you make the most of your wardrobe while saving time and boosting confidence
        </p>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>
                {stat.icon}
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Values */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.sectionSubtitle}>
          To help everyone rediscover their wardrobe, save time planning outfits, and feel confident in their style choices every single day.
        </p>
        <div style={styles.valuesGrid}>
          {values.map((value, index) => (
            <div 
              key={index}
              style={styles.valueCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.valueIcon}>
                {value.icon}
              </div>
              <h3 style={styles.valueTitle}>{value.title}</h3>
              <p style={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Meet the Team</h2>
        <p style={styles.sectionSubtitle}>
          Two friends passionate about solving everyday styling challenges and helping people feel more confident
        </p>
        <div style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              style={{
                ...styles.teamCard,
                maxWidth: '400px',
                margin: '0 auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={styles.teamEmoji}>{member.emoji}</span>
              <h3 style={styles.teamName}>{member.name}</h3>
              <p style={styles.teamRole}>{member.role}</p>
              <p style={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Journey</h2>
        <p style={styles.sectionSubtitle}>
          From identifying a common problem to building the solution - we're just getting started!
        </p>
        <div style={styles.timelineContainer}>
          {milestones.map((milestone, index) => (
            <div key={index} style={styles.timelineItem}>
              <div style={styles.timelineIcon}>{milestone.icon}</div>
              <div style={styles.timelineContent}>
                <div style={styles.timelineYear}>{milestone.year}</div>
                <div style={styles.timelineEvent}>{milestone.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div style={styles.contactSection}>
        <h2 style={styles.contactTitle}>Get In Touch</h2>
        <p style={styles.contactText}>
          Interested in our journey or want to be notified when we launch? We'd love to hear from you!
        </p>
        <div style={styles.contactGrid}>
          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <Mail size={20} color="white" />
            </div>
            <div style={styles.contactLabel}>Email</div>
            <div style={styles.contactValue}>contact@stylecloset.com</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <Phone size={20} color="white" />
            </div>
            <div style={styles.contactLabel}>Phone</div>
            <div style={styles.contactValue}>+1 (555) 123-4567</div>
          </div>
          <div style={styles.contactItem}>
            <div style={styles.contactIcon}>
              <MapPin size={20} color="white" />
            </div>
            <div style={styles.contactLabel}>Location</div>
            <div style={styles.contactValue}>San Francisco, CA</div>
          </div>
        </div>
      </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;