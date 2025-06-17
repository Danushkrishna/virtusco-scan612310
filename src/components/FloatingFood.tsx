
import React from 'react';
import { Apple, Banana, Cherry, Grape, Carrot, Salad } from 'lucide-react';

const foodIcons = [Apple, Banana, Cherry, Grape, Carrot, Salad];

const FloatingFood: React.FC = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => {
        const IconComponent = foodIcons[Math.floor(Math.random() * foodIcons.length)];
        return (
          <div key={index} className={`floating-food floating-food-${index}`}>
            <IconComponent 
              size={32} 
              className="text-green-400 opacity-60 drop-shadow-lg" 
            />
          </div>
        );
      })}
    </>
  );
};

export default FloatingFood;
