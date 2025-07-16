import React, { useState } from 'react';
import { X, Save, Plus, Tag } from 'lucide-react';

interface ClothingItem {
  id: string;
  category: string;
  image: string;
  details: any;
  timestamp: string;
}

interface OutfitData {
  name: string;
  description: string;
  tags: string[];
}

interface OutfitSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outfitData: OutfitData) => void;
  selectedItems: ClothingItem[];
  selectedItem: ClothingItem;
  isSaving: boolean;
  getImageUrl: (imagePath: string) => string;
}

const OutfitSaveModal: React.FC<OutfitSaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedItems,
  selectedItem,
  isSaving,
  getImageUrl,
}) => {
  const [outfitName, setOutfitName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!outfitName.trim()) {
      alert('Please enter an outfit name');
      return;
    }

    onSave({
      name: outfitName.trim(),
      description: description.trim(),
      tags,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag();
    }
  };

  const allItems = [selectedItem, ...selectedItems];

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
        maxWidth: '500px',
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
          }}>
            Save Your Outfit
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
          >
            <X size={24} />
          </button>
        </div>

        {/* Outfit Preview */}
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
        }}>
          <h3 style={{
            margin: '0 0 0.75rem 0',
            color: '#334155',
            fontSize: '1rem',
            fontWeight: '600',
          }}>
            Outfit Preview ({allItems.length} items)
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {allItems.map((item, index) => (
              <div key={item.id} style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                position: 'relative',
              }}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.category}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {index === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}>
                    ★
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          {/* Outfit Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
            }}>
              Outfit Name *
            </label>
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              placeholder="e.g., Casual Weekend Look"
              style={{
                width: '75%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white',
                color: 'black',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your outfit style, occasion, or notes..."
              rows={3}
              style={{
                width: '75%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
                backgroundColor: 'white',
                color: 'black',
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
            }}>
              Tags
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: 'black',
                }}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                style={{
                  padding: '0.5rem',
                  background: newTag.trim() ? '#667eea' : '#e5e7eb',
                  color: newTag.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: newTag.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
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
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        marginLeft: '0.25rem',
                        color: '#3730a3',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                color: '#6b7280',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !outfitName.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: (!outfitName.trim() || isSaving) ? '#e5e7eb' : 
                           'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: (!outfitName.trim() || isSaving) ? '#9ca3af' : 'white',
                fontWeight: '600',
                cursor: (!outfitName.trim() || isSaving) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Outfit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSaveModal; 