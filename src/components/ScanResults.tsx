
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScannedProduct, ProductWarning } from '@/types/health';
import { Check, X, ArrowUp } from 'lucide-react';

interface ScanResultsProps {
  product: ScannedProduct;
  onScanAnother: () => void;
  onSaveToHistory: (product: ScannedProduct) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ product, onScanAnother, onSaveToHistory }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getWarningIcon = (severity: string) => {
    return severity === 'high' ? (
      <X className="h-4 w-4 text-red-600" />
    ) : (
      <ArrowUp className="h-4 w-4 text-yellow-600" />
    );
  };

  const handleSaveProduct = () => {
    onSaveToHistory(product);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Product Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription>Analysis Results</CardDescription>
            </div>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Health Compatibility Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Health Compatibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{product.compatibilityScore}%</span>
            <Badge variant={getRiskBadgeVariant(product.riskLevel)} className="text-sm">
              {product.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <Progress 
            value={product.compatibilityScore} 
            className="h-3"
          />
          <p className="text-sm text-gray-600">
            Based on your health profile and dietary restrictions
          </p>
        </CardContent>
      </Card>

      {/* Warnings */}
      {product.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-700">Health Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.warnings.map((warning, index) => (
              <Alert key={index} className="border-red-200">
                <div className="flex items-start space-x-2">
                  {getWarningIcon(warning.severity)}
                  <div className="flex-1">
                    <AlertDescription>
                      <span className="font-medium">{warning.ingredient}</span> - {warning.reason}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {warning.type.replace('_', ' ')}
                      </Badge>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient, index) => {
              const hasWarning = product.warnings.some(w => 
                w.ingredient.toLowerCase().includes(ingredient.toLowerCase())
              );
              return (
                <Badge 
                  key={index} 
                  variant={hasWarning ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {ingredient}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Facts */}
      {product.nutritionFacts && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nutrition Facts</CardTitle>
            <CardDescription>Per {product.nutritionFacts.servingSize}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Calories</span>
                <span className="font-medium">{product.nutritionFacts.calories}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Fat</span>
                <span className="font-medium">{product.nutritionFacts.totalFat}g</span>
              </div>
              <div className="flex justify-between">
                <span>Sodium</span>
                <span className="font-medium">{product.nutritionFacts.sodium}mg</span>
              </div>
              <div className="flex justify-between">
                <span>Sugar</span>
                <span className="font-medium">{product.nutritionFacts.sugar}g</span>
              </div>
              <div className="flex justify-between">
                <span>Protein</span>
                <span className="font-medium">{product.nutritionFacts.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs</span>
                <span className="font-medium">{product.nutritionFacts.totalCarbohydrates}g</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alternatives */}
      {product.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Healthier Alternatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {product.alternatives.map((alternative, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{alternative}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onScanAnother}
          className="flex-1"
        >
          Scan Another Product
        </Button>
        <Button 
          onClick={handleSaveProduct}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          Save to History
        </Button>
      </div>
    </div>
  );
};

export default ScanResults;
