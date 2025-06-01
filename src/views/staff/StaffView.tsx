import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';
import { useProductsStore } from '../../stores/productsStore';
import { useStaffModeStore } from '../../stores/staffModeStore';
import { StaffHeader } from '../../components/staff/StaffHeader';
import { StaffModeSelector } from '../../components/staff/StaffModeSelector';
import { ProductSearchMode } from '../../components/staff/modes/ProductSearchMode';
import { TerpeneExplorerMode } from '../../components/staff/modes/TerpeneExplorerMode';
import { Button } from '../../components/ui/button';
import { Bot, Package, Users, BookOpen, BarChart3, Construction } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductWithVariant } from '../../types';

// Placeholder components for modes not yet implemented
const PlaceholderMode = ({ mode }: { mode: string }) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center">
    <Construction size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-2xl font-semibold mb-4">{mode} Mode</h3>
    <p className="text-gray-600 mb-6">
      This mode is coming soon! Check back later for powerful new features.
    </p>
    <Button variant="outline">
      Request Early Access
    </Button>
  </div>
);

const StaffView = () => {
  const { activeMode, addNotification } = useStaffModeStore();

  // Add a welcome notification when component mounts
  useEffect(() => {
    addNotification({
      type: 'info',
      message: 'Welcome to the enhanced staff workstation! Explore the new modes to boost your productivity.'
    });
  }, [addNotification]);

  const renderActiveMode = () => {
    switch (activeMode) {
      case 'search':
        return <ProductSearchMode />;
      case 'terpenes':
        return <TerpeneExplorerMode />;
      case 'assistant':
        return <PlaceholderMode mode="AI Assistant" />;
      case 'inventory':
        return <PlaceholderMode mode="Inventory Dashboard" />;
      case 'consultation':
        return <PlaceholderMode mode="Customer Consultation Hub" />;
      case 'training':
        return <PlaceholderMode mode="Training & Knowledge Hub" />;
      case 'analytics':
        return <PlaceholderMode mode="Performance Analytics" />;
      default:
        return <ProductSearchMode />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <StaffHeader />
      
      <main className="container mx-auto px-4 py-6">
        {/* Mode Selector */}
        <div className="mb-6">
          <StaffModeSelector />
        </div>
        
        {/* Active Mode Content */}
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveMode()}
        </motion.div>
      </main>
    </div>
  );
};

export default StaffView;