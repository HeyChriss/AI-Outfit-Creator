import { useState } from 'react';

interface ItemDetails {
  name: string;
  category: string;
  color: string;
  brand: string;
  notes: string;
}

interface UseItemFormReturn {
  itemDetails: ItemDetails;
  updateField: (field: keyof ItemDetails, value: string) => void;
  resetForm: () => void;
  setCategory: (category: string) => void;
}

const initialItemDetails: ItemDetails = {
  name: '',
  category: '',
  color: '',
  brand: '',
  notes: ''
};

export const useItemForm = (): UseItemFormReturn => {
  const [itemDetails, setItemDetails] = useState<ItemDetails>(initialItemDetails);

  const updateField = (field: keyof ItemDetails, value: string) => {
    setItemDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setItemDetails(initialItemDetails);
  };

  const setCategory = (category: string) => {
    setItemDetails(prev => ({
      ...prev,
      category
    }));
  };

  return {
    itemDetails,
    updateField,
    resetForm,
    setCategory,
  };
}; 