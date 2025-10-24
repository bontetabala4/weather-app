import React from 'react';
import { motion } from 'framer-motion';

const Forecast: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Prévisions détaillées</h2>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <p className="text-center py-8 text-white/70">Fonctionnalité en cours de développement...</p>
      </div>
    </motion.div>
  );
};

export default Forecast;