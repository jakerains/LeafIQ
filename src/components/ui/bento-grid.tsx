import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-fr grid-cols-1 md:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  Icon,
  description,
  href,
  cta,
  index,
  color = "primary",
}: {
  name: string;
  className?: string;
  Icon: any;
  description: string;
  href: string;
  cta: string;
  index: number;
  color?: "primary" | "secondary" | "accent";
}) => {
  const colorMap = {
    primary: {
      light: "bg-primary-50",
      medium: "bg-primary-100",
      dark: "bg-primary-500",
      text: "text-primary-600",
      hover: "group-hover:bg-primary-100",
      border: "border-primary-100",
      gradient: "from-primary-50 to-transparent",
    },
    secondary: {
      light: "bg-secondary-50",
      medium: "bg-secondary-100",
      dark: "bg-secondary-500",
      text: "text-secondary-600",
      hover: "group-hover:bg-secondary-100",
      border: "border-secondary-100",
      gradient: "from-secondary-50 to-transparent",
    },
    accent: {
      light: "bg-accent-50",
      medium: "bg-accent-100",
      dark: "bg-accent-500",
      text: "text-accent-600",
      hover: "group-hover:bg-accent-100",
      border: "border-accent-100",
      gradient: "from-accent-50 to-transparent",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      key={name}
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl h-full min-h-[280px]",
        "bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500",
        className,
      )}
    >
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color].gradient} opacity-50`}></div>
      
      {/* Animated Background - Circuit-like pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <motion.div 
          className={`absolute w-full h-full ${colorMap[color].text}`}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='currentColor' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px',
          }}
        />
      </div>
      
      {/* Icon with glowing effect */}
      <div className="z-10 p-6">
        <div className="relative">
          <motion.div 
            className={`w-16 h-16 ${colorMap[color].light} rounded-xl flex items-center justify-center mb-4 overflow-hidden`}
            whileHover={{ 
              scale: 1.05, 
              rotate: 5,
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
          >
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${colorMap[color].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div
              className={`h-8 w-8 ${colorMap[color].text} transition-all duration-300`}
              whileHover={{ 
                scale: 1.2,
                rotate: 10
              }}
            >
              <Icon />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="transform-gpu transition-all duration-300">
          <motion.h3 
            className="text-xl font-semibold text-gray-800 mb-2"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {name}
          </motion.h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-6 pt-0 z-10">
        <motion.a
          href={href}
          className={`inline-flex items-center text-sm font-medium ${colorMap[color].text} transition-all`}
          whileHover={{ x: 4 }}
        >
          {cta}
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>
        </motion.a>
      </div>
      
      {/* Animated Border Effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: 0.5,
          boxShadow: `0 0 0 2px ${color === 'primary' ? '#22c55e' : color === 'secondary' ? '#14b8a6' : '#10b981'}`
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Interactive Corner Accent */}
      <div className="absolute top-0 right-0">
        <motion.div
          className={`w-20 h-20 ${colorMap[color].medium} rotate-45 -translate-y-10 translate-x-10 group-hover:translate-y-[-35px] group-hover:translate-x-[35px] transition-all duration-500 ease-out opacity-50 group-hover:opacity-70`}
          whileHover={{
            rotate: 50,
            scale: 1.1
          }}
        />
      </div>
    </motion.div>
  );
};

export { BentoCard, BentoGrid };