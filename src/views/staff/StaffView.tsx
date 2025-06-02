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
  <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
    <Construction size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-2xl font-semibold mb-4">{mode} Mode</h3>
    <p className="text-gray-600 mb-6">
      This mode is coming soon! Check back later for powerful new features.
    </p>
    <Button variant="outline">Request Early Access</Button>
  </div>
);

// Bud AI Budtender Component
const BudAIBudtenderMode = () => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState('');

  const handleAskBud = async () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    setResponse('');
    
    // Simulate AI response with timeout
    setTimeout(() => {
      // Generate appropriate response based on question content
      let aiResponse = "I'm happy to help! ";
      
      if (question.toLowerCase().includes("terpene")) {
        aiResponse += "Terpenes are aromatic compounds found in cannabis and many other plants. They give cannabis its distinctive smell and flavor, and also contribute to the effects you feel. The most common terpenes in cannabis include myrcene (relaxing), limonene (uplifting), pinene (focusing), and caryophyllene (pain relief).";
      } else if (question.toLowerCase().includes("thc") && question.toLowerCase().includes("cbd")) {
        aiResponse += "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the 'high' sensation. CBD (cannabidiol) is non-intoxicating and often used for therapeutic benefits like anxiety and pain relief. THC binds directly to CB1 receptors in the brain, while CBD works more indirectly on the endocannabinoid system.";
      } else if (question.toLowerCase().includes("anxiety")) {
        aiResponse += "For customers seeking anxiety relief, consider recommending products with balanced THC:CBD ratios or higher CBD content. Strains rich in linalool and caryophyllene terpenes often have calming effects. Our most popular anxiety-relieving products currently in stock are Harlequin (balanced hybrid), ACDC (high-CBD), and Granddaddy Purple (relaxing indica).";
      } else if (question.toLowerCase().includes("indica")) {
        aiResponse += "Our most popular indica strains currently in stock are Northern Lights (22% THC), Granddaddy Purple (19% THC), and Blueberry Kush (24% THC). All three feature high myrcene content for deep relaxation and are consistently highly rated by our customers.";
      } else {
        aiResponse += "I can provide information about cannabis products, effects, consumption methods, and help you make recommendations to customers. Feel free to ask specific questions about strains, terpenes, or customer scenarios.";
      }
      
      setResponse(aiResponse);
      setIsSubmitting(false);
    }, 1500);
  };

  // Handle suggestion click to automatically fill and submit the question
  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    
    // Submit the question after a short delay to allow state update
    setTimeout(() => {
      setResponse('');
      setIsSubmitting(true);
      
      // Simulate AI response with timeout
      setTimeout(() => {
        // Generate appropriate response based on suggestion
        let aiResponse = "I'm happy to help! ";
        
        if (suggestion.includes("terpenes")) {
          aiResponse += "Terpenes are aromatic compounds found in cannabis and many other plants. They give cannabis its distinctive smell and flavor, and also contribute to the effects you feel. The most common terpenes in cannabis include myrcene (relaxing), limonene (uplifting), pinene (focusing), and caryophyllene (pain relief).";
        } else if (suggestion.includes("THC") && suggestion.includes("CBD")) {
          aiResponse += "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that produces the 'high' sensation. CBD (cannabidiol) is non-intoxicating and often used for therapeutic benefits like anxiety and pain relief. THC binds directly to CB1 receptors in the brain, while CBD works more indirectly on the endocannabinoid system.";
        } else if (suggestion.includes("anxiety")) {
          aiResponse += "For customers seeking anxiety relief, consider recommending products with balanced THC:CBD ratios or higher CBD content. Strains rich in linalool and caryophyllene terpenes often have calming effects. Our most popular anxiety-relieving products currently in stock are Harlequin (balanced hybrid), ACDC (high-CBD), and Granddaddy Purple (relaxing indica).";
        } else if (suggestion.includes("indica")) {
          aiResponse += "Our most popular indica strains currently in stock are Northern Lights (22% THC), Granddaddy Purple (19% THC), and Blueberry Kush (24% THC). All three feature high myrcene content for deep relaxation and are consistently highly rated by our customers.";
        }
        
        setResponse(aiResponse);
        setIsSubmitting(false);
      }, 1500);
    }, 100);
  };

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-5">
        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
          <img src="/budbuddy.png" alt="Bud" className="h-8 w-8 object-contain" />
        </div>
        <h2 className="text-xl font-semibold">Bud AI Budtender</h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-5">
        {response ? (
          <div className="text-sm text-gray-700 leading-relaxed">
            {response}
          </div>
        ) : (
          <p className="text-sm text-gray-700">
            Hello! I'm Bud, your AI budtender assistant. I can help answer cannabis
            questions, provide product information, or assist with customer
            consultations. What would you like help with today?
          </p>
        )}
      </div>

      <div className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-28 text-sm"
          placeholder="Ask Bud a question about cannabis, products, or customer recommendations..."
        ></textarea>

        <div className="flex justify-end">
          <Button 
            onClick={handleAskBud} 
            disabled={!question.trim() || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Ask Bud'
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSuggestionClick("How do terpenes work?")}
            className="text-xs bg-white shadow-sm hover:bg-purple-50"
          >
            How do terpenes work?
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSuggestionClick("Explain THC vs CBD")}
            className="text-xs bg-white shadow-sm hover:bg-purple-50"
          >
            Explain THC vs CBD
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSuggestionClick("Help me recommend for anxiety")}
            className="text-xs bg-white shadow-sm hover:bg-purple-50"
          >
            Help me recommend for anxiety
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSuggestionClick("What's our most popular indica?")}
            className="text-xs bg-white shadow-sm hover:bg-purple-50"
          >
            What's our most popular indica?
          </Button>
        </div>
      </div>
    </div>
  );
};

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

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col">
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
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="relative"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full opacity-50 blur-xl -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-100 rounded-full opacity-40 blur-xl -z-10"></div>
          
          {renderActiveMode()}
        </motion.div>
      </main>
      
      {/* Footer with version info */}
      <footer className="py-3 px-6 text-center text-xs text-gray-500">
        <p>LeafIQ Staff Workstation • Version 2.5.0</p>
      </footer>
    </div>
  );
};

export default StaffView;