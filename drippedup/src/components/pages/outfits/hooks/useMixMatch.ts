import { useState } from 'react';

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
}

const useMixMatch = () => {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchType, setMatchType] = useState<'category' | 'outfit' | null>(null);

  // Placeholder matching logic - will be replaced with ML model later
  const matchByCategory = async (
    selectedItem: ClothingItem,
    targetCategory: string,
    allItems: ClothingItem[]
  ): Promise<MatchResult[]> => {
    setIsMatching(true);
    setMatchType('category');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter items by target category and exclude the selected item
    const categoryItems = allItems.filter(
      item => item.category === targetCategory && item.id !== selectedItem.id
    );

    // Simple placeholder logic - randomize results with confidence scores
    const results: MatchResult[] = categoryItems.map(item => ({
      item,
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100% confidence
      reason: `Matches well with ${selectedItem.category.toLowerCase()}`
    }));

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    setMatchResults(results.slice(0, 6)); // Limit to 6 results
    setIsMatching(false);
    return results;
  };

  const matchFullOutfit = async (
    selectedItem: ClothingItem,
    allItems: ClothingItem[]
  ): Promise<MatchResult[]> => {
    setIsMatching(true);
    setMatchType('outfit');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all categories except the selected item's category
    const availableCategories = [...new Set(allItems.map(item => item.category))]
      .filter(category => category !== selectedItem.category);

    // Select one item from each category for a complete outfit
    const outfitItems: MatchResult[] = [];

    availableCategories.forEach(category => {
      const categoryItems = allItems.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        // Pick a random item from this category
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        outfitItems.push({
          item: randomItem,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
          reason: `Complements ${selectedItem.category.toLowerCase()} perfectly`
        });
      }
    });

    // Sort by confidence
    outfitItems.sort((a, b) => b.confidence - a.confidence);

    setMatchResults(outfitItems.slice(0, 8)); // Limit to 8 results
    setIsMatching(false);
    return outfitItems;
  };

  const clearResults = () => {
    setMatchResults([]);
    setMatchType(null);
  };

  const saveOutfit = async (items: ClothingItem[]) => {
    // Placeholder for saving outfit functionality
    console.log('Saving outfit with items:', items);
    // This will be implemented later when outfit saving is added
  };

  return {
    matchResults,
    isMatching,
    matchType,
    matchByCategory,
    matchFullOutfit,
    clearResults,
    saveOutfit,
  };
};

export default useMixMatch; 