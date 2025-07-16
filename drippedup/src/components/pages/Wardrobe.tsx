import React, { useState } from 'react';
import {
  Grid3X3,
  Eye,
  Wand2,
  ArrowLeft,
  RefreshCw,
  Camera,
  Trash2,
} from 'lucide-react';
import Header from '../layout/Header';
import { useOutfitData } from './outfits/hooks';
import ItemDetailsModal from './outfits/itemDetailsModal';
import Outfits from './outfits/Outfits';
import { config } from '../../config';

interface WardrobeProps {
  onUploadClick: () => void;
  onOutfitClick: () => void;
  onLoginClick?: () => void;
  onAboutUsClick?: () => void;
  onLogoClick?: () => void;
  onWardrobeClick?: () => void;
  onBackToDashboard?: () => void;
}

const Wardrobe: React.FC<WardrobeProps> = ({
  onUploadClick,
  onOutfitClick,
  onLoginClick = () => {},
  onAboutUsClick = () => {},
  onLogoClick = () => {},
  onWardrobeClick = () => {},
  onBackToDashboard = () => {},
}) => {
  const {
    groupedItems,
    loading,
    error,
    refreshData,
    getImageUrl,
  } = useOutfitData();

  // Modal states
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<any>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Item handlers
  const handleItemCardClick = (item: any) => {
    setSelectedItemForDetails(item);
    setShowItemDetails(true);
  };

  const handleShowItemDetails = () => {
    setShowItemDetails(false);
    setShowItemDetailsModal(true);
  };

  const handleCloseItemDetailsModal = () => {
    setShowItemDetailsModal(false);
    setSelectedItemForDetails(null);
  };

  const handleMixAndMatchFromCatalog = () => {
    // Navigate to outfit page with selected item
    onOutfitClick();
  };

  const handleCloseItemOptions = () => {
    setShowItemDetails(false);
    setSelectedItemForDetails(null);
  };

  // Handle item deletion
  const handleDeleteItem = async (itemId: string, itemName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/item/${itemId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`"${itemName}" deleted successfully!`);
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
          // Refresh the data to reflect the deletion
          refreshData();
        } else {
          const errorData = await response.json().catch(() => ({}));
          setDeleteError(errorData.detail || 'Failed to delete item');
        }
      } catch (err) {
        setDeleteError('Error deleting item. Please try again.');
        console.error('Error deleting item:', err);
      }
    }
  };

  const renderItemImage = (item: any, size: string = '120px') => (
    <div style={{
      width: size,
      height: size,
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
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
            parent.innerHTML = '<span style="font-size: 2rem;">👕</span>';
          }
        }}
      />
    </div>
  );

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 100%)',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '120px',
    },
    headerSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '24px',
      padding: '3rem',
      color: 'white',
      marginBottom: '2rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      margin: '0 2rem 2rem 2rem',
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
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      marginBottom: '1.5rem',
    },
    quickActions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap' as const,
    },
    actionButton: {
      padding: '1rem 2rem',
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
      fontSize: '1rem',
      backdropFilter: 'blur(10px)',
    },
    primaryAction: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      fontWeight: 'bold',
    },
    mainContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
      margin: '0 2rem',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    sectionTitle: {
      margin: 0,
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1.5rem',
    },
    itemCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      padding: '1rem',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative' as const,
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
      zIndex: 10,
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '4rem 2rem',
      color: '#64748b',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem',
      color: '#667eea',
    },
  };

  return (
    <>
      <Header
        onLoginClick={onLoginClick}
        onAboutUsClick={onAboutUsClick}
        onLogoClick={onLogoClick}
        onOutfitClick={onOutfitClick}
        onWardrobeClick={onWardrobeClick}
      />
      
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerOverlay}></div>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>
              Your Complete Wardrobe 👗
            </h1>
            <p style={styles.headerSubtitle}>
              Browse through all your clothing items and manage your digital closet
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
                <Wand2 size={20} />
                Create Outfits
              </button>
              <button
                onClick={refreshData}
                disabled={loading}
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
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            margin: '0 2rem 2rem 2rem',
            color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* Delete Error Display */}
        {deleteError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            margin: '0 2rem 2rem 2rem',
            color: '#dc2626',
          }}>
            {deleteError}
          </div>
        )}

        {/* Success Message Display */}
        {successMessage && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '1rem',
            margin: '0 2rem 2rem 2rem',
            color: '#065f46',
          }}>
            {successMessage}
          </div>
        )}

        {/* Main Wardrobe Content */}
        <div style={styles.mainContent}>
          {/* Header */}
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <Grid3X3 size={28} />
              Complete Wardrobe Catalog
            </h2>
            <button
              onClick={onBackToDashboard}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#64748b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={styles.loadingSpinner}>
              <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ marginLeft: '1rem' }}>Loading your wardrobe...</span>
            </div>
          )}

          {/* Items Grid */}
          {!loading && (
            <div style={styles.itemsGrid}>
              {Object.entries(groupedItems).map(([category, items]) =>
                items.map((item) => (
                  <div
                    key={item.id}
                    style={styles.itemCard}
                    onClick={() => handleItemCardClick(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#667eea';
                      const deleteBtn = e.currentTarget.querySelector('[data-delete-btn]') as HTMLElement;
                      if (deleteBtn) deleteBtn.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      const deleteBtn = e.currentTarget.querySelector('[data-delete-btn]') as HTMLElement;
                      if (deleteBtn) deleteBtn.style.opacity = '0';
                    }}
                  >
                    {/* Delete button */}
                    <button
                      data-delete-btn
                      style={styles.deleteButton}
                      onClick={(e) => handleDeleteItem(item.id, item.details?.name || `${category} Item`, e)}
                      title="Delete item"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div style={{
                      width: '120px',
                      height: '120px',
                      margin: '0 auto 1rem',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {renderItemImage(item, '120px')}
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: '0 0 0.5rem 0',
                    }}>
                      {item.details?.name || `${category} Item`}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      margin: '0 0 1rem 0',
                    }}>
                      {category}
                    </p>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      fontStyle: 'italic',
                    }}>
                      Click for options
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && Object.keys(groupedItems).length === 0 && (
            <div style={styles.emptyState}>
              <Grid3X3 size={64} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                No items in your wardrobe yet
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>Upload some clothing items to get started!</p>
              <button
                onClick={onUploadClick}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto',
                }}
              >
                <Camera size={20} />
                Upload Your First Item
              </button>
            </div>
          )}
        </div>
      
        {/* All Outfits Section */}
        <div style={{ marginTop: '2rem' }}>
          <Outfits
            maxHeight="500px"
            showHeader={true}
            getImageUrl={getImageUrl}
          />
        </div>
      </div>

      {/* Item Options Modal */}
      {showItemDetails && selectedItemForDetails && (
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
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 1rem',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {renderItemImage(selectedItemForDetails, '120px')}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem 0',
              }}>
                {selectedItemForDetails.details?.name || selectedItemForDetails.category}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                margin: 0,
              }}>
                {selectedItemForDetails.category}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
            }}>
              <button
                onClick={handleShowItemDetails}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Eye size={16} />
                View Details
              </button>
              <button
                onClick={handleMixAndMatchFromCatalog}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Wand2 size={16} />
                Mix & Match
              </button>
            </div>

            <button
              onClick={handleCloseItemOptions}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItemForDetails && (
        <ItemDetailsModal
          isOpen={showItemDetailsModal}
          onClose={handleCloseItemDetailsModal}
          item={selectedItemForDetails}
          getImageUrl={getImageUrl}
        />
      )}

      {/* Add CSS keyframes for spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Wardrobe; 