import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Atom,
  Package,
  Users,
  BookOpen,
  BarChart3,
  Crown,
} from "lucide-react";
import {
  useStaffModeStore,
  StaffMode,
  STAFF_MODES,
} from "../../stores/staffModeStore";
import { useSimpleAuthStore } from "../../stores/simpleAuthStore";

// Icon mapping
const iconMap = {
  Search,
  Atom,
  BudBuddy: () => (
    <img
      src="/budbuddy.png"
      alt="Bud Buddy"
      className="w-4 h-4 object-contain"
    />
  ),
  Package,
  Users,
  BookOpen,
  BarChart3,
};

interface StaffModeSelectorProps {
  className?: string;
}

export const StaffModeSelector: React.FC<StaffModeSelectorProps> = ({
  className = "",
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
      <div className="hidden md:flex bg-white bg-opacity-95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-gray-100">
        <div className="flex space-x-1 w-full">
          {availableModes.map((modeConfig) => {
            const IconComponent =
              iconMap[modeConfig.icon as keyof typeof iconMap];
            const isActive = activeMode === modeConfig.id;

            return (
              <motion.button
                key={modeConfig.id}
                onClick={() => handleModeChange(modeConfig.id)}
                className={`
                  relative flex flex-col items-center justify-center px-3 py-2 rounded-lg
                  transition-all duration-300 flex-1 min-w-0 hover:shadow-md
                  ${
                    isActive
                      ? `${modeConfig.bgColor} ${modeConfig.color} shadow-lg border ${modeConfig.borderColor}`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-transparent"
                  }
                `}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`Switch to ${modeConfig.name}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 ${modeConfig.bgColor} rounded-lg border ${modeConfig.borderColor}`}
                    initial={{ borderRadius: 8 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    {IconComponent && <IconComponent />}
                    {modeConfig.requiresAdmin && (
                      <Crown size={10} className="text-yellow-500" />
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
      <div className="md:hidden bg-white bg-opacity-95 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-gray-100">
        <div className="flex space-x-1 overflow-x-auto pb-1 px-1">
          {availableModes.map((modeConfig) => {
            const IconComponent =
              iconMap[modeConfig.icon as keyof typeof iconMap];
            const isActive = activeMode === modeConfig.id;

            return (
              <motion.button
                key={modeConfig.id}
                onClick={() => handleModeChange(modeConfig.id)}
                className={`
                  relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg
                  transition-all duration-300 flex-shrink-0 min-w-[75px] shadow-sm
                  ${
                    isActive
                      ? `${modeConfig.bgColor} ${modeConfig.color} shadow-md border ${modeConfig.borderColor}`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-transparent"
                  }
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Switch to ${modeConfig.name}`}
              >
                <div className="flex flex-col items-center space-y-0.5">
                  <div className="flex items-center space-x-1">
                    {IconComponent && <IconComponent />}
                    {modeConfig.requiresAdmin && (
                      <Crown size={10} className="text-yellow-500" />
                    )}
                  </div>
                  <span className="text-[0.65rem] font-medium text-center leading-tight">
                    {modeConfig.name.split(" ").map((word, i) => (
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
      <div className="mt-2 text-center bg-white bg-opacity-70 backdrop-blur-sm py-1.5 px-3 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <motion.p
          key={activeMode}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-700 font-medium"
        >
          {STAFF_MODES.find((m) => m.id === activeMode)?.description}
        </motion.p>
      </div>
    </div>
  );
};