import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Shirt, 
  TrendingUp, 
  Clock, 
  Grid3X3,
  Sparkles,
  Calendar,
  BarChart3,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { config } from '../../config';
import ItemDetailsModal from './outfits/itemDetailsModal';

interface DashboardProps {
  onUploadClick: () => void;
  onOutfitClick: () => void;
  onWardrobeClick?: () => void;
}

interface RecentUpload {
  image_path: string;
  item_info: {
    id: string;
    category: string;
    image: string;
    details: any;
    timestamp: string;
    image_url?: string; // For Supabase items
  };
}

interface OutfitItem {
  id: string;
  category: string;
  image: string;
  image_url?: string; // For Supabase items
  details: any;
  timestamp: string;
}

interface RecentOutfit {
  id: string;
  name: string;
  description: string;
  tags: string[];
  created_at: string;
  items: OutfitItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ onUploadClick, onOutfitClick, onWardrobeClick = () => {} }) => {
  const { user } = useAuth();
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Combined state - keeping both sets of features
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [outfitsCount, setOutfitsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recentOutfits, setRecentOutfits] = useState<RecentOutfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(true);
  
  // Modal state for item details
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<RecentUpload | null>(null);

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

  const fetchRecentUploads = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching recent uploads');
      setRecentUploads([]);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/recent-uploads?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecentUploads(data.recent_uploads || []);
      } else {
        throw new Error(`Failed to fetch recent uploads: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      setError('Failed to load recent uploads');
    }
  };

  const fetchOutfitsCount = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching outfits count');
      setOutfitsCount(0);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/outfits/basic?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOutfitsCount(data.count || 0);
      } else {
        throw new Error(`Failed to fetch outfits count: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching outfits count:', error);
      setError('Failed to load outfits count');
    }
  };

  const fetchRecentOutfits = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching recent outfits');
      setRecentOutfits([]);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/outfits/recent/3?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecentOutfits(data.outfits || []);
      } else {
        console.error('Failed to fetch recent outfits');
      }
    } catch (error) {
      console.error('Error fetching recent outfits:', error);
    } finally {
      setOutfitsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        setLoading(true);
        setOutfitsLoading(true);
        setError(null);
        
        try {
          await Promise.all([
            fetchRecentUploads(),
            fetchOutfitsCount(),
            fetchRecentOutfits()
          ]);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Failed to load dashboard data');
        } finally {
          setLoading(false);
          setOutfitsLoading(false);
        }
      } else {
        setLoading(false);
        setOutfitsLoading(false);
        setRecentUploads([]);
        setOutfitsCount(0);
        setRecentOutfits([]);
      }
    };

    fetchData();
  }, [user?.id]);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;

  // Helper function to format timestamp
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const uploadTime = new Date(timestamp);
    const diffInMs = now.getTime() - uploadTime.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  // Helper function to get image URL for modal (takes string path)
  const getImageUrlForModal = (imagePath: string) => {
    // Check if it's already a full URL
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise construct local API URL
    return `${config.API_BASE_URL}/images/${imagePath}`;
  };

  // Helper function to get image URL for uploads (takes RecentUpload object)
  const getImageUrl = (upload: RecentUpload) => {
    // Check if it's a Supabase item with image_url
    if (upload.item_info.image_url) {
      return upload.item_info.image_url;
    }
    // Check if image_path is a full URL
    if (upload.image_path && upload.image_path.startsWith('http')) {
      return upload.image_path;
    }
    // Fallback to local API
    return `${config.API_BASE_URL}/images/${upload.item_info.image}`;
  };

  // Combined refresh function with auth and user_id checks
  const refreshRecentUploads = async () => {
    if (!user?.id) return;

    setLoading(true);
    setOutfitsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchRecentUploads(),
        fetchOutfitsCount(),
        fetchRecentOutfits()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
      setOutfitsLoading(false);
    }
  };

  // Helper function to format outfit creation date
  const formatOutfitDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to open item details modal
  const handleItemDetailsClick = (upload: RecentUpload) => {
    setSelectedItemForDetails(upload);
    setShowItemDetailsModal(true);
  };

  // Helper function to close item details modal
  const handleCloseItemDetailsModal = () => {
    setShowItemDetailsModal(false);
    setSelectedItemForDetails(null);
  };

  const stats = {
    totalItems: recentUploads.length || 0,
    outfitsCreated: outfitsCount,
    timesWorn: 89,
    favoriteCategory: 'Tops'
  };

  // Add CSS keyframes for spinning animation
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    if (!document.head.querySelector('style[data-spin-animation]')) {
      style.setAttribute('data-spin-animation', 'true');
      document.head.appendChild(style);
    }
  }

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 100%)',
      minHeight: '100%',
      padding: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    },
    welcomeSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '24px',
      padding: isMobile ? '2rem 1.5rem' : '3rem',
      color: 'white',
      marginBottom: '2rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    welcomeOverlay: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
    },
    welcomeContent: {
      position: 'relative' as const,
      zIndex: 2,
    },
    welcomeTitle: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    welcomeSubtitle: {
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
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr',
      gap: '2rem',
      marginBottom: '2rem',
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
    viewAllButton: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    },
    itemGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
    },
    itemCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '1rem',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    itemEmoji: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
      display: 'block',
    },
    itemName: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    itemCategory: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginBottom: '0.25rem',
    },
    itemTime: {
      fontSize: '0.7rem',
      color: '#94a3b8',
    },
    outfitCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '2.25rem',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      position: 'relative' as const,
    },
    outfitItems: {
      display: 'flex',
      gap: '0.25rem',
      marginBottom: '0.75rem',
      fontSize: '1.25rem',
      justifyContent: 'center' as const,
    },
    outfitName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    outfitLikes: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.85rem',
      color: '#64748b',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    },
    statCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '1.25rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    statNumber: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.25rem',
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontWeight: '500',
    },
    navigationSection: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
      gap: '1rem',
      marginTop: '2rem',
    },
    navCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    navIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    navTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    navDescription: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: '#64748b',
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      opacity: 0.5,
    },
    errorMessage: {
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '1rem',
      color: '#dc2626',
      marginBottom: '1rem',
      fontSize: '0.875rem',
    },
  };

  // Show loading state while user is being determined
  if (loading && !user) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>⏳</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show message if no user
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👤</div>
          <p>Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div style={styles.welcomeOverlay}></div>
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}! ✨
          </h1>
          <p style={styles.welcomeSubtitle}>
            Ready to create some amazing outfits today? Your closet is waiting for you.
          </p>
          <div style={styles.quickActions}>
            <button 
              onClick={onUploadClick}
              style={{...styles.actionButton, ...styles.primaryAction}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Camera size={20} />
              Upload New Item
            </button>
            <button 
              onClick={onOutfitClick}
              style={styles.actionButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Sparkles size={20} />
              Get Outfit Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Main Content Grid */}
      <div style={styles.gridContainer}>
        {/* Recent Uploads */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <Clock size={20} />
              Recent Uploads
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={refreshRecentUploads}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                }}
                title="Refresh uploads"
              >
                <RefreshCw size={16} style={{ 
                  animation: loading ? 'spin 1s linear infinite' : 'none' 
                }} />
              </button>
              <a style={styles.viewAllButton}>View All</a>
            </div>
          </div>
          {loading ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⏳</div>
              <p>Loading your recent uploads...</p>
            </div>
          ) : recentUploads.length > 0 ? (
            <div style={styles.itemGrid}>
              {recentUploads.map((upload) => (
                <div 
                  key={upload.item_info.id}
                  style={styles.itemCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    margin: '0 auto 0.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                  }}>
                    <img 
                      src={getImageUrl(upload)}
                      alt={upload.item_info.details?.name || upload.item_info.category}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        // Replace with emoji fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<span style="font-size: 2rem;">👕</span>';
                        }
                      }}
                    />
                  </div>
                  <div style={styles.itemName}>
                    {upload.item_info.details?.name || upload.item_info.category}
                  </div>
                  <div style={styles.itemCategory}>{upload.item_info.category}</div>
                  <div style={styles.itemTime}>{formatTimeAgo(upload.item_info.timestamp)}</div>
                  <button 
                    onClick={() => handleItemDetailsClick(upload)}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Eye size={14} /> Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👕</div>
              <p>No items uploaded yet. Start building your digital closet!</p>
              <button 
                onClick={onUploadClick}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Upload Your First Item
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Recent Outfits */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <Sparkles size={20} />
                Recent Outfits
              </h2>
            </div>
            {outfitsLoading ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>⏳</div>
                <p>Loading recent outfits...</p>
              </div>
            ) : recentOutfits.length > 0 ? (
              recentOutfits.map((outfit) => (
                <div 
                  key={outfit.id}
                  style={styles.outfitCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Tags in upper left corner */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                    zIndex: 10,
                  }}>
                    {outfit.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Outfit items preview */}
                  <div style={styles.outfitItems}>
                    {outfit.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '4px',
                        }}
                      >
                        <img
                          src={item.image_url || `${config.API_BASE_URL}/images/${item.image}`}
                          alt={item.details?.name || item.category}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span style="font-size: 1rem;">👕</span>';
                            }
                          }}
                        />
                      </div>
                    ))}
                    {outfit.items.length > 3 && (
                      <span style={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        marginLeft: '4px',
                      }}>
                        +{outfit.items.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Outfit name centered below */}
                  <div style={{
                    ...styles.outfitName,
                    textAlign: 'center',
                    marginTop: '8px',
                  }}>
                    {outfit.name}
                  </div>
                  
                  {/* Date created */}
                  <div style={{
                    ...styles.outfitLikes,
                    justifyContent: 'center',
                  }}>
                    <Calendar size={14} />
                    {formatOutfitDate(outfit.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>✨</div>
                <p>No outfits created yet. Start mixing and matching!</p>
                <button 
                  onClick={onOutfitClick}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Create Your First Outfit
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{...styles.section, marginTop: '1rem'}}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <BarChart3 size={20} />
                Your Stats
              </h2>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.totalItems}</div>
                <div style={styles.statLabel}>Total Items</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.outfitsCreated}</div>
                <div style={styles.statLabel}>Outfits Created</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.timesWorn}</div>
                <div style={styles.statLabel}>Times Worn</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.favoriteCategory}</div>
                <div style={styles.statLabel}>Top Category</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={styles.navigationSection}>
        <div 
          style={styles.navCard}
          onClick={onWardrobeClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.navIcon}>
            <Grid3X3 size={24} color="white" />
          </div>
          <div style={styles.navTitle}>Wardrobe</div>
          <div style={styles.navDescription}>Browse your complete wardrobe</div>
        </div>

        <div 
          style={styles.navCard}
          onClick={onOutfitClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.navIcon}>
            <Shirt size={24} color="white" />
          </div>
          <div style={styles.navTitle}>Outfits</div>
          <div style={styles.navDescription}>Create and manage outfits</div>
        </div>

        <div 
          style={styles.navCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.navIcon}>
            <TrendingUp size={24} color="white" />
          </div>
          <div style={styles.navTitle}>Analytics</div>
          <div style={styles.navDescription}>Track your style trends</div>
        </div>

        <div 
          style={styles.navCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={styles.navIcon}>
            <Calendar size={24} color="white" />
          </div>
          <div style={styles.navTitle}>Planner</div>
          <div style={styles.navDescription}>Plan your weekly outfits</div>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItemForDetails && (
        <ItemDetailsModal
          isOpen={showItemDetailsModal}
          onClose={handleCloseItemDetailsModal}
          item={selectedItemForDetails.item_info}
          getImageUrl={getImageUrlForModal}
        />
      )}
    </div>
  );
};

export default Dashboard;