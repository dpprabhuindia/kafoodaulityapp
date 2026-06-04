import React from 'react';
import defaultLogoImg from '../images/karnatak-logo.png';

const KarnatakaLogo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  // Fallback to custom localStorage logo, otherwise use imported png
  const customLogo = localStorage.getItem('portalLogo');
  const emblemDataUri = customLogo || defaultLogoImg;

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <img
        src={emblemDataUri}
        alt="Karnataka Government Emblem"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default KarnatakaLogo;
