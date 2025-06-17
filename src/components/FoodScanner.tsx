
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Image, X, Lightbulb, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, ScannedProduct } from '@/types/health';
import { calculateOverallHealthScore } from '@/utils/healthScoring';

interface FoodScannerProps {
  onImageCaptured: (imageData: string) => void;
  userProfile?: UserProfile | null;
  productHistory: ScannedProduct[];
}

const healthTips = [
  "💡 Tip: Look for products with fewer than 5 ingredients for simpler, healthier choices!",
  "🥗 Tip: Foods with natural colors often contain more nutrients than artificially colored ones.",
  "🧂 Tip: Check sodium content - aim for less than 300mg per serving for heart health.",
  "🍯 Tip: Natural sweeteners like honey or maple syrup are better than high fructose corn syrup.",
  "🌾 Tip: Whole grains should be listed as the first ingredient in bread and cereals.",
  "🥥 Tip: Avoid trans fats completely - look for 'partially hydrogenated' oils in ingredients.",
  "🍎 Tip: Fresh is best, but frozen fruits and vegetables are great nutritious alternatives!",
  "🏷️ Tip: Don't be fooled by 'natural' labels - always check the full ingredient list.",
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
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Health Score Mini Display */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-700">Your Health Score</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-700">{healthScore}/100</span>
              </div>
            </div>
            <Progress value={healthScore} className="h-2 bg-emerald-100" />
          </CardContent>
        </Card>
      )}

      {/* Main Scanner Card */}
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Camera className="h-6 w-6" />
            Scan Food Product
          </CardTitle>
          <CardDescription className="text-emerald-50">
            Point, snap, and discover what's really in your food
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {!previewImage ? (
            <div className="space-y-4">
              {/* Camera Capture Area */}
              <div className="relative">
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center bg-gradient-to-br from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 transition-colors">
                  <div className="relative">
                    <Camera className="mx-auto h-20 w-20 text-emerald-600 mb-4 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-20 animate-ping"></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Position the ingredient label clearly in view
                  </p>
                  <Button 
                    onClick={handleCameraCapture}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* File Upload Alternative */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">or</p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
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
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Food product preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-emerald-200"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearPreview}
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Analysis Button */}
              <Button 
                onClick={handleAnalyzeImage}
                disabled={isCapturing}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isCapturing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Magic...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Analyze Food Product
                  </>
                )}
              </Button>

              {isCapturing && (
                <div className="text-center text-sm text-gray-600 animate-fade-in">
                  <p className="font-medium">🔍 Extracting ingredients and nutritional information...</p>
                  <p className="mt-1">✨ Checking against your health profile...</p>
                  <p className="mt-1">🎯 Calculating your personalized health score...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Tip of the Day */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 font-medium">{currentTip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scanning Tips */}
      <Card>
        <CardContent className="pt-4">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Scanning Tips:
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              Ensure the ingredient list is clearly visible
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              Use good lighting for better text recognition
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              Hold the camera steady for sharp images
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              Include nutrition facts if visible
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanner;
