
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
import { Camera, User, Search, TrendingUp, Settings } from 'lucide-react';

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
      <div className="min-h-screen relative overflow-hidden">
        {/* Futuristic Header */}
        <div className="glass-card border-b border-white/20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  HealthScan AI
                </h1>
                <p className="text-sm text-white/70">Next-gen food intelligence</p>
              </div>
              {userProfile && (
                <div className="text-right glass-card px-4 py-2 rounded-xl">
                  <p className="text-sm font-medium text-white">{userProfile.weight} {userProfile.weightUnit}</p>
                  <p className="text-xs text-green-400">
                    {userProfile.healthConditions.length + userProfile.allergies.length} conditions monitored
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-4 relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 glass-card border border-white/20">
              <TabsTrigger value="scanner" className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                <Camera className="h-4 w-4" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="health-score" className="flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <TrendingUp className="h-4 w-4" />
                Score
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Search className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2" disabled={!currentProduct}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              {isAnalyzing ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-white mb-2">AI Analysis in Progress...</h3>
                  <p className="text-white/70">Scanning molecular composition</p>
                </div>
              ) : (
                <FoodScanner 
                  onImageCaptured={handleImageCaptured} 
                  userProfile={userProfile}
                  productHistory={productHistory}
                />
              )}
            </TabsContent>

            <TabsContent value="health-score">
              {!userProfile ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Initialize Health Profile
                  </h3>
                  <p className="text-white/70 mb-4">
                    Configure your bio-metrics for personalized analysis.
                  </p>
                  <Button onClick={() => setActiveTab('settings')} className="holographic text-white font-semibold">
                    Initialize Profile
                  </Button>
                </div>
              ) : (
                <HealthScoreDashboard 
                  scannedProducts={productHistory}
                  userProfile={userProfile}
                />
              )}
            </TabsContent>

            <TabsContent value="history">
              <ProductHistory 
                products={productHistory}
                onProductSelect={handleProductSelect}
                onClearHistory={handleClearHistory}
              />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPage 
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
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
      </div>
    </>
  );
};

export default Index;
