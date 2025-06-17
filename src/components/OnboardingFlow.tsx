
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
import { Heart, Sparkles, ArrowRight, Skip } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HealthScan!</h1>
          <p className="text-gray-600">Let's personalize your food scanning experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full transition-colors ${
                  num <= step ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Weight */}
        {step === 1 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>What's your weight?</CardTitle>
              <CardDescription>
                This helps us provide more accurate nutritional guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 text-lg"
                />
                <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onSkip} className="flex-1">
                  <Skip className="mr-2 h-4 w-4" />
                  Skip Setup
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Health Conditions */}
        {step === 2 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle>Any health conditions?</CardTitle>
              <CardDescription>
                Select any that apply - we'll help you avoid problematic ingredients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {HEALTH_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={condition}
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                    />
                    <Label htmlFor={condition} className="flex-1 cursor-pointer">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedConditions.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="bg-red-100 text-red-800">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle>Food allergies?</CardTitle>
              <CardDescription>
                We'll alert you to any allergens in scanned products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {COMMON_ALLERGIES.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={selectedAllergies.includes(allergy)}
                      onCheckedChange={() => handleAllergyToggle(allergy)}
                    />
                    <Label htmlFor={allergy} className="text-sm cursor-pointer">
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedAllergies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedAllergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Dietary Preferences */}
        {step === 4 && (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle>Dietary preferences?</CardTitle>
              <CardDescription>
                Select your dietary goals and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={selectedRestrictions.includes(restriction)}
                      onCheckedChange={() => handleRestrictionToggle(restriction)}
                    />
                    <Label htmlFor={restriction} className="text-sm cursor-pointer">
                      {restriction}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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
