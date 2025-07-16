import React from 'react';
import {
  Sparkles,
  Camera,
  Wand2,
  Heart,
  RefreshCw,
  Palette,
  Grid3X3,
  ChevronDown,
  Plus,
  Shuffle,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import Header from '../../layout/Header';
import {
  useOutfitStyles,
  useOutfitData,
  useImageSelection,
  useMixMatch,
  useOutfitCreation,
} from './hooks';
import OutfitSaveModal from './OutfitSaveModal';
import ItemDetailsModal from './itemDetailsModal';

interface OutfitProps {
  onUploadClick: () => void;
  onLoginClick?: () => void;
  onAboutUsClick?: () => void;
  onLogoClick?: () => void;
  onWardrobeClick?: () => void;
  onBackToDashboard?: () => void;
}

const Outfit: React.FC<OutfitProps> = ({ 
  onUploadClick, 
  onLoginClick = () => {}, 
  onAboutUsClick = () => {}, 
  onLogoClick = () => {},
  onWardrobeClick = () => {},
  onBackToDashboard = () => {}
}) => {
  const { styles} = useOutfitStyles();
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
    isItemSelected
  } = useImageSelection();
  const {
    matchResults,
    isMatching,
    matchType,
    error: matchError,
    matchByCategory,
    matchFullOutfit,
    clearResults,
  } = useMixMatch();
  const {
    isSaving,
    saveError,
    saveOutfit,
    clearSaveState,
  } = useOutfitCreation();

  // Modal state
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [showManualSaveModal, setShowManualSaveModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  
  // Dropdown state for category selection
  const [selectedDropdownCategory, setSelectedDropdownCategory] = React.useState<string>('');
  
  // Track removed items from full outfit
  const [removedItemIds, setRemovedItemIds] = React.useState<Set<string>>(new Set());
  
  // Manual outfit creation state
  const [manualOutfitItems, setManualOutfitItems] = React.useState<any[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOverManual, setDragOverManual] = React.useState(false);
  
  // Modal states for item details
  const [selectedItemForDetails, setSelectedItemForDetails] = React.useState<any>(null);
  const [showItemDetails, setShowItemDetails] = React.useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = React.useState(false);

  const handleDropdownCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedDropdownCategory(category);
    
    if (category && selectedItem) {
      selectCategory(category);
      const allItems = Object.values(groupedItems).flat();
      await matchByCategory(selectedItem, category, allItems);
    }
  };

  const handleFullOutfitMatch = async () => {
    if (!selectedItem) return;
    
    const allItems = Object.values(groupedItems).flat();
    await matchFullOutfit(selectedItem, allItems);
  };

  const handleItemSelect = (item: any) => {
    clearResults();
    selectItem(item);
    setSelectedDropdownCategory('');
    setRemovedItemIds(new Set());
  };

  const handleClearAll = () => {
    clearSelection();
    clearResults();
    setShowSaveModal(false);
    setShowManualSaveModal(false);
    clearSaveState();
    setSuccessMessage(null);
    setSelectedDropdownCategory('');
    setRemovedItemIds(new Set());
    setManualOutfitItems([]);
  };

  // Manual outfit handlers
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverManual(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverManual(true);
  };

  const handleDragLeave = () => {
    setDragOverManual(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverManual(false);
    setIsDragging(false);
    
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
      // Check if item is already in manual outfit
      if (!manualOutfitItems.some(existingItem => existingItem.id === itemData.id)) {
        setManualOutfitItems(prev => [...prev, itemData]);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleRemoveFromManualOutfit = (itemId: string) => {
    setManualOutfitItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearManualOutfit = () => {
    setManualOutfitItems([]);
  };

  const handleSaveManualOutfit = () => {
    if (manualOutfitItems.length > 0) {
      setShowManualSaveModal(true);
    }
  };

  const handleRemoveFromOutfit = (itemIdToRemove: string) => {
    setRemovedItemIds(prev => new Set([...prev, itemIdToRemove]));
  };

  // Filter out removed items from match results for display
  const filteredMatchResults = matchResults.filter(result => !removedItemIds.has(result.item.id));

  const handleOpenSaveModal = () => {
    if (selectedItem && filteredMatchResults.length > 0) {
      setShowSaveModal(true);
    }
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    clearSaveState();
  };

  const handleCloseManualSaveModal = () => {
    setShowManualSaveModal(false);
    clearSaveState();
  };

  const handleSaveAIOutfit = async (outfitData: any) => {
    if (!selectedItem || filteredMatchResults.length === 0) return;

    const selectedItems = filteredMatchResults.map(result => result.item);
    const success = await saveOutfit(selectedItems, outfitData);
    
    if (success) {
      setShowSaveModal(false);
      setSuccessMessage(`AI Outfit "${outfitData.name}" saved successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      clearResults();
      clearSelection();
    }
  };

  const handleSaveManualOutfitFinal = async (outfitData: any) => {
    if (manualOutfitItems.length === 0) return;

    const success = await saveOutfit(manualOutfitItems, outfitData);
    
    if (success) {
      setShowManualSaveModal(false);
      setSuccessMessage(`Manual Outfit "${outfitData.name}" saved successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      setManualOutfitItems([]);
    }
  };

  // Wardrobe navigation handler
  const handleShowAllCategories = () => {
    onWardrobeClick();
  };

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
    // Bring the item back to outfit page and set it as selected
    selectItem(selectedItemForDetails);
    setShowItemDetails(false);
    setSelectedItemForDetails(null);
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

        {(error || matchError || saveError) && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626',
          }}>
            {error || matchError || saveError}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Heart size={20} color="#10b981" />
            {successMessage}
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
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                          style={{
                            ...styles.itemCard,
                            ...(isItemSelected(item.id) ? styles.selectedItem : {}),
                            cursor: isDragging ? 'grabbing' : 'grab',
                            opacity: isDragging ? 0.7 : 1,
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
              <button
                  onClick={handleShowAllCategories}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5a67d8';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Eye size={16} />
                  All Categories
                </button>

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
                  <ArrowLeft size={20} />
                  Back to Dashboard
                </button> 
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

                  {/* Category Dropdown */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                  }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}>
                      Or match with specific category:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedDropdownCategory}
                        onChange={handleDropdownCategoryChange}
                        disabled={isMatching}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          paddingRight: '2.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          outline: 'none',
                          appearance: 'none',
                          cursor: isMatching ? 'not-allowed' : 'pointer',
                          opacity: isMatching ? 0.7 : 1,
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#667eea';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <option value="">Select a category...</option>
                        {categories.filter(cat => cat !== selectedItem.category).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <ChevronDown 
                        size={20} 
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#9ca3af',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                    {isMatching && matchType === 'category' && selectedDropdownCategory && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#667eea',
                        fontWeight: '500',
                      }}>
                        Matching {selectedDropdownCategory}...
                      </div>
                    )}
                  </div>
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

                {filteredMatchResults.length > 0 && !isMatching && (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}>
                      <h3 style={{ 
                        margin: 0,
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Heart size={20} color="#ef4444" />
                        {matchType === 'outfit' ? 'Complete Outfit Suggestions' : `${selectedCategory} Matches`}
                        {matchType === 'outfit' && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            fontWeight: '400'
                          }}>
                            ({filteredMatchResults.length} items)
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={handleOpenSaveModal}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Heart size={16} />
                        Save Outfit
                      </button>
                    </div>
                    <div style={styles.resultsGrid}>
                      {filteredMatchResults.map((result) => (
                        <div
                          key={result.item.id}
                          style={{
                            ...styles.resultCard,
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Remove button for full outfit */}
                          {matchType === 'outfit' && (
                            <button
                              onClick={() => handleRemoveFromOutfit(result.item.id)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '20px',
                                height: '30px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                lineHeight: '1',
                                zIndex: 10,
                              }}
                              title="Remove from outfit"
                            >
                              ×
                            </button>
                          )}
                          
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

        {/* Manual Outfit Creation Section */}
        <div style={{
          margin: '2rem 0',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <Shuffle size={24} />
              Manual Outfit Creator
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleClearManualOutfit}
                disabled={manualOutfitItems.length === 0}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: manualOutfitItems.length === 0 ? '#f1f5f9' : '#fee2e2',
                  color: manualOutfitItems.length === 0 ? '#94a3b8' : '#dc2626',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: manualOutfitItems.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Clear All
              </button>
              <button
                onClick={handleSaveManualOutfit}
                disabled={manualOutfitItems.length === 0}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: manualOutfitItems.length === 0 ? '#f1f5f9' : '#10b981',
                  color: manualOutfitItems.length === 0 ? '#94a3b8' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: manualOutfitItems.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Heart size={16} />
                Save Outfit ({manualOutfitItems.length})
              </button>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              minHeight: '200px',
              border: dragOverManual ? '3px dashed #10b981' : '2px dashed #cbd5e1',
              borderRadius: '12px',
              backgroundColor: dragOverManual ? '#f0fdf4' : '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              transition: 'all 0.2s ease',
            }}
          >
            {manualOutfitItems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
              }}>
                <Plus 
                  size={48} 
                  color={dragOverManual ? '#10b981' : '#cbd5e1'}
                  style={{ marginBottom: '1rem' }}
                />
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: dragOverManual ? '#065f46' : '#475569',
                }}>
                  {dragOverManual ? 'Drop to add item!' : 'Drag items here to create your outfit'}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  margin: 0,
                  color: '#94a3b8',
                }}>
                  Drag and drop clothing items from your wardrobe above
                </p>
              </div>
            ) : (
              <div style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
              }}>
                {manualOutfitItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: 'relative',
                      padding: '1rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveFromManualOutfit(item.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        lineHeight: '1',
                        zIndex: 10,
                      }}
                      title="Remove from outfit"
                    >
                      ×
                    </button>

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
                      {renderItemImage(item, '80px')}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '0.25rem',
                    }}>
                      {item.details?.name || item.category}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}>
                      {item.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {dragOverManual && (
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: '600',
            }}>
              Release to add item to your manual outfit!
            </div>
                     )}
         </div>
      </div>
      {/* <Footer />  */}
      
      {/* AI Outfit Save Modal */}
      {selectedItem && (
        <OutfitSaveModal
          isOpen={showSaveModal}
          onClose={handleCloseSaveModal}
          onSave={handleSaveAIOutfit}
          selectedItems={filteredMatchResults.map(result => result.item)}
          selectedItem={selectedItem}
          isSaving={isSaving}
          getImageUrl={getImageUrl}
        />
      )}

      {/* Manual Outfit Save Modal */}
      {manualOutfitItems.length > 0 && (
        <OutfitSaveModal
          isOpen={showManualSaveModal}
          onClose={handleCloseManualSaveModal}
          onSave={handleSaveManualOutfitFinal}
          selectedItems={manualOutfitItems.slice(1)} // Exclude first item to avoid duplication
          selectedItem={manualOutfitItems[0]} // Use first item as selectedItem
          isSaving={isSaving}
                    getImageUrl={getImageUrl}
        />
      )}

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
              onClick={() => setShowItemDetails(false)}
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

export default Outfit; 