
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodScannerProps {
  onImageCaptured: (imageData: string) => void;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ onImageCaptured }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      // Simulate processing time
      setTimeout(() => {
        onImageCaptured(previewImage);
        setIsCapturing(false);
      }, 2000);
    }
  }, [previewImage, onImageCaptured]);

  const clearPreview = useCallback(() => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-emerald-700">Scan Food Product</CardTitle>
          <CardDescription>
            Take a photo of the ingredient label or food item for health analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!previewImage ? (
            <div className="space-y-4">
              {/* Camera Capture Area */}
              <div className="relative">
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50/50">
                  <Camera className="mx-auto h-16 w-16 text-emerald-600 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Position the ingredient label clearly in view
                  </p>
                  <Button 
                    onClick={handleCameraCapture}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* File Upload Alternative */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">or</p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearPreview}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Analysis Button */}
              <Button 
                onClick={handleAnalyzeImage}
                disabled={isCapturing}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isCapturing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Food Product'
                )}
              </Button>

              {isCapturing && (
                <div className="text-center text-sm text-gray-600">
                  <p>Extracting ingredients and nutritional information...</p>
                  <p className="mt-1">Checking against your health profile...</p>
                </div>
              )}
            </div>
          )}

          {/* Scanning Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Scanning Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure the ingredient list is clearly visible</li>
              <li>• Use good lighting for better text recognition</li>
              <li>• Hold the camera steady for sharp images</li>
              <li>• Include nutrition facts if visible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanner;
