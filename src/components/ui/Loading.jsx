import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'cards', count = 6, className = '' }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: {
      backgroundPosition: 'calc(200px + 100%) 0',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const CardSkeleton = () => (
    <motion.div
      className="card p-6"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
              style={{
                width: '60%',
                backgroundSize: '200px 100%'
              }}
            />
            <div 
              className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
              style={{ backgroundSize: '200px 100%' }}
            />
          </div>
          <div 
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-3"
            style={{
              width: '40%',
              backgroundSize: '200px 100%'
            }}
          />
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200px 100%' }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
              style={{
                width: '80px',
                backgroundSize: '200px 100%'
              }}
            />
            <div 
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
              style={{
                width: '60px',
                backgroundSize: '200px 100%'
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
              style={{ backgroundSize: '200px 100%' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const ListSkeleton = () => (
    <motion.div
      className="card p-4"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div 
            className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
            style={{ backgroundSize: '200px 100%' }}
          />
          <div 
            className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            style={{
              width: '200px',
              backgroundSize: '200px 100%'
            }}
          />
          <div 
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            style={{
              width: '100px',
              backgroundSize: '200px 100%'
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            style={{
              width: '80px',
              backgroundSize: '200px 100%'
            }}
          />
          <div 
            className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            style={{ backgroundSize: '200px 100%' }}
          />
        </div>
      </div>
    </motion.div>
  );

  const MetricSkeleton = () => (
    <motion.div
      className="card p-6"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div 
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-2"
            style={{
              width: '60%',
              backgroundSize: '200px 100%'
            }}
          />
          <div 
            className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mb-2"
            style={{
              width: '40%',
              backgroundSize: '200px 100%'
            }}
          />
          <div 
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            style={{
              width: '50%',
              backgroundSize: '200px 100%'
            }}
          />
        </div>
        <div 
          className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl"
          style={{ backgroundSize: '200px 100%' }}
        />
      </div>
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <ListSkeleton key={i} />
            ))}
          </div>
        );
      case 'metrics':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default Loading;