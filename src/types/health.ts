
export interface UserProfile {
  id: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  healthConditions: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScannedProduct {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  nutritionFacts: NutritionFacts | null;
  riskLevel: 'low' | 'medium' | 'high';
  compatibilityScore: number;
  warnings: ProductWarning[];
  alternatives: string[];
  scannedAt: Date;
}

export interface NutritionFacts {
  calories: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrates: number;
  sugar: number;
  protein: number;
  servingSize: string;
}

export interface ProductWarning {
  type: 'allergy' | 'health_condition' | 'dietary_restriction';
  ingredient: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export const HEALTH_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'High Cholesterol',
  'Kidney Disease',
  'Celiac Disease',
  'Lactose Intolerance',
  'GERD',
  'Irritable Bowel Syndrome'
];

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame'
];

export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Sodium',
  'Low-Sugar',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher'
];
