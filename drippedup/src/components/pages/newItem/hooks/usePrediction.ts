import { useState } from 'react';
import config from '../../../../config';

interface PredictionResult {
  predicted_class_name: string;
  confidence: number;
  top_predictions: Array<{
    rank: number;
    class_name: string;
    confidence: number;
  }>;
}

interface UsePredictionReturn {
  isPredicting: boolean;
  predictionResult: PredictionResult | null;
  predictionError: string | null;
  predictCategory: (file: File) => Promise<void>;
  clearPrediction: () => void;
}

export const usePrediction = (onCategoryPredicted?: (category: string) => void): UsePredictionReturn => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const predictCategory = async (file: File) => {
    if (!config.ENABLE_AI_PREDICTION) {
      return;
    }

    setIsPredicting(true);
    setPredictionResult(null);
    setPredictionError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${config.API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      setPredictionResult(result);
      
      // Call the callback with the raw predicted class name
      if (onCategoryPredicted) {
        onCategoryPredicted(result.predicted_class_name);
      }

    } catch (error) {
      console.error('Error predicting category:', error);
      setPredictionError(error instanceof Error ? error.message : 'Failed to predict category');
    } finally {
      setIsPredicting(false);
    }
  };

  const clearPrediction = () => {
    setPredictionResult(null);
    setPredictionError(null);
  };

  return {
    isPredicting,
    predictionResult,
    predictionError,
    predictCategory,
    clearPrediction,
  };
}; 