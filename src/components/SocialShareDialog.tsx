
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Achievement, SocialShareData } from '@/types/healthScore';
import { Share2, Facebook, Twitter, Instagram, Copy, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  streak: number;
  achievements: Achievement[];
}

const SocialShareDialog: React.FC<SocialShareDialogProps> = ({
  isOpen,
  onClose,
  score,
  streak,
  achievements
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'twitter' | 'instagram' | 'direct' | null>(null);
  const { toast } = useToast();

  const generateShareMessage = (platform: string) => {
    const messages = {
      facebook: `🌟 Just hit a ${score}/100 health score on HealthScan! 💪 On a ${streak}-day healthy eating streak! Join me in making better food choices! #HealthyEating #HealthScan`,
      twitter: `🎯 Health Score: ${score}/100\n🔥 Streak: ${streak} days\n💚 Making smarter food choices with @HealthScan! #HealthyLiving`,
      instagram: `✨ Health journey update! Currently at ${score}/100 with a ${streak}-day streak of healthy choices! 🥗💪 Who's joining me on this wellness adventure? #HealthScan #WellnessJourney #HealthyChoices`,
      direct: `Hey! I've been using HealthScan to track my food choices and I'm at ${score}/100 with a ${streak}-day streak! You should try it too - it's really helping me eat healthier! 🌱`
    };
    return messages[platform as keyof typeof messages] || messages.direct;
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'instagram' | 'direct') => {
    const message = generateShareMessage(platform);
    
    if (platform === 'direct') {
      // Copy to clipboard for direct sharing
      navigator.clipboard.writeText(message);
      toast({
        title: "Copied to clipboard!",
        description: "Share this message with your friends.",
      });
    } else {
      // For social platforms, you would typically use their APIs or sharing URLs
      // For demo purposes, we'll just copy to clipboard
      const shareUrl = 'https://healthscan.app'; // Your app URL
      const fullMessage = `${message}\n\n${shareUrl}`;
      
      navigator.clipboard.writeText(fullMessage);
      toast({
        title: `Ready to share on ${platform}!`,
        description: "Message copied to clipboard. Paste it on your social media.",
      });
    }
    
    setSelectedPlatform(platform);
    setTimeout(() => setSelectedPlatform(null), 2000);
  };

  const handleCopyLink = () => {
    const shareableLink = `https://healthscan.app/share?score=${score}&streak=${streak}`;
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link copied!",
      description: "Share this link with anyone to show your progress.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share Your Progress</span>
          </DialogTitle>
          <DialogDescription>
            Show off your healthy eating journey to friends and family!
          </DialogDescription>
        </DialogHeader>

        {/* Preview Card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{score}/100</div>
              <div className="text-emerald-100 mb-3">Health Score</div>
              <div className="flex justify-center items-center space-x-4 text-sm">
                <div>
                  <span className="text-emerald-200">Streak: </span>
                  <span className="font-semibold">{streak} days</span>
                </div>
                {achievements.length > 0 && (
                  <div>
                    <span className="text-emerald-200">Achievements: </span>
                    <span className="font-semibold">{achievements.length}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            disabled={selectedPlatform === 'facebook'}
            className="flex items-center space-x-2"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            disabled={selectedPlatform === 'twitter'}
            className="flex items-center space-x-2"
          >
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleShare('instagram')}
            disabled={selectedPlatform === 'instagram'}
            className="flex items-center space-x-2"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleShare('direct')}
            disabled={selectedPlatform === 'direct'}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </Button>
        </div>

        {/* Copy Link */}
        <div className="pt-4 border-t">
          <Button
            variant="secondary"
            onClick={handleCopyLink}
            className="w-full flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Shareable Link</span>
          </Button>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              {achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl">{achievement.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareDialog;
