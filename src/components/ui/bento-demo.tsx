import {
  Brain,
  Package,
  Target,
  Users,
  Zap,
  Lock,
  Leaf,
  LineChart,
  MessageCircle,
  ShoppingCart,
  Clock,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { BentoCard, BentoGrid } from "./bento-grid";

const features = [
  {
    Icon: Brain,
    name: "AI-Powered Recommendations",
    description: "Match customers with perfect products using our advanced AI engine that understands terpene profiles and desired effects.",
    href: "/",
    cta: "Learn more",
    color: "primary",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    Icon: Package,
    name: "Smart Inventory Management",
    description: "Real-time tracking and automated reordering suggestions to keep your best sellers in stock.",
    href: "/",
    cta: "Learn more",
    color: "secondary",
    className: "md:col-span-1",
  },
  {
    Icon: Target,
    name: "Customer Insights",
    description: "Deep analytics on customer preferences and buying patterns to optimize your product mix.",
    href: "/",
    cta: "Learn more",
    color: "accent",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Leaf,
    name: "Terpene Intelligence",
    description: "Detailed terpene profiles for every product, helping staff provide expert guidance on effects.",
    href: "/",
    cta: "Explore terpenes",
    color: "primary",
    className: "md:col-span-1",
  },
  {
    Icon: LineChart,
    name: "Product Performance",
    description: "Track which products are trending and see real-time customer feedback and ratings.",
    href: "/",
    cta: "View analytics",
    color: "accent",
    className: "md:col-span-2",
  },
  {
    Icon: Users,
    name: "Staff Management",
    description: "Role-based access control and performance tracking for your team members.",
    href: "/",
    cta: "Learn more",
    color: "secondary",
    className: "md:col-span-1",
  },
  {
    Icon: MessageCircle,
    name: "Customer Feedback",
    description: "Collect and analyze customer feedback to continuously improve your product offerings.",
    href: "/",
    cta: "See how it works",
    color: "primary",
    className: "md:col-span-1",
  },
  {
    Icon: ShoppingCart,
    name: "Sales Acceleration",
    description: "Boost revenue with AI-powered product recommendations and bundling suggestions.",
    href: "/",
    cta: "Increase sales",
    color: "accent",
    className: "md:col-span-1",
  },
  {
    Icon: Clock,
    name: "Time-Based Insights",
    description: "Understand peak hours and seasonal trends to optimize staffing and inventory.",
    href: "/",
    cta: "View patterns",
    color: "secondary",
    className: "md:col-span-1",
  },
];

function BentoDemo() {
  return (
    <div>
      <motion.div 
        className="bg-gradient-to-r from-primary-500 to-secondary-500 p-1 rounded-2xl mb-10 overflow-hidden relative max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl p-8 text-center">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2322c55e\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            }}
          />
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-8 h-8 text-primary-600" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Everything You Need</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features to help your dispensary thrive in an evolving market</p>
        </div>
      </motion.div>
      
      <BentoGrid className="max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <BentoCard key={feature.name} {...feature} index={index} />
        ))}
      </BentoGrid>
    </div>
  );
}

export { BentoDemo };