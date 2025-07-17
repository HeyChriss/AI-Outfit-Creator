import React, { useState, useEffect } from 'react';
import { X, Eye, Calendar, Tag, Package, RefreshCw } from 'lucide-react';
import config from '../../../config';

interface ClothingItem {
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

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ClothingItem;
  getImageUrl: (imagePath: string) => string;
}

interface ItemDetails {
  id: string;
  category: string;
  image: string;
  details: any;
  timestamp: string;
<<<<<<< HEAD
  image_url?: string;
=======
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4
  brand?: string;
  color?: string;
  occasion?: string;
  [key: string]: any;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  getImageUrl,
}) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch item details when modal opens
  useEffect(() => {
    if (isOpen && item) {
      fetchItemDetails();
    }
  }, [isOpen, item]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/item/${item.id}`);
      if (response.ok) {
        const data = await response.json();
        // Extract the item data from the response
        setItemDetails(data.item);
      } else {
        // Fallback to basic item info if API fails
        setItemDetails({
          ...item,
          details: item.details || {},
        });
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Failed to load item details');
      // Fallback to basic item info
      setItemDetails({
        ...item,
        details: item.details || {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchItemDetails();
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  if (!isOpen) return null;

  return (
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
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            margin: 0,
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Eye size={24} />
            Item Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              color: '#64748b',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          /* Loading State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            textAlign: 'center',
          }}>
            <RefreshCw size={32} style={{ 
              animation: 'spin 1s linear infinite',
              color: '#667eea',
              marginBottom: '1rem'
            }} />
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              margin: 0,
            }}>
              Loading item details...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#dc2626',
          }}>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={handleRetry}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Try Again
            </button>
          </div>
        ) : itemDetails ? (
          /* Content */
          <>
            {/* Item Image */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <div style={{
                width: '250px',
                height: '250px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}>
                <img
<<<<<<< HEAD
                    // Replace the src attribute with this new logic
                    src={itemDetails.image_url || getImageUrl(itemDetails.image)}
                    alt={itemDetails.details?.name || itemDetails.category}
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
                        parent.innerHTML = '<span style="font-size: 4rem; color: #cbd5e1;">👕</span>';
                        }
                    }}
=======
                  src={getImageUrl(itemDetails.image)}
                  alt={itemDetails.details?.name || itemDetails.category}
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
                      parent.innerHTML = '<span style="font-size: 4rem; color: #cbd5e1;">👕</span>';
                    }
                  }}
>>>>>>> 5730abaf8b68f3794e46d984e713d0fb837cc5f4
                />
              </div>
            </div>

            {/* Item Information */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
            }}>
              {/* Item Name */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#1e293b',
                }}>
                  {itemDetails.details?.name || `${itemDetails.category} Item`}
                </h3>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}>
                  <Package size={14} />
                  {itemDetails.category}
                </div>
              </div>

              {/* Upload Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                color: '#64748b',
                fontSize: '0.875rem',
              }}>
                <Calendar size={16} />
                <span>
                  <strong>Uploaded:</strong> {formatDate(itemDetails.timestamp)}
                </span>
              </div>

              {/* Additional Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1rem',
              }}>

                {/* Brand (if available) */}
                {itemDetails.details?.brand && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Brand
                    </label>
                    <p style={{
                      margin: 0,
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#1e293b',
                    }}>
                      {itemDetails.details.brand}
                    </p>
                  </div>
                )}

                {/* Color (if available) */}
                {itemDetails.details?.color && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Color
                    </label>
                    <p style={{
                      margin: 0,
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#1e293b',
                    }}>
                      {itemDetails.details.color}
                    </p>
                  </div>
                )}
              </div>

              {/* Description (if available) */}
              {itemDetails.details?.description && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Description
                  </label>
                  <p style={{
                    margin: 0,
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    lineHeight: '1.5',
                  }}>
                    {itemDetails.details.description}
                  </p>
                </div>
              )}

              {/* Notes (if available) */}
              {itemDetails.details?.notes && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Notes
                  </label>
                  <p style={{
                    margin: 0,
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    lineHeight: '1.5',
                  }}>
                    {itemDetails.details.notes}
                  </p>
                </div>
              )}

              {/* Tags (if available) */}
              {itemDetails.details?.tags && itemDetails.details.tags.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Tags
                  </label>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    {itemDetails.details.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                        }}
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : null}
      </div>

      {/* Add CSS keyframes for spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ItemDetailsModal; 