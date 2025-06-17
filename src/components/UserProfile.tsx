
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

interface UserProfileProps {
  onProfileSaved: (profile: UserProfileType) => void;
  existingProfile?: UserProfileType | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ onProfileSaved, existingProfile }) => {
  const [weight, setWeight] = useState(existingProfile?.weight || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(existingProfile?.weightUnit || 'kg');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(existingProfile?.healthConditions || []);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(existingProfile?.allergies || []);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(existingProfile?.dietaryRestrictions || []);
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

  const handleSave = () => {
    if (!weight || Number(weight) <= 0) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight.",
        variant: "destructive"
      });
      return;
    }

    const profile: UserProfileType = {
      id: existingProfile?.id || Date.now().toString(),
      weight: Number(weight),
      weightUnit,
      healthConditions: selectedConditions,
      allergies: selectedAllergies,
      dietaryRestrictions: selectedRestrictions,
      createdAt: existingProfile?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onProfileSaved(profile);
    toast({
      title: "Profile Saved",
      description: "Your health profile has been updated successfully.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700">Health Profile</CardTitle>
          <CardDescription>
            Create your personalized health profile to get accurate food safety recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight Section */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-base font-medium">Weight</Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1"
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
          </div>

          {/* Health Conditions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Health Conditions</Label>
            <div className="grid grid-cols-2 gap-2">
              {HEALTH_CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => handleConditionToggle(condition)}
                  />
                  <Label htmlFor={condition} className="text-sm cursor-pointer">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
            {selectedConditions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="bg-red-100 text-red-800">
                    {condition}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Food Allergies</Label>
            <div className="grid grid-cols-2 gap-2">
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
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedAllergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Dietary Restrictions</Label>
            <div className="grid grid-cols-2 gap-2">
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
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedRestrictions.map((restriction) => (
                  <Badge key={restriction} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {restriction}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Save Health Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
