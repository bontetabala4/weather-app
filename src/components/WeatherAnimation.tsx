import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WeatherAnimationProps {
  condition: string;
  conditionCode: number;
  isDay: boolean;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ conditionCode, isDay }) => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, delay: number, size: number}>>([]);

  useEffect(() => {
    const newParticles = [];
    let particleCount = 0;
    let particleSize = 0;

    if (conditionCode >= 200 && conditionCode < 600) {
      particleCount = 100;
      particleSize = 2;
    } else if (conditionCode >= 600 && conditionCode < 700) {
      particleCount = 50;
      particleSize = 4;
    } else if (conditionCode >= 700 && conditionCode < 800) {
      particleCount = 30;
      particleSize = 8;
    }

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        size: particleSize + Math.random() * 3
      });
    }
    setParticles(newParticles);
  }, [conditionCode]);

  const getAnimation = () => {
    if (conditionCode >= 200 && conditionCode < 300) {
      return { emoji: '⚡', type: 'thunder' };
    } else if (conditionCode >= 300 && conditionCode < 600) {
      return { emoji: '🌧️', type: 'rain' };
    } else if (conditionCode >= 600 && conditionCode < 700) {
      return { emoji: '❄️', type: 'snow' };
    } else if (conditionCode === 800) {
      return { emoji: isDay ? '☀️' : '🌙', type: 'clear' };
    } else if (conditionCode > 800) {
      return { emoji: '☁️', type: 'clouds' };
    } else if (conditionCode >= 700 && conditionCode < 800) {
      return { emoji: '🌫️', type: 'fog' };
    }
    return { emoji: '🌈', type: 'default' };
  };

  const animation = getAnimation();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 transition-all duration-1000 ${
        animation.type === 'clear' && isDay ? ' from-sky-400 to-blue-500' :
        animation.type === 'clear' && !isDay ? ' from-indigo-900 to-purple-900' :
        animation.type === 'rain' || animation.type === 'thunder' ? ' from-gray-600 to-gray-800' :
        animation.type === 'snow' ? ' from-blue-200 to-blue-400' :
        animation.type === 'fog' ? ' from-gray-400 to-gray-600' :
        ' from-blue-400 to-blue-600'
      }`} />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${
            animation.type === 'rain' ? 'bg-blue-300' :
            animation.type === 'snow' ? 'bg-white' :
            animation.type === 'fog' ? 'bg-gray-300' : 'bg-yellow-300'
          } rounded-full`}
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            top: -10,
          }}
          animate={{
            y: [0, window.innerHeight],
            opacity: [0, 1, 0],
            x: animation.type === 'rain' ? [0, particle.size * 2] : 
                animation.type === 'snow' ? [0, Math.sin(particle.id) * 50] : 0
          }}
          transition={{
            duration: animation.type === 'rain' ? 1 : 3,
            repeat: Infinity,
            delay: particle.delay,
            ease: animation.type === 'rain' ? 'linear' : 'easeInOut'
          }}
        />
      ))}

      {animation.type === 'clear' && isDay && (
        <motion.div
          className="absolute top-10 right-10 text-6xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }} >
          ☀️
        </motion.div>
      )}

      {animation.type === 'clear' && !isDay && (
        <motion.div
          className="absolute top-10 right-10 text-6xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌙
        </motion.div>
      )}

      {animation.type === 'thunder' && (
        <motion.div
          className="absolute top-1/2 left-1/2 text-8xl"
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          ⚡
        </motion.div>
      )}
    </div>
  );
};

export default WeatherAnimation;