import React from 'react';
import {
  Sparkles,
  Camera,
  Wand2,
  Heart,
  RefreshCw,
  Palette,
  Grid3X3,
  Target,
} from 'lucide-react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useOutfitStyles,
  useOutfitData,
  useImageSelection,
  useMixMatch,
} from './hooks';

interface OutfitProps {
  onUploadClick: () => void;
  onLoginClick?: () => void;
  onAboutUsClick?: () => void;
  onLogoClick?: () => void;
}

const Outfit: React.FC<OutfitProps> = ({ 
  onUploadClick, 
  onLoginClick = () => {}, 
  onAboutUsClick = () => {}, 
  onLogoClick = () => {} 
}) => {
  const { user } = useAuth();
  const { styles, isMobile } = useOutfitStyles();
  const {
    categories,
    groupedItems,
    loading,
    error,
    refreshData,
    getImageUrl,
  } = useOutfitData();
  const {
    selectedItem,
    selectedCategory,
    selectItem,
    clearSelection,
    selectCategory,
    isItemSelected,
    isCategorySelected,
  } = useImageSelection();
  const {
    matchResults,
    isMatching,
    matchType,
    matchByCategory,
    matchFullOutfit,
    clearResults,
  } = useMixMatch();

  const handleCategoryMatch = async (category: string) => {
    if (!selectedItem) return;
    
    selectCategory(category);
    const allItems = Object.values(groupedItems).flat();
    await matchByCategory(selectedItem, category, allItems);
  };

  const handleFullOutfitMatch = async () => {
    if (!selectedItem) return;
    
    const allItems = Object.values(groupedItems).flat();
    await matchFullOutfit(selectedItem, allItems);
  };

  const handleItemSelect = (item: any) => {
    clearResults();
    selectItem(item);
  };

  const handleClearAll = () => {
    clearSelection();
    clearResults();
  };

  const renderItemImage = (item: any, size: string = '60px') => (
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

  return (
    <>
      <Header 
        onLoginClick={onLoginClick}
        onAboutUsClick={onAboutUsClick}
        onLogoClick={onLogoClick}
      />
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerOverlay}></div>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>
              Mix & Match Outfits ✨
            </h1>
            <p style={styles.headerSubtitle}>
              Select an item and let AI help you create the perfect outfit combinations!
            </p>
            <div style={styles.quickActions}>
              <button
                onClick={onUploadClick}
                style={{ ...styles.actionButton, ...styles.primaryAction }}
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

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* Main Content */}
        <div style={styles.mainGrid}>
          {/* Sidebar - Item Selection */}
          <div style={styles.sidebar}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <Grid3X3 size={20} />
                  Your Wardrobe
                </h2>
              </div>

              {loading ? (
                <div style={styles.loadingSpinner}>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} style={styles.categorySection}>
                    <div style={styles.categoryTitle}>
                      <Palette size={16} />
                      {category} ({items.length})
                    </div>
                    <div style={styles.itemGrid}>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            ...styles.itemCard,
                            ...(isItemSelected(item.id) ? styles.selectedItem : {}),
                          }}
                          onClick={() => handleItemSelect(item)}
                          onMouseEnter={(e) => {
                            if (!isItemSelected(item.id)) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isItemSelected(item.id)) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          <div style={styles.itemImage}>
                            {renderItemImage(item)}
                          </div>
                          <div style={styles.itemName}>
                            {item.details?.name || `${category} Item`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {!loading && Object.keys(groupedItems).length === 0 && (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>👕</div>
                  <p>No items in your wardrobe yet!</p>
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
          </div>

          {/* Main Mix & Match Area */}
          <div style={styles.mixMatchArea}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <Wand2 size={20} />
                Mix & Match
              </h2>
              {selectedItem && (
                <button
                  onClick={handleClearAll}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Clear Selection
                </button>
              )}
            </div>

            {!selectedItem ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <Sparkles size={64} color="#cbd5e1" />
                </div>
                <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>
                  Select an Item to Get Started
                </h3>
                <p>Choose any item from your wardrobe to see matching suggestions!</p>
              </div>
            ) : (
              <>
                {/* Selected Item Display */}
                <div style={styles.selectedItemDisplay}>
                  <div style={styles.selectedImageContainer}>
                    {renderItemImage(selectedItem, '150px')}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
                      {selectedItem.details?.name || selectedItem.category}
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                      {selectedItem.category}
                    </p>
                  </div>
                </div>

                {/* Match Options */}
                <div style={styles.matchOptions}>
                  <button
                    onClick={handleFullOutfitMatch}
                    disabled={isMatching}
                    style={{
                      ...styles.matchButton,
                      opacity: isMatching ? 0.7 : 1,
                      cursor: isMatching ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMatching) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMatching) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <Sparkles size={20} />
                    {isMatching && matchType === 'outfit' ? 'Creating Outfit...' : 'Create Full Outfit'}
                  </button>

                  {categories.filter(cat => cat !== selectedItem.category).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryMatch(category)}
                      disabled={isMatching}
                      style={{
                        ...styles.matchButton,
                        ...styles.secondaryButton,
                        opacity: isMatching ? 0.7 : 1,
                        cursor: isMatching ? 'not-allowed' : 'pointer',
                        ...(isCategorySelected(category) ? { 
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' 
                        } : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!isMatching) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMatching) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <Target size={20} />
                      {isMatching && matchType === 'category' && isCategorySelected(category) 
                        ? `Matching ${category}...` 
                        : `Match ${category}`}
                    </button>
                  ))}
                </div>

                {/* Results */}
                {isMatching && (
                  <div style={styles.loadingSpinner}>
                    <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: '#667eea' }} />
                    <p style={{ marginLeft: '1rem', color: '#64748b' }}>
                      Finding perfect matches...
                    </p>
                  </div>
                )}

                {matchResults.length > 0 && !isMatching && (
                  <div>
                    <h3 style={{ 
                      marginBottom: '1rem', 
                      color: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Heart size={20} color="#ef4444" />
                      {matchType === 'outfit' ? 'Complete Outfit Suggestions' : `${selectedCategory} Matches`}
                    </h3>
                    <div style={styles.resultsGrid}>
                      {matchResults.map((result) => (
                        <div
                          key={result.item.id}
                          style={styles.resultCard}
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
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 0.75rem',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {renderItemImage(result.item, '80px')}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '0.25rem',
                          }}>
                            {result.item.details?.name || result.item.category}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginBottom: '0.5rem',
                          }}>
                            {result.item.category}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#10b981',
                            marginBottom: '0.25rem',
                          }}>
                            {result.confidence}% Match
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#94a3b8',
                            fontStyle: 'italic',
                          }}>
                            {result.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      
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

export default Outfit; 