import { useState } from 'react';
import config from '../../../../config';

interface ClothingItem {
  id: string;
  category: string;
  image: string;
  details: any;
  timestamp: string;
}

interface MatchResult {
  item: ClothingItem;
  confidence: number;
  reason: string;
  compatibility_score: number;
}

interface FashionPredictResponse {
  compatibility_score: number;
  items: Array<{
    id: string;
    info: ClothingItem;
  }>;
}

const useMixMatch = () => {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchType, setMatchType] = useState<'category' | 'outfit' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to get fashion compatibility score between two items
  const getFashionCompatibility = async (
    selectedItem: ClothingItem,
    compareItem: ClothingItem
  ): Promise<number> => {
    try {
      const formData = new FormData();
      formData.append('item_id1', selectedItem.id);
      formData.append('item_id2', compareItem.id);

      const response = await fetch(`${config.API_BASE_URL}/fashion-predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: FashionPredictResponse = await response.json();
      console.log(`Compatibility between ${selectedItem.id} and ${compareItem.id}:`, result.compatibility_score);
      return result.compatibility_score;
    } catch (error) {
      console.error('Error getting fashion compatibility:', error);
      return 50; // Fallback score
    }
  };

  // Match items by category using real fashion compatibility API
  const matchByCategory = async (
    selectedItem: ClothingItem,
    targetCategory: string,
    allItems: ClothingItem[]
  ): Promise<MatchResult[]> => {
    setIsMatching(true);
    setMatchType('category');
    setError(null);

    try {
      // Filter items by target category and exclude the selected item
      const categoryItems = allItems.filter(
        item => item.category === targetCategory && item.id !== selectedItem.id
      );

      if (categoryItems.length === 0) {
        setMatchResults([]);
        setIsMatching(false);
        return [];
      }

      // Get compatibility scores for all items in parallel
      const compatibilityPromises = categoryItems.map(async (item) => {
        const score = await getFashionCompatibility(selectedItem, item);
        // Convert score from 0-1 to 0-100 for display
        const scorePercentage = score * 100;
        return {
          item,
          confidence: Math.round(scorePercentage),
          compatibility_score: scorePercentage,
          reason: scorePercentage > 80 ? 'Excellent match!' : 
                  scorePercentage > 60 ? 'Good compatibility' : 
                  scorePercentage > 40 ? 'Decent pairing' : 'Basic match'
        };
      });

      const results = await Promise.all(compatibilityPromises);

      // Sort by compatibility score
      results.sort((a, b) => b.compatibility_score - a.compatibility_score);

      // Filter out very low scores and limit results
      const filteredResults = results
        .filter(result => result.compatibility_score > 30)
        .slice(0, 6);

      setMatchResults(filteredResults);
      setIsMatching(false);
      return filteredResults;
    } catch (error) {
      console.error('Error in matchByCategory:', error);
      setError('Failed to find matches. Please try again.');
      setIsMatching(false);
      return [];
    }
  };

  // Match for full outfit using fashion compatibility API
  const matchFullOutfit = async (
    selectedItem: ClothingItem,
    allItems: ClothingItem[]
  ): Promise<MatchResult[]> => {
    setIsMatching(true);
    setMatchType('outfit');
    setError(null);

    try {
      // Get all categories except the selected item's category
      const availableCategories = [...new Set(allItems.map(item => item.category))]
        .filter(category => category !== selectedItem.category);

      if (availableCategories.length === 0) {
        setMatchResults([]);
        setIsMatching(false);
        return [];
      }

      // For each category, find the best matching item
      const outfitPromises = availableCategories.map(async (category) => {
        const categoryItems = allItems.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        // Get compatibility scores for all items in this category
        const itemScores = await Promise.all(
          categoryItems.map(async (item) => {
            const score = await getFashionCompatibility(selectedItem, item);
            return { item, score };
          })
        );

        // Get the best matching item from this category
        const bestMatch = itemScores.reduce((best, current) => 
          current.score > best.score ? current : best
        );

        // Convert score from 0-1 to 0-100 for display
        const scorePercentage = bestMatch.score * 100;
        return {
          item: bestMatch.item,
          confidence: Math.round(scorePercentage),
          compatibility_score: scorePercentage,
          reason: scorePercentage > 80 ? 'Perfect for your outfit!' : 
                  scorePercentage > 60 ? 'Great addition to your look' : 
                  scorePercentage > 40 ? 'Nice complement' : 'Suitable match'
        };
      });

      const results = (await Promise.all(outfitPromises))
        .filter((result): result is MatchResult => result !== null)
        .filter(result => result.compatibility_score > 30);

      // Sort by compatibility score
      results.sort((a, b) => b.compatibility_score - a.compatibility_score);

      setMatchResults(results.slice(0, 8));
      setIsMatching(false);
      return results;
    } catch (error) {
      console.error('Error in matchFullOutfit:', error);
      setError('Failed to create outfit. Please try again.');
      setIsMatching(false);
      return [];
    }
  };

  const clearResults = () => {
    setMatchResults([]);
    setMatchType(null);
    setError(null);
  };

  return {
    matchResults,
    isMatching,
    matchType,
    error,
    matchByCategory,
    matchFullOutfit,
    clearResults,
  };
};

export default useMixMatch; 