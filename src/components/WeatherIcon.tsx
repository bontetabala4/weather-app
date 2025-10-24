import React from 'react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, size = 48, className = '' }) => {
  const getIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('soleil') || lowerCondition.includes('ensoleillé') || lowerCondition.includes('clair')) {
      return '☀️';
    } else if (lowerCondition.includes('nuage') || lowerCondition.includes('couvert')) {
      return '☁️';
    } else if (lowerCondition.includes('pluie')) {
      return '🌧️';
    } else if (lowerCondition.includes('neige')) {
      return '❄️';
    } else if (lowerCondition.includes('orage')) {
      return '⛈️';
    } else if (lowerCondition.includes('brume') || lowerCondition.includes('brouillard')) {
      return '🌫️';
    } else if (lowerCondition.includes('partiellement')) {
      return '⛅';
    } else {
      return '🌈';
    }
  };

  return (
    <span 
      className={`${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {getIcon(condition)}
    </span>
  );
};

export default WeatherIcon;