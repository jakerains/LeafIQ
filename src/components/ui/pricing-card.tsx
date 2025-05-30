"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Separator } from "./separator";
import { ShimmerButton } from "./shimmer-button";
import { Link } from "react-router-dom";

interface PricingFeature {
  title: string;
  items: string[];
}

interface PricingCardProps {
  title: string;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  period?: string;
  features: string[] | PricingFeature[];
  buttonText?: string;
  buttonLink?: string;
  highlighted?: boolean;
  isCurrentPlan?: boolean;
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  period = "/month",
  features,
  buttonText = "Get Started",
  buttonLink = "/auth/signup",
  highlighted = false,
  isCurrentPlan = false,
}: PricingCardProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  
  // Determine if features is a simple array or grouped features
  const isGroupedFeatures = features.length > 0 && 
    typeof features[0] !== 'string' && 
    (features[0] as any).title !== undefined;
  
  const simpleFeatures = isGroupedFeatures ? [] : features as string[];
  const groupedFeatures = isGroupedFeatures ? features as PricingFeature[] : [];

  return (
    <motion.section
      ref={containerRef}
      className={`w-full overflow-hidden ${highlighted ? 'bg-primary-500 text-white' : 'bg-gray-800/40 backdrop-blur-xl text-gray-100'} rounded-2xl`}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Card className={`relative border-none shadow-none bg-transparent w-full overflow-hidden ${highlighted ? 'text-white' : 'text-gray-100'}`}>
        <div className="flex flex-col">
          <motion.div
            className="flex flex-col justify-between p-6 lg:p-10"
            variants={itemVariants}
          >
            <div>
              <CardHeader className="p-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={`text-3xl font-bold ${highlighted ? 'text-white' : 'text-gray-100'}`}>{title}</CardTitle>
                    <CardDescription className={`mt-2 ${highlighted ? 'text-white/80' : 'text-gray-300'}`}>{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <motion.div className="mt-6 space-y-4" variants={itemVariants}>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold">{price}</span>
                  <span className="ml-1 text-xl">{period}</span>
                  {originalPrice && (
                    <span className="ml-2 text-xl text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                  )}
                </div>
                {period.includes('year') && (
                  <span className="block text-sm text-white/70">
                    Save 17% with annual billing - 2 months free!
                  </span>
                )}
              </motion.div>
            </div>
            
            {!isGroupedFeatures && (
              <motion.div className="mt-8 space-y-4" variants={itemVariants}>
                {simpleFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    variants={listItemVariants}
                  >
                    <Check className={`mr-3 h-5 w-5 ${highlighted ? 'text-primary-200' : 'text-primary-400'} flex-shrink-0 mt-0.5`} />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <motion.div className="mt-8" variants={itemVariants}>
              {isCurrentPlan ? (
                <div className={`w-full py-3 px-4 text-center rounded-lg ${highlighted ? 'bg-white/20' : 'bg-primary-500/20'} font-medium`}>
                  Current Plan
                </div>
              ) : (
                <Link to={buttonLink}>
                  <ShimmerButton
                    className="w-full"
                    shimmerColor={highlighted ? "#ffffff" : "#22c55e"}
                    background={highlighted ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 197, 94, 1)"}
                  >
                    {buttonText}
                  </ShimmerButton>
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          {isGroupedFeatures && (
            <>
              <Separator className="bg-white/10" />
              <motion.div
                className="p-6 lg:p-10"
                variants={itemVariants}
              >
                <div className="space-y-6">
                  {groupedFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex}>
                      <h3 className="mb-4 text-lg font-semibold">{feature.title}:</h3>
                      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {feature.items.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center"
                            variants={listItemVariants}
                            custom={index + featureIndex * feature.items.length}
                          >
                            <Check className={`mr-3 h-5 w-5 ${highlighted ? 'text-primary-200' : 'text-primary-400'} flex-shrink-0`} />
                            <span className="text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      {featureIndex < groupedFeatures.length - 1 && <Separator className="my-6 bg-white/10" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </Card>
    </motion.section>
  );
}