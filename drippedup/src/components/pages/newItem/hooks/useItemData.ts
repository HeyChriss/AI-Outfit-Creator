import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext'; // Adjust path as needed

interface ClothingItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color: string;
  brand: string;
  notes: string;
  image_url: string;
  image_path: string;
  details: any;
  created_at: string;
  updated_at: string;
}

interface GroupedItems {
  [category: string]: ClothingItem[];
}

interface UseItemsDataReturn {
  items: GroupedItems;
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  getItemsByCategory: (category: string) => Promise<ClothingItem[]>;
  getItemById: (itemId: string) => Promise<ClothingItem | null>;
  deleteItem: (itemId: string) => Promise<boolean>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useItemsData = (): UseItemsDataReturn => {
  const [items, setItems] = useState<GroupedItems>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    if (!user?.id) {
      setItems({});
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/items/grouped?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data.items_by_category || {});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getItemsByCategory = async (category: string): Promise<ClothingItem[]> => {
    if (!user?.id) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/items/category/${category}?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch items by category');
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.error('Error fetching items by category:', err);
      return [];
    }
  };

  const getItemById = async (itemId: string): Promise<ClothingItem | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/item/${itemId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch item');
      }
      
      const data = await response.json();
      return data.item || null;
    } catch (err) {
      console.error('Error fetching item by ID:', err);
      return null;
    }
  };

  const deleteItem = async (itemId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/item/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh items after deletion
      await fetchItems();
      return true;
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
      return false;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refreshItems: fetchItems,
    getItemsByCategory,
    getItemById,
    deleteItem,
  };
};