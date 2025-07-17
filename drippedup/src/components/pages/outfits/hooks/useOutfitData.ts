// src/components/pages/outfits/hooks/useOutfitData.ts - FIXED with Auth
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { config } from '../../../../config';

interface ClothingItem {
  id: string;
  category: string;
  image: string;
  image_url?: string; // For Supabase items
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
  const { user } = useAuth(); // Add auth integration

  const fetchCategories = async () => {
    if (!user?.id) {
      setCategories([]);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/categories?user_id=${user.id}`);
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
    if (!user?.id) {
      setGroupedItems({});
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/items/grouped?user_id=${user.id}`);
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
    if (!user?.id) return [];

    try {
      const response = await fetch(`${config.API_BASE_URL}/items/category/${category}?user_id=${user.id}`);
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
    if (!user?.id) {
      setLoading(false);
      setGroupedItems({});
      setCategories([]);
      return;
    }

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

  const getImageUrl = (imagePath: string | undefined): string => {
    // Handle undefined or null imagePath
    if (!imagePath) {
      console.warn('getImageUrl called with undefined or null imagePath');
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJtMyAzIDMgOSAxMy0xMHoiLz48cGF0aCBkPSJNNiAxMWgxMSIvPjwvc3ZnPg=='; // Base64 encoded SVG placeholder
    }

    // Check if it's already a full URL (Supabase storage URL)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Otherwise, construct the URL for local storage
    return `${config.API_BASE_URL}/images/${imagePath}`;
  };

  // Alternative function for handling item objects directly
  const getImageUrlFromItem = (item: ClothingItem): string => {
    // Priority order: image_url (Supabase) > image (local) > fallback
    if (item.image_url) {
      return getImageUrl(item.image_url);
    }
    if (item.image) {
      return getImageUrl(item.image);
    }
    return getImageUrl(undefined); // Will return placeholder
  };

  useEffect(() => {
    if (user?.id) {
      refreshData();
    } else {
      setLoading(false);
      setGroupedItems({});
      setCategories([]);
    }
  }, [user?.id]);

  return {
    categories,
    groupedItems,
    loading,
    error,
    refreshData,
    fetchItemsByCategory,
    getImageUrl,
    getImageUrlFromItem, // New function for safer item image handling
  };
};

export default useOutfitData;