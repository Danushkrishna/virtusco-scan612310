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
import { Heart, Sparkles, ArrowRight, Zap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        {/* Futuristic Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 glass-card rounded-full mb-4 neon-glow">
            <Heart className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome to HealthScan AI
          </h1>
          <p className="text-white/70">Initializing your personalized nutrition intelligence</p>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-3">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  num <= step 
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 shadow-lg shadow-green-400/50' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Weight */}
        {step === 1 && (
          <Card className="glass-card border-white/20 animate-fade-in">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 glass-card rounded-full mb-2 mx-auto neon-glow">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Bio-metric Configuration</CardTitle>
              <CardDescription className="text-white/70">
                Input your weight for optimized nutritional analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 text-lg glass-card border-white/30 text-white"
                />
                <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                  <SelectTrigger className="w-20 glass-card border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/30 text-white">
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onSkip} className="flex-1 glass-card border-white/30 text-white hover:bg-white/10">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Skip Protocol
                </Button>
                <Button onClick={handleNext} className="flex-1 holographic text-white font-semibold">
                  Initialize
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced subsequent steps with futuristic styling */}
        {step === 2 && (
          <Card className="glass-card border-white/20 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Health Matrix Configuration</CardTitle>
              <CardDescription className="text-white/70">
                Select conditions for personalized molecular analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {HEALTH_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10">
                    <Checkbox
                      id={condition}
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      className="glass-card border-white/30"
                    />
                    <Label htmlFor={condition} className="flex-1 cursor-pointer text-white/80">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedConditions.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="bg-white/10 text-green-400 border border-green-400/30">
                      {condition}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 glass-card border-white/30 text-white hover:bg-white/10">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 holographic text-white font-semibold">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keep similar enhancements for steps 3 and 4 */}
        {step === 3 && (
          <Card className="glass-card border-white/20 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Allergen Profile Configuration</CardTitle>
              <CardDescription className="text-white/70">
                Identify allergens for real-time molecular alerts
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
                      className="glass-card border-white/30"
                    />
                    <Label htmlFor={allergy} className="text-sm cursor-pointer text-white/80">
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedAllergies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedAllergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="bg-white/10 text-red-400 border border-red-400/30">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 glass-card border-white/30 text-white hover:bg-white/10">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1 holographic text-white font-semibold">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="glass-card border-white/20 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Dietary Preferences Initialization</CardTitle>
              <CardDescription className="text-white/70">
                Specify dietary goals for personalized food recommendations
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
                      className="glass-card border-white/30"
                    />
                    <Label htmlFor={restriction} className="text-sm cursor-pointer text-white/80">
                      {restriction}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="outline" className="bg-white/10 text-blue-400 border border-blue-400/30">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 glass-card border-white/30 text-white hover:bg-white/10">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1 holographic text-white font-semibold">
                  Complete Setup
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onSkip} className="text-white/50 hover:text-white/80">
            Enter without configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
