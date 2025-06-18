
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
              size={24} 
              className="text-green-300 opacity-30" 
            />
          </div>
        );
      })}
    </>
  );
};

export default FloatingFood;
