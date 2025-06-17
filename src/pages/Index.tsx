
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/UserProfile';
import FoodScanner from '@/components/FoodScanner';
import ScanResults from '@/components/ScanResults';
import ProductHistory from '@/components/ProductHistory';
import { UserProfile as UserProfileType, ScannedProduct } from '@/types/health';
import { analyzeFoodProduct } from '@/utils/foodAnalysis';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Search } from 'lucide-react';

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [currentProduct, setCurrentProduct] = useState<ScannedProduct | null>(null);
  const [productHistory, setProductHistory] = useState<ScannedProduct[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('healthProfile');
    const savedHistory = localStorage.getItem('productHistory');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setActiveTab('scanner');
    }
    
    if (savedHistory) {
      setProductHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save profile to localStorage
  const handleProfileSaved = (profile: UserProfileType) => {
    setUserProfile(profile);
    localStorage.setItem('healthProfile', JSON.stringify(profile));
    setActiveTab('scanner');
  };

  // Handle image capture and analysis
  const handleImageCaptured = async (imageData: string) => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your health profile first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analyzedProduct = await analyzeFoodProduct(imageData, userProfile);
      setCurrentProduct(analyzedProduct);
      setActiveTab('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save product to history
  const handleSaveToHistory = (product: ScannedProduct) => {
    const updatedHistory = [product, ...productHistory];
    setProductHistory(updatedHistory);
    localStorage.setItem('productHistory', JSON.stringify(updatedHistory));
    toast({
      title: "Saved to History",
      description: "Product has been saved to your scan history.",
    });
  };

  // Clear scan results and return to scanner
  const handleScanAnother = () => {
    setCurrentProduct(null);
    setActiveTab('scanner');
  };

  // View product from history
  const handleProductSelect = (product: ScannedProduct) => {
    setCurrentProduct(product);
    setActiveTab('results');
  };

  // Clear all history
  const handleClearHistory = () => {
    setProductHistory([]);
    localStorage.removeItem('productHistory');
    toast({
      title: "History Cleared",
      description: "All scan history has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">HealthScan</h1>
              <p className="text-sm text-gray-600">Smart food analysis for your health</p>
            </div>
            {userProfile && (
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile.weight} {userProfile.weightUnit}</p>
                <p className="text-xs text-gray-500">
                  {userProfile.healthConditions.length + userProfile.allergies.length} conditions tracked
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2" disabled={!userProfile}>
              <Camera className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile 
              onProfileSaved={handleProfileSaved}
              existingProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="scanner">
            {!userProfile ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Complete Your Health Profile
                </h3>
                <p className="text-gray-500 mb-4">
                  Set up your profile first to get personalized food analysis.
                </p>
                <Button onClick={() => setActiveTab('profile')}>
                  Create Profile
                </Button>
              </div>
            ) : isAnalyzing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Product...</h3>
                <p className="text-gray-500">This may take a few moments</p>
              </div>
            ) : (
              <FoodScanner onImageCaptured={handleImageCaptured} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <ProductHistory 
              products={productHistory}
              onProductSelect={handleProductSelect}
              onClearHistory={handleClearHistory}
            />
          </TabsContent>

          <TabsContent value="results">
            {currentProduct && (
              <ScanResults 
                product={currentProduct}
                onScanAnother={handleScanAnother}
                onSaveToHistory={handleSaveToHistory}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Access Notice */}
      {!userProfile && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-medium mb-1">Welcome to HealthScan!</h4>
          <p className="text-sm opacity-90">
            Set up your health profile to start scanning food products safely.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
