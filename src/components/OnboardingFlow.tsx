
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile as UserProfileType, HEALTH_CONDITIONS, COMMON_ALLERGIES, DIETARY_RESTRICTIONS } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { Heart, Sparkles, ArrowRight, Scale, Activity, Shield } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfileType) => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleRestrictionToggle = (restriction: string) => {
    setSelectedRestrictions(prev => 
      prev.includes(restriction) 
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleNext = () => {
    if (step === 1 && (!weight || Number(weight) <= 0)) {
      toast({
        title: "Weight Required",
        description: "Please enter your weight to continue.",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = () => {
    const profile: UserProfileType = {
      id: Date.now().toString(),
      weight: Number(weight),
      weightUnit,
      healthConditions: selectedConditions,
      allergies: selectedAllergies,
      dietaryRestrictions: selectedRestrictions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8 slide-in-up">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-bounce soft-glow">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to HealthScan
          </h1>
          <p className="text-gray-600">Let's personalize your nutrition journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  num <= step 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-md' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Weight */}
        {step === 1 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg slide-in-up">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Your Weight</CardTitle>
              <CardDescription className="text-gray-600">
                Help us calculate your nutritional needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 text-lg border-gray-200 focus:border-green-500 rounded-xl"
                />
                <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                  <SelectTrigger className="w-20 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onSkip} className="flex-1 minimal-button">
                  Skip Setup
                </Button>
                <Button onClick={handleNext} className="flex-1 primary-button">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Health Conditions */}
        {step === 2 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg slide-in-up">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Health Conditions</CardTitle>
              <CardDescription className="text-gray-600">
                Select any conditions we should consider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {HEALTH_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={condition}
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      className="border-gray-300"
                    />
                    <Label htmlFor={condition} className="flex-1 cursor-pointer text-gray-700 text-sm">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="bg-red-50 text-red-700 border border-red-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 minimal-button">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 primary-button">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg slide-in-up">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Food Allergies</CardTitle>
              <CardDescription className="text-gray-600">
                Help us keep you safe from allergens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {COMMON_ALLERGIES.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={selectedAllergies.includes(allergy)}
                      onCheckedChange={() => handleAllergyToggle(allergy)}
                      className="border-gray-300"
                    />
                    <Label htmlFor={allergy} className="text-sm cursor-pointer text-gray-700">
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedAllergies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedAllergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="bg-orange-50 text-orange-700 border border-orange-200">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 minimal-button">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 primary-button">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Dietary Preferences */}
        {step === 4 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg slide-in-up">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-900">Dietary Goals</CardTitle>
              <CardDescription className="text-gray-600">
                Choose your nutritional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={selectedRestrictions.includes(restriction)}
                      onCheckedChange={() => handleRestrictionToggle(restriction)}
                      className="border-gray-300"
                    />
                    <Label htmlFor={restriction} className="text-sm cursor-pointer text-gray-700">
                      {restriction}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="outline" className="bg-green-50 text-green-700 border border-green-200">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 minimal-button">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1 primary-button">
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onSkip} className="text-gray-500 hover:text-gray-700">
            Skip and explore the app
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
