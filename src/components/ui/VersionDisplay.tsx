import { useState } from 'react';
import { getVersionInfo, getVersionWithEnv, isProduction } from '../../utils/version';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface VersionDisplayProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'inline';
  variant?: 'minimal' | 'detailed' | 'badge';
  className?: string;
}

const VersionDisplay = ({ 
  position = 'bottom-right', 
  variant = 'minimal',
  className = '' 
}: VersionDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const versionInfo = getVersionInfo();
  const versionWithEnv = getVersionWithEnv();

  const positionClasses = {
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'inline': ''
  };

  const renderMinimal = () => (
    <motion.div 
      className={`text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer ${positionClasses[position]} ${className}`}
      onClick={() => setShowDetails(!showDetails)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {versionWithEnv}
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-[200px]"
          >
            <div className="space-y-1">
              <div className="font-semibold text-green-400">LeafIQ v{versionInfo.version}</div>
              <div>Environment: {versionInfo.environment}</div>
              <div>Build: {new Date(versionInfo.buildDate).toLocaleDateString()}</div>
              {!isProduction() && (
                <div className="text-yellow-400">Development Mode</div>
              )}
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderBadge = () => (
    <motion.div 
      className={`inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200 cursor-pointer ${positionClasses[position]} ${className}`}
      onClick={() => setShowDetails(!showDetails)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Info size={12} />
      v{versionInfo.version}
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 left-0 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-[200px]"
          >
            <div className="space-y-1">
              <div className="font-semibold text-green-400">LeafIQ</div>
              <div>Version: {versionInfo.version}</div>
              <div>Environment: {versionInfo.environment}</div>
              <div>Build: {new Date(versionInfo.buildDate).toLocaleDateString()}</div>
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderDetailed = () => (
    <div className={`text-sm text-gray-500 space-y-1 ${positionClasses[position]} ${className}`}>
      <div className="font-medium text-gray-700">LeafIQ v{versionInfo.version}</div>
      <div className="text-xs">
        <div>Environment: {versionInfo.environment}</div>
        <div>Build: {new Date(versionInfo.buildDate).toLocaleDateString()}</div>
      </div>
    </div>
  );

  switch (variant) {
    case 'badge':
      return renderBadge();
    case 'detailed':
      return renderDetailed();
    default:
      return renderMinimal();
  }
};

export default VersionDisplay; 