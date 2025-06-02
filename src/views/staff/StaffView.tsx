import { useState, useEffect } from "react";
import { useSimpleAuthStore } from "../../stores/simpleAuthStore";
import { useProductsStore } from "../../stores/productsStore";
import { useStaffModeStore } from "../../stores/staffModeStore";
import { StaffHeader } from "../../components/staff/StaffHeader";
import { StaffModeSelector } from "../../components/staff/StaffModeSelector";
import { ProductSearchMode } from "../../components/staff/modes/ProductSearchMode";
import { TerpeneExplorerMode } from "../../components/staff/modes/TerpeneExplorerMode";
import { Button } from "../../components/ui/button";
import {
  Bot,
  Package,
  Users,
  BookOpen,
  BarChart3,
  Construction,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductWithVariant } from "../../types";

// Placeholder components for modes not yet implemented
const PlaceholderMode = ({ mode }: { mode: string }) => (
  <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center">
    <Construction size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-2xl font-semibold mb-4">{mode} Mode</h3>
    <p className="text-gray-600 mb-6">
      This mode is coming soon! Check back later for powerful new features.
    </p>
    <Button variant="outline">Request Early Access</Button>
  </div>
);

// Bud AI Budtender Component
const BudAIBudtenderMode = () => (
  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
        <img src="/budbuddy.png" alt="Bud" className="h-8 w-8 object-contain" />
      </div>
      <h2 className="text-xl font-semibold">Bud AI Budtender</h2>
    </div>

    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <p className="text-gray-700">
        Hello! I'm Bud, your AI budtender assistant. I can help answer cannabis
        questions, provide product information, or assist with customer
        consultations. What would you like help with today?
      </p>
    </div>

    <div className="space-y-4">
      <textarea
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32"
        placeholder="Ask Bud a question about cannabis, products, or customer recommendations..."
      ></textarea>

      <div className="flex justify-end">
        <Button>Ask Bud</Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm">
          How do terpenes work?
        </Button>
        <Button variant="outline" size="sm">
          Explain THC vs CBD
        </Button>
        <Button variant="outline" size="sm">
          Help me recommend for anxiety
        </Button>
        <Button variant="outline" size="sm">
          What's our most popular indica?
        </Button>
      </div>
    </div>
  </div>
);

const StaffView = () => {
  const { activeMode, addNotification } = useStaffModeStore();
  const { organizationId, isAuthenticated, dispensaryName } =
    useSimpleAuthStore();
  const { fetchProducts, isLoading, error, productsWithVariants } =
    useProductsStore();

  // Debug authentication state
  useEffect(() => {
    console.log("🔍 StaffView - Auth state:", {
      isAuthenticated,
      organizationId,
      dispensaryName,
      productsCount: productsWithVariants.length,
    });
  }, [
    isAuthenticated,
    organizationId,
    dispensaryName,
    productsWithVariants.length,
  ]);

  // Ensure products are loaded when authentication is ready
  useEffect(() => {
    if (isAuthenticated && organizationId) {
      console.log(
        "✅ StaffView - Auth ready, fetching products for org:",
        organizationId,
      );
      fetchProducts();
    } else if (isAuthenticated && !organizationId) {
      console.error("❌ StaffView - Authenticated but no organizationId found");
      addNotification({
        type: "error",
        message: "Organization not found. Please try logging in again.",
      });
    }
  }, [isAuthenticated, organizationId, fetchProducts, addNotification]);

  // Add a welcome notification when component mounts
  useEffect(() => {
    addNotification({
      type: "info",
      message:
        "Welcome to the enhanced staff workstation! Explore the new modes to boost your productivity.",
    });
  }, [addNotification]);

  // Show loading state if authentication or products are loading
  if (!isAuthenticated || !organizationId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff workspace...</p>
        </div>
      </div>
    );
  }

  const renderActiveMode = () => {
    switch (activeMode) {
      case "search":
        return <ProductSearchMode />;
      case "terpenes":
        return <TerpeneExplorerMode />;
      case "assistant":
        return <BudAIBudtenderMode />;
      case "inventory":
        return <PlaceholderMode mode="Inventory Dashboard" />;
      case "consultation":
        return <PlaceholderMode mode="Customer Consultation Hub" />;
      case "training":
        return <PlaceholderMode mode="Training & Knowledge Hub" />;
      case "analytics":
        return <PlaceholderMode mode="Performance Analytics" />;
      default:
        return <ProductSearchMode />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <StaffHeader />

      <main className="container mx-auto px-4 py-16 flex-1 flex flex-col">
        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
            <strong>Debug:</strong> Org: {organizationId} | Products:{" "}
            {productsWithVariants.length} | Loading: {isLoading ? "Yes" : "No"}
            {error && <span className="text-red-600"> | Error: {error}</span>}
          </div>
        )}

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
