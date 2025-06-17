
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile as UserProfileType, HEALTH_CONDITIONS, COMMON_ALLERGIES, DIETARY_RESTRICTIONS } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { User, RefreshCw, Calendar, Save, AlertCircle } from 'lucide-react';

interface SettingsPageProps {
  userProfile?: UserProfileType | null;
  onProfileUpdate: (profile: UserProfileType) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ userProfile, onProfileUpdate }) => {
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(userProfile?.weightUnit || 'kg');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(userProfile?.healthConditions || []);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(userProfile?.allergies || []);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(userProfile?.dietaryRestrictions || []);
  const [showReassessment, setShowReassessment] = useState(false);
  const { toast } = useToast();

  // Check if 30 days have passed since last update
  useEffect(() => {
    if (userProfile?.updatedAt) {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(userProfile.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceUpdate >= 30) {
        setShowReassessment(true);
      }
    }
  }, [userProfile]);

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
      id: userProfile?.id || Date.now().toString(),
      weight: Number(weight),
      weightUnit,
      healthConditions: selectedConditions,
      allergies: selectedAllergies,
      dietaryRestrictions: selectedRestrictions,
      createdAt: userProfile?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onProfileUpdate(profile);
    setShowReassessment(false);
  };

  const handleReassessment = () => {
    setShowReassessment(false);
    toast({
      title: "Profile Reassessment",
      description: "Please review and update your health information below.",
    });
  };

  if (!userProfile) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-2 mx-auto">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle>Create Your Health Profile</CardTitle>
            <CardDescription>
              Set up your personalized health profile to start scanning foods safely
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You haven't set up your health profile yet. This is needed to provide personalized food analysis.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Reassessment Reminder */}
      {showReassessment && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800">Time for a Health Check-in!</h4>
                <p className="text-sm text-amber-700 mt-1">
                  It's been 30+ days since your last profile update. Your health goals may have changed.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={handleReassessment}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Review Profile
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowReassessment(false)}
                  >
                    Remind Me Later
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Health Profile Settings
          </CardTitle>
          <CardDescription>
            Update your health information to get accurate food analysis
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
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Profile Created:</span>
              <p className="font-medium">{new Date(userProfile.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-medium">{new Date(userProfile.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Conditions Tracked:</span>
              <p className="font-medium">{userProfile.healthConditions.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Allergies Monitored:</span>
              <p className="font-medium">{userProfile.allergies.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
