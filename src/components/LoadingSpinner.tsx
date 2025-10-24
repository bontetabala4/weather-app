import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/useApp';

const LoadingSpinner: React.FC = () => {
  const { t } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-center items-center py-12 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
      />
      <p className="text-white/70 text-lg">{t('loading')}</p>
    </motion.div>
  );
};

export default LoadingSpinner;