import { motion } from "framer-motion";
import { Brain, LineChart, ShieldCheck, Leaf, UserCircle, MessageSquare } from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  index, 
  color = "primary" 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  index: number;
  color?: "primary" | "secondary" | "accent" 
}) => {
  const colorMap = {
    primary: {
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
      hoverBg: "group-hover:bg-primary-50",
      shadowColor: "group-hover:shadow-primary-500/10"
    },
    secondary: {
      iconBg: "bg-secondary-50",
      iconColor: "text-secondary-600",
      hoverBg: "group-hover:bg-secondary-50",
      shadowColor: "group-hover:shadow-secondary-500/10"
    },
    accent: {
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      hoverBg: "group-hover:bg-accent-50",
      shadowColor: "group-hover:shadow-accent-500/10"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${colorMap[color].hoverBg} ${colorMap[color].shadowColor}`}
    >
      <div className={`w-14 h-14 ${colorMap[color].iconBg} rounded-xl flex items-center justify-center mb-6`}>
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className={`${colorMap[color].iconColor}`}
        >
          <Icon size={24} />
        </motion.div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <motion.button
        whileHover={{ x: 5 }}
        className="text-sm font-medium inline-flex items-center text-gray-700 hover:text-gray-900"
      >
        Learn more
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Match customers with perfect products using advanced AI that understands terpene profiles and desired effects.",
      color: "primary"
    },
    {
      icon: LineChart,
      title: "Real-time Analytics",
      description: "Track performance with live dashboards showing sales, inventory levels, and customer satisfaction metrics.",
      color: "secondary"
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with all relevant data protection regulations.",
      color: "accent"
    },
    {
      icon: Leaf,
      title: "Terpene Intelligence",
      description: "Detailed terpene profiles for every product, helping staff provide expert guidance on effects.",
      color: "primary"
    },
    {
      icon: UserCircle,
      title: "Staff Management",
      description: "Role-based access control and performance tracking for your team members.",
      color: "secondary"
    },
    {
      icon: MessageSquare,
      title: "Customer Insights",
      description: "Deep analytics on customer preferences and buying patterns to optimize your product mix.",
      color: "accent"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-primary-500"/>
          </svg>
        </div>
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary-100/30 -right-20 -top-20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-accent-100/30 -left-40 bottom-0"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block mb-4"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Everything You Need</h2>
          <p className="text-xl text-gray-600">Powerful features to help your dispensary thrive in an evolving market</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              color={feature.color as "primary" | "secondary" | "accent"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };