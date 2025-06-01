import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Atom, 
  Bot, 
  Package, 
  Users, 
  BookOpen, 
  BarChart3,
  Crown 
} from 'lucide-react';
import { useStaffModeStore, StaffMode, STAFF_MODES } from '../../stores/staffModeStore';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';

// Icon mapping
const iconMap = {
  Search,
  Atom,
  Bot,
  Package,
  Users,
  BookOpen,
  BarChart3,
};

interface StaffModeSelectorProps {
  className?: string;
}

export const StaffModeSelector: React.FC<StaffModeSelectorProps> = ({ 
  className = '' 
}) => {
  const { activeMode, setActiveMode, getAvailableModes } = useStaffModeStore();
  const { isAdmin } = useSimpleAuthStore();
  
  const availableModes = getAvailableModes(isAdmin);

  const handleModeChange = (mode: StaffMode) => {
    setActiveMode(mode);
  };

  return (
    <div className={`${className}`}>
      {/* Desktop: Horizontal tabs */}
      <div className="hidden md:flex bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-200">
        <div className="flex space-x-1 w-full">
          {availableModes.map((modeConfig) => {
            const IconComponent = iconMap[modeConfig.icon as keyof typeof iconMap];
            const isActive = activeMode === modeConfig.id;
            
            return (
              <motion.button
                key={modeConfig.id}
                onClick={() => handleModeChange(modeConfig.id)}
                className={`
                  relative flex flex-col items-center justify-center px-4 py-3 rounded-xl
                  transition-all duration-200 flex-1 min-w-0
                  ${isActive 
                    ? `${modeConfig.bgColor} ${modeConfig.color} shadow-sm border ${modeConfig.borderColor}` 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Switch to ${modeConfig.name}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 ${modeConfig.bgColor} rounded-xl border ${modeConfig.borderColor}`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    {IconComponent && <IconComponent size={18} />}
                    {modeConfig.requiresAdmin && (
                      <Crown size={12} className="text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium truncate">
                    {modeConfig.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile: Horizontal scrollable tabs */}
      <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-200">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
          {availableModes.map((modeConfig) => {
            const IconComponent = iconMap[modeConfig.icon as keyof typeof iconMap];
            const isActive = activeMode === modeConfig.id;
            
            return (
              <motion.button
                key={modeConfig.id}
                onClick={() => handleModeChange(modeConfig.id)}
                className={`
                  relative flex flex-col items-center justify-center px-3 py-2 rounded-xl
                  transition-all duration-200 flex-shrink-0 min-w-[80px]
                  ${isActive 
                    ? `${modeConfig.bgColor} ${modeConfig.color} shadow-sm border ${modeConfig.borderColor}` 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Switch to ${modeConfig.name}`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    {IconComponent && <IconComponent size={16} />}
                    {modeConfig.requiresAdmin && (
                      <Crown size={10} className="text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {modeConfig.name.split(' ').map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mode description tooltip */}
      <div className="mt-2 text-center">
        <motion.p 
          key={activeMode}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600"
        >
          {STAFF_MODES.find(m => m.id === activeMode)?.description}
        </motion.p>
      </div>
    </div>
  );
}; 