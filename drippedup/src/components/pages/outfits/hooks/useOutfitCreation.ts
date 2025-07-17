// src/components/pages/outfits/hooks/useOutfitCreation.ts - FIXED
import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext'; // Import useAuth
import config from '../../../../config';

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

interface SaveOutfitResponse {
  message: string;
  outfit: {
    id: string;
    name: string;
    item_ids: string[];
    description: string;
    tags: string[];
  };
}

export const useOutfitCreation = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedOutfit, setSavedOutfit] = useState<SaveOutfitResponse | null>(null);
  const { user } = useAuth(); // Get current user

  const saveOutfit = async (
    selectedItems: ClothingItem[],
    outfitData: OutfitData
  ): Promise<boolean> => {
    if (!user?.id) {
      setSaveError('You must be logged in to save outfits');
      return false;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', outfitData.name);
      formData.append('item_ids', JSON.stringify(selectedItems.map(item => item.id)));
      formData.append('description', outfitData.description);
      formData.append('tags', JSON.stringify(outfitData.tags));
      formData.append('user_id', user.id); // Add user_id here!

      console.log('Saving outfit with data:', {
        name: outfitData.name,
        item_ids: JSON.stringify(selectedItems.map(item => item.id)),
        description: outfitData.description,
        tags: JSON.stringify(outfitData.tags),
        user_id: user.id
      });

      const response = await fetch(`${config.API_BASE_URL}/outfit`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: SaveOutfitResponse = await response.json();
      setSavedOutfit(result);
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error saving outfit:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save outfit');
      setIsSaving(false);
      return false;
    }
  };

  const clearSaveState = () => {
    setSaveError(null);
    setSavedOutfit(null);
  };

  return {
    isSaving,
    saveError,
    savedOutfit,
    saveOutfit,
    clearSaveState,
  };
};