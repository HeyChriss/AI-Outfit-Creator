import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
<<<<<<< HEAD
  RefreshCw,
  Trash2,
  Tag,
} from 'lucide-react';
import { config } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth
=======
  Eye,
  Wand2,
  RefreshCw,
  Trash2,
  Tag,
  Heart,
} from 'lucide-react';
import { config } from '../../../config';
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4

interface OutfitItem {
  id: string;
  category: string;
  image: string;
<<<<<<< HEAD
  image_url?: string;
=======
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4
  details: any;
  timestamp: string;
}

interface OutfitData {
  id: string;
  name: string;
  description: string;
  tags: string[];
  created_at: string;
  items: OutfitItem[];
}

interface OutfitsProps {
  onOutfitSelect?: (outfit: OutfitData) => void;
  onItemSelect?: (item: OutfitItem) => void;
  getImageUrl?: (imagePath: string) => string;
  showHeader?: boolean;
  maxHeight?: string;
}

const Outfits: React.FC<OutfitsProps> = ({
  onOutfitSelect,
  onItemSelect,
  getImageUrl = (imagePath: string) => `${config.API_BASE_URL}/images/${imagePath}`,
  showHeader = true,
  maxHeight = 'none',
}) => {
  const [outfits, setOutfits] = useState<OutfitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitData | null>(null);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
<<<<<<< HEAD
  const { user } = useAuth(); // Get user from auth context

  // Fetch all outfits for the logged-in user
  const fetchOutfits = async () => {
    // Don't fetch if there's no user
    if (!user?.id) {
      setOutfits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Add user_id as a query parameter to the fetch request
      const response = await fetch(`${config.API_BASE_URL}/outfits?user_id=${user.id}`);
=======

  // Fetch all outfits
  const fetchOutfits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.API_BASE_URL}/outfits`);
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4
      if (response.ok) {
        const data = await response.json();
        setOutfits(data.outfits || []);
      } else {
        setError('Failed to fetch outfits');
      }
    } catch (err) {
      setError('Error fetching outfits');
      console.error('Error fetching outfits:', err);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Re-fetch outfits when the user changes (e.g., on login)
  useEffect(() => {
    fetchOutfits();
  }, [user?.id]);
=======
  useEffect(() => {
    fetchOutfits();
  }, []);

  // Format outfit creation date
  const formatOutfitDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle outfit card click
  const handleOutfitClick = (outfit: OutfitData) => {
    setSelectedOutfit(outfit);
    setShowOutfitModal(true);
    if (onOutfitSelect) {
      onOutfitSelect(outfit);
    }
  };
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4

  // Handle outfit deletion
  const handleDeleteOutfit = async (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/outfit/${outfitId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setOutfits(outfits.filter(outfit => outfit.id !== outfitId));
        } else {
          setError('Failed to delete outfit');
        }
      } catch (err) {
        setError('Error deleting outfit');
        console.error('Error deleting outfit:', err);
      }
    }
  };

<<<<<<< HEAD
  // ... rest of the component remains the same
  // (formatOutfitDate, handleOutfitClick, renderOutfitItemPreview, styles, JSX)

  // Format outfit creation date
  const formatOutfitDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle outfit card click
  const handleOutfitClick = (outfit: OutfitData) => {
    setSelectedOutfit(outfit);
    setShowOutfitModal(true);
    if (onOutfitSelect) {
      onOutfitSelect(outfit);
    }
  };

  // Render outfit item preview
  const renderOutfitItemPreview = (item: OutfitItem, size: string = '40px') => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '6px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    marginRight: '4px',
  }}>
    <img
      // Replace the src attribute with this logic
      src={item.image_url || getImageUrl(item.image)}
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
          parent.innerHTML = '<span style="font-size: 1.2rem;">👕</span>';
        }
      }}
    />
  </div>
);
=======
  // Render outfit item preview
  const renderOutfitItemPreview = (item: OutfitItem, size: string = '40px') => (
    <div style={{
      width: size,
      height: size,
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
      marginRight: '4px',
    }}>
      <img
        src={getImageUrl(item.image)}
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
            parent.innerHTML = '<span style="font-size: 1.2rem;">👕</span>';
          }
        }}
      />
    </div>
  );
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
      maxHeight,
      overflow: maxHeight !== 'none' ? 'auto' : 'visible',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    refreshButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    outfitCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative' as const,
    },
    outfitTags: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const,
      marginBottom: '1rem',
    },
    tag: {
      backgroundColor: '#667eea',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      textTransform: 'uppercase' as const,
    },
    outfitName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.75rem',
      textAlign: 'center' as const,
    },
    outfitItems: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginBottom: '1rem',
      justifyContent: 'center',
    },
    outfitDate: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#64748b',
      marginBottom: '1rem',
    },
    outfitActions: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    dangerButton: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    deleteButton: {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#ef4444',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem',
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
      padding: '3rem',
      color: '#64748b',
    },
    errorMessage: {
      background: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#dc2626',
    },
  };

  return (
    <div style={styles.container}>
      {showHeader && (
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Sparkles size={24} />
            All Outfits ({outfits.length})
          </h2>
          <button
            onClick={fetchOutfits}
            style={styles.refreshButton}
            disabled={loading}
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loadingSpinner}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '1rem' }}>Loading outfits...</span>
        </div>
      ) : outfits.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>✨</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Outfits Yet</h3>
          <p>Start creating amazing outfit combinations!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              style={styles.outfitCard}
              onClick={() => handleOutfitClick(outfit)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                const deleteBtn = e.currentTarget.querySelector('[data-delete-btn]') as HTMLElement;
                if (deleteBtn) deleteBtn.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                const deleteBtn = e.currentTarget.querySelector('[data-delete-btn]') as HTMLElement;
                if (deleteBtn) deleteBtn.style.opacity = '0';
              }}
            >
              {/* Delete button */}
              <button
                data-delete-btn
                style={styles.deleteButton}
                onClick={(e) => handleDeleteOutfit(outfit.id, e)}
                title="Delete outfit"
              >
                <Trash2 size={12} />
              </button>

              {/* Tags */}
              <div style={styles.outfitTags}>
                {outfit.tags.map((tag, index) => (
                  <span key={index} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Outfit Name */}
              <div style={styles.outfitName}>
                {outfit.name}
              </div>

              {/* Outfit Items Preview */}
              <div style={styles.outfitItems}>
                {outfit.items.slice(0, 6).map((item, index) => (
                  <div key={index}>
                    {renderOutfitItemPreview(item, '50px')}
                  </div>
                ))}
                {outfit.items.length > 6 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '6px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}>
                    +{outfit.items.length - 6}
                  </div>
                )}
              </div>

              {/* Date */}
              <div style={styles.outfitDate}>
                <Calendar size={16} />
                {formatOutfitDate(outfit.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outfit Detail Modal */}
      {showOutfitModal && selectedOutfit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
              }}>
                {selectedOutfit.name}
              </h3>
              <button
                onClick={() => setShowOutfitModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={styles.outfitTags}>
                {selectedOutfit.tags.map((tag, index) => (
                  <span key={index} style={styles.tag}>
                    <Tag size={12} style={{ marginRight: '0.25rem' }} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {selectedOutfit.description && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#64748b',
              }}>
                {selectedOutfit.description}
              </div>
            )}

            {/* Items */}
            <div style={{
              marginBottom: '1.5rem',
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem',
              }}>
                Items in this outfit:
              </h4>
              <div style={styles.grid}>
                {selectedOutfit.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      cursor: onItemSelect ? 'pointer' : 'default',
                    }}
                    onClick={() => onItemSelect && onItemSelect(item)}
                  >
                    {renderOutfitItemPreview(item, '60px')}
                    <div style={{ marginLeft: '1rem' }}>
                      <div style={{
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '0.25rem',
                      }}>
                        {item.details?.name || item.category}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                      }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div style={styles.outfitDate}>
              <Calendar size={16} />
              Created {formatOutfitDate(selectedOutfit.created_at)}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
<<<<<<< HEAD
export default Outfits;
=======

export default Outfits; 
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4
