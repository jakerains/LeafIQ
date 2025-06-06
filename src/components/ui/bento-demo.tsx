import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { LeafIQGlowingCards } from "./glowing-feature-cards";

function FeaturesSection() {

  return (
    <section className="py-24 relative overflow-hidden bg-transparent backdrop-blur-xl">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-primary-500"/>
          </svg>
        </div>
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary-100/30 to-accent-100/30 -right-20 -top-20"
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
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-secondary-100/30 to-primary-100/30 -left-40 bottom-0"
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
              <Leaf className="w-8 h-8 text-primary-600" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="text-black">Everything You </span>
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Need</span>
          </h2>
          <p className="text-xl text-gray-600">Powerful, intuitive tools to help your dispensary grow smarter—without growing your overhead.</p>
        </motion.div>

        <LeafIQGlowingCards />
      </div>
    </section>
  );
}

export { FeaturesSection };