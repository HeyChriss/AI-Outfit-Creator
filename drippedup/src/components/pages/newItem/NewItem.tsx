import React from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  ArrowLeft, 
  Tag,
  Save,
  Loader,
  AlertCircle
} from 'lucide-react';
import Footer from '../../layout/Footer';
import Header from '../../layout/Header';
import { useImageUpload } from './hooks/useImageUpload';
import { usePrediction } from './hooks/usePrediction';
import { useItemForm } from './hooks/useItemForm';
import { useSaveItem } from './hooks/useSaveItem';
import { useScreenSize } from './hooks/useScreenSize';
import { useNewItemStyles } from './hooks/useNewItemStyles';

interface NewItemProps {
  onBackToDashboard: () => void;
  onLoginClick: () => void;
  onAboutUsClick?: () => void;
  onLogoClick?: () => void;
}

const NewItem: React.FC<NewItemProps> = ({ onBackToDashboard, onLoginClick, onAboutUsClick, onLogoClick }) => {
  // Custom hooks for state management
  const { isMobile, isTablet } = useScreenSize();
  
  const { itemDetails, updateField, resetForm, setCategory } = useItemForm();
  
  const { predictCategory, isPredicting, predictionError, clearPrediction } = usePrediction(setCategory);
  
  const { 
    image, 
    dragActive, 
    fileInputRef, 
    handleImageChange, 
    handleDrag, 
    handleDrop, 
    handleReset: resetImage,
    triggerFileSelect, 
    selectedFile
  } = useImageUpload(predictCategory);
  
  const { isUploading, uploadSuccess, saveItem, resetSaveState } = useSaveItem(onBackToDashboard);
  
  // Styles hook
  const styles = useNewItemStyles({ isMobile, isTablet, dragActive });

  // Combined reset function
  const handleReset = () => {
    resetImage();
    resetForm();
    clearPrediction();
    resetSaveState();
  };

  // Handle save
  const handleSave = () => {
    if (!selectedFile) return;
    saveItem(selectedFile, itemDetails.category, itemDetails);
  };

  return (
    <>
              <Header onLoginClick={onLoginClick} onAboutUsClick={onAboutUsClick} onLogoClick={onLogoClick} />
      <main style={{
        marginTop: '120px',
        marginBottom: '120px',
        minHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        <div style={styles.container}>
          {/* Header */}
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
            <div>
              <h1 style={styles.title}>Add New Item</h1>
              <p style={styles.subtitle}>Upload and organize your wardrobe items</p>
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Upload Section */}
            <div style={styles.uploadSection}>
              <h2 style={styles.sectionTitle}>
                <Camera size={20} />
                Upload Photo
              </h2>

              {!image ? (
                <div 
                  style={{
                    ...styles.dropZone,
                    ...(dragActive ? styles.dropZoneActive : {})
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  <div style={styles.uploadIcon}>
                    <Upload size={28} color="white" />
                  </div>
                  <div style={styles.uploadText}>
                    Drag and drop your image here
                  </div>
                  <div style={styles.uploadSubtext}>
                    or click to browse files • JPG, PNG up to 10MB
                  </div>
                  <button 
                    style={styles.selectButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Select Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.hiddenInput}
                  />
                </div>
              ) : (
                <div style={styles.imagePreview}>
                  <img 
                    src={image} 
                    alt="Preview" 
                    style={styles.previewImage}
                  />
                  {isPredicting && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b',
                      color: '#92400e',
                      fontWeight: '500'
                    }}>
                      <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Analyzing image with AI...
                    </div>
                  )}
                  {predictionError && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      borderRadius: '8px',
                      border: '1px solid #fca5a5',
                      color: '#991b1b',
                      fontWeight: '500',
                      fontSize: '0.9rem'
                    }}>
                      <AlertCircle size={16} />
                      {predictionError}
                    </div>
                  )}
                  <div style={styles.imageActions}>
                    <button 
                      onClick={handleReset}
                      style={{...styles.actionButton, ...styles.changeButton}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <X size={16} />
                      Change Image
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!selectedFile || isUploading}
                      style={{...styles.actionButton, ...styles.saveButton}}
                      onMouseEnter={(e) => {
                        if (!selectedFile || !isUploading) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedFile || !isUploading) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                    >
                      {isUploading ? (
                        <>
                          <div style={styles.loadingSpinner}></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Item
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div style={styles.detailsSection}>
              <h2 style={styles.sectionTitle}>
                <Tag size={20} />
                Item Details
              </h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name</label>
                <input
                  type="text"
                  value={itemDetails.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Blue Denim Jacket"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <input
                  type="text"
                  value={itemDetails.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  placeholder="e.g., Tops, Bottoms, Dresses, etc."
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Color</label>
                <input
                  type="text"
                  value={itemDetails.color}
                  onChange={(e) => updateField('color', e.target.value)}
                  placeholder="e.g., Navy Blue"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Brand</label>
                <input
                  type="text"
                  value={itemDetails.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  placeholder="e.g., Levi's"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  value={itemDetails.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Add any additional notes about this item..."
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Success Modal */}
      {uploadSuccess && (
        <div style={styles.successModal}>
          <div style={styles.successContent}>
            <div style={styles.successIcon}>
              <Check size={40} color="white" />
            </div>
            <h3 style={styles.successTitle}>Item Added Successfully!</h3>
            <p style={styles.successText}>
              Your item has been added to your closet. Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}
      
      <Footer />
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default NewItem;