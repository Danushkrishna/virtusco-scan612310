
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/UserProfile';
import FoodScanner from '@/components/FoodScanner';
import ScanResults from '@/components/ScanResults';
import ProductHistory from '@/components/ProductHistory';
import HealthScoreDashboard from '@/components/HealthScoreDashboard';
import OnboardingFlow from '@/components/OnboardingFlow';
import SettingsPage from '@/components/SettingsPage';
import FloatingFood from '@/components/FloatingFood';
import { UserProfile as UserProfileType, ScannedProduct } from '@/types/health';
import { analyzeFoodProduct } from '@/utils/foodAnalysis';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Search, TrendingUp, Settings, Heart } from 'lucide-react';

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ScannedProduct | null>(null);
  const [productHistory, setProductHistory] = useState<ScannedProduct[]>([]);
  const [activeTab, setActiveTab] = useState('scanner');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('healthProfile');
    const savedHistory = localStorage.getItem('productHistory');
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
    
    if (savedHistory) {
      setProductHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = (profile: UserProfileType) => {
    setUserProfile(profile);
    localStorage.setItem('healthProfile', JSON.stringify(profile));
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    toast({
      title: "Welcome to HealthScan! 🎉",
      description: "Your profile is set up. Start scanning for healthier choices!",
    });
  };

  // Skip onboarding
  const handleSkipOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  // Handle profile updates from settings
  const handleProfileUpdate = (profile: UserProfileType) => {
    setUserProfile(profile);
    localStorage.setItem('healthProfile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your health profile has been updated successfully.",
    });
  };

  // Handle image capture and analysis
  const handleImageCaptured = async (imageData: string) => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your health profile first.",
        variant: "destructive"
      });
      setActiveTab('settings');
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

  if (showOnboarding) {
    return (
      <>
        <FloatingFood />
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      </>
    );
  }

  return (
    <>
      <FloatingFood />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 vegetable-outline-bg">
        {/* Minimalistic Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 slide-in-up">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center float-bounce">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">HealthScan</h1>
                  <p className="text-sm text-gray-500">Smart nutrition for life</p>
                </div>
              </div>
              {userProfile && (
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100 slide-in-right">
                  <p className="text-sm font-medium text-gray-900">{userProfile.weight} {userProfile.weightUnit}</p>
                  <p className="text-xs text-green-600">
                    {userProfile.healthConditions.length + userProfile.allergies.length} conditions tracked
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/70 backdrop-blur-sm border border-gray-200 p-1 rounded-2xl shadow-sm">
              <TabsTrigger value="scanner" className="rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
                <Camera className="h-4 w-4 mr-2" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="health-score" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
                <TrendingUp className="h-4 w-4 mr-2" />
                Score
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
                <Search className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="results" className="rounded-xl" disabled={!currentProduct}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="slide-in-up">
              {isAnalyzing ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-bounce">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your food...</h3>
                  <p className="text-gray-500">Getting personalized health insights</p>
                </div>
              ) : (
                <FoodScanner 
                  onImageCaptured={handleImageCaptured} 
                  userProfile={userProfile}
                  productHistory={productHistory}
                />
              )}
            </TabsContent>

            <TabsContent value="health-score" className="slide-in-up">
              {!userProfile ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Set up your health profile for personalized insights
                  </p>
                  <Button onClick={() => setActiveTab('settings')} className="primary-button">
                    Get Started
                  </Button>
                </div>
              ) : (
                <HealthScoreDashboard 
                  scannedProducts={productHistory}
                  userProfile={userProfile}
                />
              )}
            </TabsContent>

            <TabsContent value="history" className="slide-in-up">
              <ProductHistory 
                products={productHistory}
                onProductSelect={handleProductSelect}
                onClearHistory={handleClearHistory}
              />
            </TabsContent>

            <TabsContent value="settings" className="slide-in-up">
              <SettingsPage 
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            </TabsContent>

            <TabsContent value="results" className="slide-in-up">
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
      </div>
    </>
  );
};

export default Index;
