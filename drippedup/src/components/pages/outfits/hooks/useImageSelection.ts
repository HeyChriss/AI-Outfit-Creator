import { useState } from 'react';

interface ClothingItem {
  id: string;
  category: string;
  image: string;
  details: any;
  timestamp: string;
}

const useImageSelection = () => {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const selectItem = (item: ClothingItem) => {
    setSelectedItem(item);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSelectedCategory('');
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const isItemSelected = (itemId: string): boolean => {
    return selectedItem?.id === itemId;
  };

  const isCategorySelected = (category: string): boolean => {
    return selectedCategory === category;
  };

  return {
    selectedItem,
    selectedCategory,
    selectItem,
    clearSelection,
    selectCategory,
    isItemSelected,
    isCategorySelected,
  };
};

export default useImageSelection; 