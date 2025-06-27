import { useState, useRef } from 'react';
import config from '../../../../config';

interface UseImageUploadReturn {
  image: string | null;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleReset: () => void;
  triggerFileSelect: () => void;
}

export const useImageUpload = (onImageSelected?: (file: File) => void): UseImageUploadReturn => {
  const [image, setImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!config.ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPG, PNG, or WebP image.';
    }

    if (file.size > config.MAX_FILE_SIZE) {
      return 'File too large. Please upload an image smaller than 10MB.';
    }

    return null;
  };

  const processImage = (file: File) => {
    const error = validateFile(file);
    if (error) {
      console.error(error);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call the callback if provided
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
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
        processImage(file);
      }
    }
  };

  const handleReset = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return {
    image,
    dragActive,
    fileInputRef,
    handleImageChange,
    handleDrag,
    handleDrop,
    handleReset,
    triggerFileSelect,
  };
}; 