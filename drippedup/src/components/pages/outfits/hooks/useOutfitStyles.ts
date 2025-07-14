import { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
}

const useOutfitStyles = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 100%)',
      minHeight: '100%',
      padding: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    },
    headerSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '24px',
      padding: isMobile ? '2rem 1.5rem' : '3rem',
      color: 'white',
      marginBottom: '2rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    headerOverlay: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
    },
    headerContent: {
      position: 'relative' as const,
      zIndex: 2,
    },
    headerTitle: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      opacity: 0.9,
      marginBottom: '1.5rem',
    },
    quickActions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap' as const,
    },
    actionButton: {
      padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: isMobile ? '0.9rem' : '1rem',
      backdropFilter: 'blur(10px)',
    },
    primaryAction: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      fontWeight: 'bold',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
      gap: '2rem',
      marginBottom: '2rem',
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    section: {
      background: 'white',
      borderRadius: '20px',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: isMobile ? '1.25rem' : '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    categorySection: {
      marginBottom: '1rem',
    },
    categoryTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    itemGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    itemCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '12px',
      padding: '0.75rem',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      position: 'relative' as const,
    },
    selectedItem: {
      border: '2px solid #667eea',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
    },
    itemImage: {
      width: '100%',
      height: '60px',
      borderRadius: '8px',
      overflow: 'hidden' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem',
    },
    itemName: {
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#1e293b',
      lineHeight: '1.2',
    },
    mixMatchArea: {
      background: 'white',
      borderRadius: '20px',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      minHeight: '500px',
    },
    selectedItemDisplay: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      border: '2px dashed #cbd5e1',
    },
    selectedImageContainer: {
      width: '150px',
      height: '150px',
      borderRadius: '12px',
      overflow: 'hidden' as const,
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    matchOptions: {
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap' as const,
    },
    matchButton: {
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
    },
    secondaryButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    resultsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
    },
    resultCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '1rem',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem 2rem',
      color: '#64748b',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5,
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
    },
  };

  return {
    styles,
    isMobile,
    isTablet,
    screenSize,
  };
};

export default useOutfitStyles; 