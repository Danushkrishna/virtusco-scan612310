
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Image, X, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, ScannedProduct } from '@/types/health';
import { calculateOverallHealthScore } from '@/utils/healthScoring';

interface FoodScannerProps {
  onImageCaptured: (imageData: string) => void;
  userProfile?: UserProfile | null;
  productHistory: ScannedProduct[];
}

const healthTips = [
  "🌱 Tip: Colorful vegetables provide diverse nutrients for optimal health",
  "💧 Stay hydrated with 8 glasses of water daily for better metabolism",
  "🥑 Healthy fats from nuts and avocados support brain function",
  "🍓 Antioxidants in berries help protect against cellular damage",
  "🥬 Leafy greens are packed with vitamins and minerals",
  "🌾 Whole grains provide sustained energy throughout the day",
  "🐟 Omega-3 fatty acids support heart and brain health",
  "🥕 Beta-carotene in orange vegetables promotes eye health",
];

const FoodScanner: React.FC<FoodScannerProps> = ({ onImageCaptured, userProfile, productHistory }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentTip] = useState(() => healthTips[Math.floor(Math.random() * healthTips.length)]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Calculate current health score
  const healthScore = userProfile ? calculateOverallHealthScore(
    productHistory.map(product => ({
      id: product.id,
      productId: product.id,
      productName: product.name,
      score: Math.round((product.compatibilityScore - 50) * 0.8),
      scannedAt: product.scannedAt,
      category: product.riskLevel === 'low' ? 'good' : product.riskLevel === 'medium' ? 'neutral' : 'poor'
    }))
  ) : 50;

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleCameraCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAnalyzeImage = useCallback(() => {
    if (previewImage) {
      setIsCapturing(true);
      // Add success animation
      setTimeout(() => {
        onImageCaptured(previewImage);
        setIsCapturing(false);
        // Success toast with animation
        toast({
          title: "🎉 Scan Successful!",
          description: "Analyzing your food for health insights...",
        });
      }, 2000);
    }
  }, [previewImage, onImageCaptured, toast]);

  const clearPreview = useCallback(() => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Health Score Display */}
      {userProfile && (
        <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 card-hover slide-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Health Score
              </span>
              <span className="text-2xl font-bold text-gray-900">{healthScore}/100</span>
            </div>
            <Progress value={healthScore} className="h-2 bg-gray-100" />
            <div className="text-xs text-gray-500 mt-2">Keep scanning for healthier choices!</div>
          </CardContent>
        </Card>
      )}

      {/* Main Scanner Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg overflow-hidden slide-in-up">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
            Smart Food Scanner
          </CardTitle>
          <CardDescription className="text-gray-600">
            Discover the health impact of your food choices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {!previewImage ? (
            <div className="space-y-6">
              {/* Enhanced Scanner Area */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-green-400 transition-all duration-300 card-hover">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-bounce soft-glow">
                      <Camera className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Tap to scan your food
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Get instant health insights and personalized recommendations
                  </p>
                  <Button 
                    onClick={handleCameraCapture}
                    size="lg"
                    className="primary-button text-lg px-8 py-4 float-bounce"
                  >
                    <Camera className="mr-3 h-5 w-5" />
                    Start Scanning
                  </Button>
                </div>
              </div>

              {/* Alternative Upload */}
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">or</p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="minimal-button"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Upload from Gallery
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Enhanced Image Preview */}
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Food preview"
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200 shadow-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearPreview}
                  className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

              {/* Enhanced Analysis Button */}
              <Button 
                onClick={handleAnalyzeImage}
                disabled={isCapturing}
                size="lg"
                className="w-full primary-button text-lg py-4"
              >
                {isCapturing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Get Health Insights
                  </>
                )}
              </Button>

              {isCapturing && (
                <div className="text-center space-y-2 spring-in bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <p className="font-medium text-gray-900">🔍 Analyzing your food...</p>
                  <p className="text-sm text-green-600">📊 Checking nutritional data</p>
                  <p className="text-sm text-blue-600">🎯 Personalizing recommendations</p>
                  <p className="text-sm text-purple-600">✨ Calculating health score</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Tip */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 card-hover slide-in-right">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 font-medium">{currentTip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scanning Tips */}
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 text-green-500" />
            Best Results Tips:
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              Ensure good lighting and clear view
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              Include nutrition labels when possible
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              Hold camera steady for best recognition
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              Scan individual items for accurate results
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanner;
