import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { ShimmerButton } from '../ui/shimmer-button';
import { createCheckoutSession } from '../../lib/stripe';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  priceId?: string;
  mode?: 'payment' | 'subscription';
  buttonText: string;
  buttonLink?: string;
  highlighted?: boolean;
  isCurrentPlan?: boolean;
  isYearly?: boolean;
  monthlyPrice?: string;
}

export function PricingCard({ 
  title, 
  price, 
  period = "", 
  description, 
  features, 
  priceId,
  mode = 'subscription',
  buttonText, 
  buttonLink,
  highlighted = false,
  isCurrentPlan = false,
  isYearly = false,
  monthlyPrice = ""
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useAuthStore();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (!priceId) {
      if (buttonLink) {
        navigate(buttonLink);
      }
      return;
    }

    if (!role) {
      navigate('/auth/signup');
      return;
    }

    try {
      setIsLoading(true);
      const checkoutUrl = await createCheckoutSession(priceId, mode);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={`p-8 rounded-2xl h-full flex flex-col justify-between ${
        highlighted 
          ? 'bg-primary-500 text-white shadow-xl scale-105' 
          : 'bg-white bg-opacity-20 backdrop-blur-2xl text-gray-900 border border-white/20'
      }`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <div className="mb-4">
          {isYearly && monthlyPrice && highlighted ? (
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{price}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg line-through opacity-70">${parseInt(monthlyPrice.replace('$', '')) * 12}</span>
                <span className="text-sm bg-primary-400 px-2 py-0.5 rounded-full">2 months free!</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-4xl font-bold">{price}</span>
              {period && <span className="text-lg">{period}</span>}
            </div>
          )}
        </div>
        <p className={`mb-6 ${highlighted ? 'text-primary-100' : 'text-gray-600'}`}>
          {isYearly && highlighted ? "" : description}
        </p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check 
                className={`w-5 h-5 mr-2 ${highlighted ? 'text-primary-200' : 'text-primary-500'}`}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto">
        {isCurrentPlan ? (
          <div className={`w-full py-3 px-4 text-center rounded-lg ${highlighted ? 'bg-white bg-opacity-20' : 'bg-primary-100'} font-medium`}>
            Current Plan
          </div>
        ) : (
          <ShimmerButton
            className="w-full"
            shimmerColor={highlighted ? "#ffffff" : "#22c55e"}
            background={highlighted ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 197, 94, 1)"}
            onClick={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              buttonText
            )}
          </ShimmerButton>
        )}
      </div>
    </motion.div>
  );
}