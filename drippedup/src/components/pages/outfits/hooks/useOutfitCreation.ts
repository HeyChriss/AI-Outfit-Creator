import { useState } from 'react';
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
  id: string;
  name: string;
  item_ids: string[];
  description: string;
  tags: string[];
  metadata_file: string;
}

export const useOutfitCreation = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedOutfit, setSavedOutfit] = useState<SaveOutfitResponse | null>(null);

  const saveOutfit = async (
    selectedItems: ClothingItem[],
    outfitData: OutfitData
  ): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', outfitData.name);
      formData.append('item_ids', JSON.stringify(selectedItems.map(item => item.id)));
      formData.append('description', outfitData.description);
      formData.append('tags', JSON.stringify(outfitData.tags));

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