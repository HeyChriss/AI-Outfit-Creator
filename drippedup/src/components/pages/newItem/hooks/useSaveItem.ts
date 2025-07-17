import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext'; 

interface UseSaveItemReturn {
  isUploading: boolean;
  uploadSuccess: boolean;
  saveItem: (imageFile: File, clothingType: string, details: object) => Promise<void>;
  resetSaveState: () => void;
  error: string | null;
}

export const useSaveItem = (onSuccess?: () => void): UseSaveItemReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Using your context

  const saveItem = async (imageFile: File, clothingType: string, details: object) => {
    if (!user?.id) {
      setError('You must be logged in to save items');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('clothing_type', clothingType);
      formData.append('details', JSON.stringify(details));
      formData.append('user_id', user.id);

      const response = await fetch('http://localhost:8000/save-item', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save item');
      }

      setUploadSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving item:', error);
      setError(error instanceof Error ? error.message : 'Failed to save item');
    } finally {
      setIsUploading(false);
    }
  };

  const resetSaveState = () => {
    setIsUploading(false);
    setUploadSuccess(false);
    setError(null);
  };

  return {
    isUploading,
    uploadSuccess,
    saveItem,
    resetSaveState,
    error,
  };
};