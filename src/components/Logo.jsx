import React from 'react';

export default function Logo({ className = "text-2xl", variant = "primary" }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return 'text-white border-white/40';
      case 'dark':
        return 'text-gray-900 border-gray-900/20';
      default:
        return 'text-primary-600 border-primary-500/30';
    }
  };

  return (
    <div className={`flex items-center gap-1 font-['Yatra_One'] ${getVariantStyles()} ${className}`}>
      <span className="tracking-tighter italic lowercase">svasthya</span>
    </div>
  );
}
