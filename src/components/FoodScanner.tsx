
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Image, X, Lightbulb, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, ScannedProduct } from '@/types/health';
import { calculateOverallHealthScore } from '@/utils/healthScoring';

interface FoodScannerProps {
  onImageCaptured: (imageData: string) => void;
  userProfile?: UserProfile | null;
  productHistory: ScannedProduct[];
}

const healthTips = [
  "🧬 AI Insight: Foods with natural enzymes boost your cellular energy production",
  "🔬 Quantum Nutrition: Antioxidants create molecular shields against aging",
  "⚡ Bio-Hack: Green vegetables contain chlorophyll that optimizes oxygen transport",
  "🚀 Future Food: Plant-based proteins have superior amino acid bioavailability",
  "🌿 Neural Boost: Omega-3s from algae enhance cognitive processing speed",
  "💎 Cellular Repair: Polyphenols activate your body's natural repair mechanisms",
  "🔋 Energy Matrix: Complex carbs provide sustained mitochondrial fuel",
  "🛡️ Defense System: Fiber feeds beneficial bacteria that strengthen immunity",
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
      {/* Futuristic Health Score Display */}
      {userProfile && (
        <Card className="glass-card border-green-400/30 neon-glow">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-400 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Neural Health Score
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-lg font-bold text-white">{healthScore}/100</span>
              </div>
            </div>
            <Progress value={healthScore} className="h-3 bg-gray-800/50" />
            <div className="text-xs text-green-300/70 mt-1">Optimizing biological performance</div>
          </CardContent>
        </Card>
      )}

      {/* Main Scanner Interface */}
      <Card className="glass-card border-white/20 overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-b border-white/10">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Camera className="h-6 w-6 text-green-400" />
            AI Food Scanner
          </CardTitle>
          <CardDescription className="text-green-200">
            Advanced molecular analysis & health optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {!previewImage ? (
            <div className="space-y-4">
              {/* Enhanced Scanner Area */}
              <div className="relative">
                <div className="glass-card border-2 border-dashed border-green-400/50 rounded-xl p-8 text-center hover:border-green-400 transition-all duration-300 scan-pulse">
                  <div className="relative">
                    <Camera className="mx-auto h-24 w-24 text-green-400 mb-4 animate-pulse" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full opacity-0 animate-ping"></div>
                  </div>
                  <p className="text-sm text-white/80 mb-4 font-medium">
                    AI-powered ingredient analysis
                  </p>
                  <Button 
                    onClick={handleCameraCapture}
                    size="lg"
                    className="holographic text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Initiate Scan
                  </Button>
                </div>
              </div>

              {/* Alternative Upload */}
              <div className="text-center">
                <p className="text-sm text-white/50 mb-3">or upload from device</p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-card border-blue-400/50 text-blue-400 hover:bg-blue-400/10 hover:border-blue-400 transition-colors"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Upload Image
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
              {/* Enhanced Image Preview */}
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Food analysis preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-green-400/30 glass-card"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearPreview}
                  className="absolute top-2 right-2 h-8 w-8 p-0 glass-card hover:bg-red-500/20"
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>

              {/* Enhanced Analysis Button */}
              <Button 
                onClick={handleAnalyzeImage}
                disabled={isCapturing}
                size="lg"
                className="w-full holographic text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                {isCapturing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Neural Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {isCapturing && (
                <div className="text-center text-sm text-white/80 animate-fade-in glass-card p-4 rounded-lg">
                  <p className="font-medium mb-2">🤖 AI Analysis in Progress</p>
                  <p className="text-green-400">⚡ Scanning molecular structure...</p>
                  <p className="text-blue-400">🧬 Cross-referencing health database...</p>
                  <p className="text-purple-400">🎯 Personalizing recommendations...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Health Tip */}
      <Card className="glass-card border-blue-400/30">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" />
            <p className="text-sm text-blue-200 font-medium">{currentTip}</p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Scanning Tips */}
      <Card className="glass-card border-white/10">
        <CardContent className="pt-4">
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4 text-green-400" />
            Optimization Protocol:
          </h4>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">•</span>
              Position ingredient matrix clearly in frame
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">•</span>
              Ensure optimal lighting for neural recognition
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">•</span>
              Maintain steady capture for precise analysis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">•</span>
              Include nutritional data when available
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanner;
