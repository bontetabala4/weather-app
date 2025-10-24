import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/forecast', label: 'Prévisions' },
    { path: '/favorites', label: 'Favoris' },
  ];

  return (
    <nav className="flex justify-center mb-8">
      <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative px-6 py-2 rounded-full transition-colors text-white hover:text-white/80"
          >
            {location.pathname === item.path && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-white/20 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;