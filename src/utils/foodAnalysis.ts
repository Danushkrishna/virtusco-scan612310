
import { UserProfile, ScannedProduct, ProductWarning, NutritionFacts } from '@/types/health';

// Mock AI analysis function - in a real app, this would call an AI service
export const analyzeFoodProduct = async (
  imageData: string, 
  userProfile: UserProfile
): Promise<ScannedProduct> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock extracted data - in reality, this would come from OCR/AI analysis
  const mockIngredients = [
    'Wheat flour', 'Sugar', 'Palm oil', 'Eggs', 'Milk powder', 
    'Salt', 'Baking powder', 'Vanilla flavoring', 'Soy lecithin'
  ];

  const mockNutrition: NutritionFacts = {
    calories: 150,
    totalFat: 8,
    saturatedFat: 4,
    cholesterol: 25,
    sodium: 200,
    totalCarbohydrates: 18,
    sugar: 12,
    protein: 3,
    servingSize: '2 cookies (30g)'
  };

  // Analyze against user profile
  const warnings = analyzeIngredients(mockIngredients, mockNutrition, userProfile);
  const compatibilityScore = calculateCompatibilityScore(warnings, mockNutrition, userProfile);
  const riskLevel = determineRiskLevel(warnings, compatibilityScore);
  const alternatives = generateAlternatives(warnings, userProfile);

  return {
    id: Date.now().toString(),
    name: 'Chocolate Chip Cookies',
    imageUrl: imageData,
    ingredients: mockIngredients,
    nutritionFacts: mockNutrition,
    riskLevel,
    compatibilityScore,
    warnings,
    alternatives,
    scannedAt: new Date()
  };
};

const analyzeIngredients = (
  ingredients: string[], 
  nutrition: NutritionFacts, 
  profile: UserProfile
): ProductWarning[] => {
  const warnings: ProductWarning[] = [];

  // Check allergies
  profile.allergies.forEach(allergy => {
    const allergenFound = ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(allergy.toLowerCase()) ||
      (allergy === 'Wheat' && ingredient.toLowerCase().includes('flour')) ||
      (allergy === 'Milk' && ingredient.toLowerCase().includes('milk'))
    );

    if (allergenFound) {
      warnings.push({
        type: 'allergy',
        ingredient: allergy,
        reason: `Contains ${allergy} which is in your allergy list`,
        severity: 'high'
      });
    }
  });

  // Check health conditions
  profile.healthConditions.forEach(condition => {
    if (condition === 'Diabetes' && nutrition.sugar > 10) {
      warnings.push({
        type: 'health_condition',
        ingredient: 'Sugar',
        reason: 'High sugar content may affect blood glucose levels',
        severity: 'medium'
      });
    }

    if (condition === 'Hypertension' && nutrition.sodium > 150) {
      warnings.push({
        type: 'health_condition',
        ingredient: 'Sodium',
        reason: 'High sodium content may increase blood pressure',
        severity: 'medium'
      });
    }

    if (condition === 'High Cholesterol' && nutrition.saturatedFat > 3) {
      warnings.push({
        type: 'health_condition',
        ingredient: 'Saturated Fat',
        reason: 'High saturated fat may increase cholesterol levels',
        severity: 'medium'
      });
    }
  });

  // Check dietary restrictions
  profile.dietaryRestrictions.forEach(restriction => {
    if (restriction === 'Vegan') {
      const nonVeganIngredients = ingredients.filter(ingredient => 
        ['eggs', 'milk', 'butter', 'honey'].some(nonVegan => 
          ingredient.toLowerCase().includes(nonVegan)
        )
      );
      
      nonVeganIngredients.forEach(ingredient => {
        warnings.push({
          type: 'dietary_restriction',
          ingredient,
          reason: 'Contains animal products (not vegan)',
          severity: 'low'
        });
      });
    }

    if (restriction === 'Gluten-Free') {
      const glutenIngredients = ingredients.filter(ingredient => 
        ['wheat', 'flour', 'barley', 'rye'].some(gluten => 
          ingredient.toLowerCase().includes(gluten)
        )
      );
      
      glutenIngredients.forEach(ingredient => {
        warnings.push({
          type: 'dietary_restriction',
          ingredient,
          reason: 'Contains gluten',
          severity: 'medium'
        });
      });
    }
  });

  return warnings;
};

const calculateCompatibilityScore = (
  warnings: ProductWarning[], 
  nutrition: NutritionFacts, 
  profile: UserProfile
): number => {
  let score = 100;

  // Deduct points for warnings
  warnings.forEach(warning => {
    switch (warning.severity) {
      case 'high':
        score -= 30;
        break;
      case 'medium':
        score -= 15;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });

  // Additional deductions for health conditions
  profile.healthConditions.forEach(condition => {
    if (condition === 'Diabetes' && nutrition.sugar > 15) score -= 10;
    if (condition === 'Hypertension' && nutrition.sodium > 200) score -= 10;
    if (condition === 'High Cholesterol' && nutrition.saturatedFat > 5) score -= 10;
  });

  return Math.max(0, Math.min(100, score));
};

const determineRiskLevel = (warnings: ProductWarning[], compatibilityScore: number): 'low' | 'medium' | 'high' => {
  const hasHighSeverityWarning = warnings.some(w => w.severity === 'high');
  
  if (hasHighSeverityWarning || compatibilityScore < 40) {
    return 'high';
  } else if (warnings.length > 0 || compatibilityScore < 70) {
    return 'medium';
  } else {
    return 'low';
  }
};

const generateAlternatives = (warnings: ProductWarning[], profile: UserProfile): string[] => {
  const alternatives: string[] = [];

  if (warnings.some(w => w.ingredient.toLowerCase().includes('sugar'))) {
    alternatives.push('Sugar-free or low-sugar alternatives');
  }

  if (warnings.some(w => w.type === 'allergy' && w.ingredient === 'Wheat')) {
    alternatives.push('Gluten-free cookies or crackers');
  }

  if (warnings.some(w => w.ingredient.toLowerCase().includes('milk'))) {
    alternatives.push('Dairy-free or plant-based alternatives');
  }

  if (profile.dietaryRestrictions.includes('Vegan')) {
    alternatives.push('Certified vegan cookies and snacks');
  }

  if (alternatives.length === 0) {
    alternatives.push('Organic or whole grain alternatives', 'Fresh fruits for natural sweetness');
  }

  return alternatives;
};
