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
  pattern = "dots",
}: {
  name: string;
  className?: string;
  Icon: any;
  description: string;
  href: string;
  cta: string;
  index: number;
  color?: "primary" | "secondary" | "accent";
  pattern?: "dots" | "lines" | "circuit" | "waves";
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

  // Create pattern elements based on type
  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className={`absolute h-3 w-3 rounded-full ${colorMap[color].medium}`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1, 1, 0],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        );
      case "lines":
        return (
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className={`absolute h-[1px] w-[100px] ${colorMap[color].dark}`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `-50px`,
                  rotate: `${Math.random() * 60 - 30}deg`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                animate={{
                  left: ["0%", "120%"],
                }}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        );
      case "circuit":
        return (
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="1" className={colorMap[color].text} />
                  <circle cx="10" cy="10" r="2" className={colorMap[color].text} />
                  <circle cx="90" cy="10" r="2" className={colorMap[color].text} />
                  <circle cx="90" cy="90" r="2" className={colorMap[color].text} />
                  <circle cx="10" cy="90" r="2" className={colorMap[color].text} />
                  <path d="M30,10 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70" fill="none" stroke="currentColor" strokeWidth="1" className={colorMap[color].text} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
        );
      case "waves":
        return (
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M0,50 Q25,30 50,50 Q75,70 100,50 Q125,30 150,50 Q175,70 200,50 Q225,30 250,50 Q275,70 300,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className={colorMap[color].text}
                initial={{ y: -100 }}
                animate={{ y: 300 }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.path
                d="M0,50 Q25,70 50,50 Q75,30 100,50 Q125,70 150,50 Q175,30 200,50 Q225,70 250,50 Q275,30 300,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className={colorMap[color].text}
                initial={{ y: -50 }}
                animate={{ y: 250 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
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
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color].gradient} opacity-50`}></div>
      
      {/* Pattern Background */}
      {renderPattern()}
      
      {/* Icon with glowing effect */}
      <div className="z-10 p-6">
        <div className="relative">
          <motion.div 
            className={`w-16 h-16 ${colorMap[color].light} rounded-xl flex items-center justify-center mb-4 overflow-hidden`}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${colorMap[color].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Icon className={`h-8 w-8 ${colorMap[color].text} transition-all duration-300 group-hover:scale-110`} />
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
      
      {/* Hover Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-500"
        whileHover={{ opacity: 0.2 }}
      />
      
      {/* Interactive Corner Accent */}
      <div className="absolute top-0 right-0">
        <motion.div
          className={`w-20 h-20 ${colorMap[color].medium} rotate-45 -translate-y-10 translate-x-10 group-hover:translate-y-[-35px] group-hover:translate-x-[35px] transition-all duration-500 ease-out opacity-50 group-hover:opacity-70`}
        />
      </div>
    </motion.div>
  );
};

export { BentoCard, BentoGrid };