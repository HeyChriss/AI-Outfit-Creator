import { useState } from 'react';

interface UseSaveItemReturn {
  isUploading: boolean;
  uploadSuccess: boolean;
  saveItem: (imageFile: File, clothingType: string, details: object) => Promise<void>;
  resetSaveState: () => void;
}

export const useSaveItem = (onSuccess?: () => void): UseSaveItemReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const saveItem = async (imageFile: File, clothingType: string, details: object) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('clothing_type', clothingType);
      formData.append('details', JSON.stringify(details));

      const response = await fetch('http://localhost:8000/save-item', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save item');
      }

      setUploadSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetSaveState = () => {
    setIsUploading(false);
    setUploadSuccess(false);
  };

  return {
    isUploading,
    uploadSuccess,
    saveItem,
    resetSaveState,
  };
}; 