import { useState, useEffect } from 'react';
import { config } from '../../../../config';

interface ClothingItem {
  id: string;
  category: string;
  image: string;
  details: any;
  timestamp: string;
}

interface GroupedItems {
  [category: string]: ClothingItem[];
}

const useOutfitData = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchGroupedItems = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/items/grouped`);
      if (response.ok) {
        const data = await response.json();
        setGroupedItems(data.items_by_category || {});
      } else {
        throw new Error('Failed to fetch grouped items');
      }
    } catch (error) {
      console.error('Error fetching grouped items:', error);
      setError('Failed to load items');
    }
  };

  const fetchItemsByCategory = async (category: string): Promise<ClothingItem[]> => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/items/category/${category}`);
      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      } else {
        throw new Error(`Failed to fetch items for category: ${category}`);
      }
    } catch (error) {
      console.error(`Error fetching items for category ${category}:`, error);
      return [];
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchCategories(), fetchGroupedItems()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    return `${config.API_BASE_URL}/images/${imagePath}`;
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    categories,
    groupedItems,
    loading,
    error,
    refreshData,
    fetchItemsByCategory,
    getImageUrl,
  };
};

export default useOutfitData; 