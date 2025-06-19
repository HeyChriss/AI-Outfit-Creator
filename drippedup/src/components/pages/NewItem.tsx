import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  ArrowLeft, 
  Tag,
  Save
} from 'lucide-react';
import Footer from '../layout/Footer';
import Header from '../layout/Header';

interface NewItemProps {
  onBackToDashboard: () => void;
}

const NewItem: React.FC<NewItemProps> = ({ onBackToDashboard }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [itemDetails, setItemDetails] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    notes: ''
  });
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        onBackToDashboard();
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setImage(null);
    setUploadSuccess(false);
    setItemDetails({
      name: '',
      category: '',
      color: '',
      brand: '',
      notes: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 100%)',
      minHeight: '100%',
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
    title: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      margin: '0.5rem 0 0',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 400px',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    uploadSection: {
      background: 'white',
      borderRadius: '24px',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    dropZone: {
      border: `2px dashed ${dragActive ? '#667eea' : '#cbd5e1'}`,
      borderRadius: '16px',
      padding: '3rem 2rem',
      textAlign: 'center' as const,
      background: dragActive ? 'rgba(102, 126, 234, 0.05)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative' as const,
    },
    dropZoneActive: {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.05)',
      transform: 'scale(1.02)',
    },
    uploadIcon: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
    },
    uploadText: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    uploadSubtext: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '1.5rem',
    },
    selectButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
    },
    hiddenInput: {
      display: 'none',
    },
    imagePreview: {
      marginTop: '1.5rem',
      textAlign: 'center' as const,
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem',
    },
    imageActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    actionButton: {
      padding: '0.75rem 1.25rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
    },
    changeButton: {
      background: '#f1f5f9',
      color: '#64748b',
      border: '1px solid #e2e8f0',
    },
    saveButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    detailsSection: {
      background: 'white',
      borderRadius: '24px',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      height: 'fit-content',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      background: 'white',
      boxSizing: 'border-box' as const,
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      resize: 'vertical' as const,
      minHeight: '80px',
      boxSizing: 'border-box' as const,
    },
    successModal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    successContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '3rem 2rem',
      textAlign: 'center' as const,
      maxWidth: '400px',
      margin: '1rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    },
    successIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
    },
    successTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    successText: {
      color: '#64748b',
      marginBottom: '1.5rem',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem',
    },
  };

  return (
    <>
      <Header onLoginClick={() => {}} />
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
                  onClick={() => fileInputRef.current?.click()}
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
                      disabled={isUploading}
                      style={{...styles.actionButton, ...styles.saveButton}}
                      onMouseEnter={(e) => {
                        if (!isUploading) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isUploading) {
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
                  onChange={(e) => setItemDetails({...itemDetails, name: e.target.value})}
                  placeholder="e.g., Blue Denim Jacket"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={itemDetails.category}
                  onChange={(e) => setItemDetails({...itemDetails, category: e.target.value})}
                  style={styles.select}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Select category</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="dresses">Dresses</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Color</label>
                <input
                  type="text"
                  value={itemDetails.color}
                  onChange={(e) => setItemDetails({...itemDetails, color: e.target.value})}
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
                  onChange={(e) => setItemDetails({...itemDetails, brand: e.target.value})}
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
                  onChange={(e) => setItemDetails({...itemDetails, notes: e.target.value})}
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