import React from 'react';
import { motion } from 'framer-motion';
import ZapCard from '@/components/organisms/ZapCard';

const ZapList = ({ zaps = [], view = 'grid', onZapAction, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (view === 'list') {
    return (
      <motion.div
        className={`space-y-4 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {zaps.map((zap) => (
          <motion.div key={zap.Id} variants={itemVariants}>
            <ZapCard zap={zap} onAction={onZapAction} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {zaps.map((zap) => (
        <motion.div key={zap.Id} variants={itemVariants}>
          <ZapCard zap={zap} onAction={onZapAction} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ZapList;