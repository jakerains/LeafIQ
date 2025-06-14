import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Menu, X } from 'lucide-react';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { FeaturesSection } from '../components/ui/bento-demo';
import { GlowingEffect } from '../components/ui/glowing-effect';
import ComingSoonModal from '../components/ui/ComingSoonModal';
import { FlipWords } from '../components/ui/flip-words';

const LandingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  
  // Words for the FlipWords component
  const flipWords = ["Dispensary", "Customer", "Budtender"];

  // Close mobile menu when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (isMobileMenuOpen) {
      // Check if the click is outside the menu and the menu toggle button
      const isMenuClick = (e.target as Element).closest('.mobile-menu, .menu-toggle');
      if (!isMenuClick) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen" onClick={handleClickOutside}>
      {/* Hero Section - Modified to be more contained */}
      <header className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <nav className="flex justify-between items-center mb-16 relative">
            <img 
              src="/leafiq-logo.png" 
              alt="LeafIQ" 
              className="h-24 drop-shadow-lg filter shadow-primary-500/50"
            />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4">
              <Link 
                to="/auth/login"
                className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-white hover:shadow-md transition-all duration-300"
              >
                Log In
              </Link>
              <button
                onClick={() => setShowComingSoonModal(true)} 
                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Navigation Button with Glassmorphism */}
            <div className="md:hidden">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleClickOutside
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 text-gray-900 shadow-md menu-toggle hover:bg-white/50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
          
          {/* Mobile Menu Dropdown - Enhanced with glassmorphism and better positioning */}
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-8 right-8 z-50 bg-white/40 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 py-3 px-1 w-48 mobile-menu"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
            >
              <div className="relative rounded-lg p-1">
                <GlowingEffect
                  spread={30}
                  glow={true}
                  disabled={false}
                  proximity={50}
                  inactiveZone={0.05}
                  borderWidth={1}
                  movementDuration={1.5}
                />
                <div className="relative flex flex-col space-y-2">
                  <Link 
                    to="/auth/login"
                    className="px-4 py-3 text-gray-900 font-medium hover:bg-white/70 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <button 
                    className="px-4 py-3 mx-2 bg-primary-500/90 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    onClick={() => {
                      setShowComingSoonModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10 max-w-5xl mx-auto">
            <div className="flex-1 text-center lg:text-left order-1">
              <motion.h1 
                className="text-5xl lg:text-7xl font-display font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Transform{" "}
                <span className="relative inline-block">
                  Your{" "}
                </span>
                <br className="md:hidden" /> {/* Line break on mobile */}
                <FlipWords 
                  words={flipWords}
                  duration={6000}
                  className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent inline-block"
                />
                <span className="text-gray-900"> Experience</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-800 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                AI-powered product recommendations, inventory management, and customer insights for modern cannabis retailers.
              </motion.p>

              {/* On mobile, move the image here directly after the text */}
              <div className="lg:hidden mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative w-full max-w-md mx-auto"
                >
                  <div className="relative rounded-2xl border-[0.75px] border-gray-200/30 p-3 aspect-[4/3]">
                    <GlowingEffect
                      spread={50}
                      glow={true}
                      disabled={false}
                      proximity={100}
                      inactiveZone={0.1}
                      borderWidth={3}
                      movementDuration={2.5}
                    />
                    <div className="relative h-full">
                      <img
                        src="/leafie-use3.jpeg"
                        alt="LeafIQ Dashboard"
                        className="rounded-xl shadow-2xl w-full h-full object-cover border-2 border-white/40 backdrop-blur-sm"
                      />
                      {/* Decorative floating elements */}
                      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary-500/15 rounded-full blur-xl"></div>
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent-500/15 rounded-full blur-xl"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="flex flex-row gap-2 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ShimmerButton
                  className="px-4 py-3 text-sm md:px-8 md:py-4 md:text-lg shadow-lg shadow-primary-500/20 flex-1 md:flex-auto"
                  shimmerColor="#22c55e"
                  background="rgba(34, 197, 94, 1)"
                  onClick={() => setShowComingSoonModal(true)}
                >
                  Get Started Now
                </ShimmerButton>
                <Link 
                  to="/demo-login"
                  className="px-4 py-3 text-sm md:px-8 md:py-4 md:text-lg border border-gray-300 backdrop-blur-sm bg-gray-100/70 rounded-full hover:bg-gray-200/80 transition-all duration-300 text-gray-900 shadow-lg flex-1 md:flex-auto text-center"
                >
                  Try Live Demo
                </Link>
              </motion.div>
              
              {/* Feature indicators in a glassmorphism box */}
              <motion.div 
                className="mt-8 mb-4 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="relative rounded-xl p-2 w-fit mx-auto lg:mx-0">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={60}
                    inactiveZone={0.05}
                    borderWidth={1}
                    movementDuration={2}
                  />
                  <div className="relative flex items-center justify-center gap-4 md:gap-8 backdrop-blur-sm bg-white/30 border border-white/40 rounded-lg py-2.5 px-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs md:text-sm font-medium">AI Powered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs md:text-sm font-medium">Real-time Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-xs md:text-sm font-medium">Seamless Integration</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="flex-1 order-2 hidden lg:block">
              <div className="flex justify-center pl-8"> {/* Increased left padding to 2rem (pl-8) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative w-full max-w-2xl mx-auto" /* Increased from max-w-xl to max-w-2xl */
                >
                  <div className="relative rounded-2xl border-[0.75px] border-gray-200/30 p-3">
                    <GlowingEffect
                      spread={50}
                      glow={true}
                      disabled={false}
                      proximity={100}
                      inactiveZone={0.1}
                      borderWidth={3}
                      movementDuration={2.5}
                    />
                    <div className="relative">
                      <img
                        src="/leafie-use3.jpeg"
                        alt="LeafIQ Dashboard"
                        className="rounded-xl shadow-2xl w-full border-2 border-white/40 backdrop-blur-sm"
                      />
                      {/* Decorative floating elements */}
                      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary-500/15 rounded-full blur-xl"></div>
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent-500/15 rounded-full blur-xl"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-transparent bg-opacity-30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-black">Why Choose </span>
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">LeafIQ</span>
            </h2>
            <p className="text-xl text-gray-600">Experience the difference with our cutting-edge approach to cannabis retail.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {/* Personalized Matches Card */}
            <motion.div 
              className="relative h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2 h-full">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={70}
                  inactiveZone={0.05}
                  borderWidth={2}
                  movementDuration={1.8}
                />
                <div className="relative overflow-hidden rounded-xl shadow-xl h-full">
                  {/* Card background image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/1.jpg" 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/30 to-transparent" />
                  </div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                    <div className="mt-auto">
                      <h3 className="text-xl font-bold text-white mb-2">Personalized Matches</h3>
                      <p className="text-white/90 text-sm mb-4">
                        AI-powered recommendations based on your unique preferences and desired effects.
                      </p>
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium text-white border border-white/20">
                        Smart Matching
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* In-Stock Guarantee Card */}
            <motion.div 
              className="relative h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2 h-full">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={70}
                  inactiveZone={0.05}
                  borderWidth={2}
                  movementDuration={1.8}
                />
                <div className="relative overflow-hidden rounded-xl shadow-xl h-full">
                  {/* Card background image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/2.jpg" 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/30 to-transparent" />
                  </div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                    <div className="mt-auto">
                      <h3 className="text-xl font-bold text-white mb-2">In-Stock Guarantee</h3>
                      <p className="text-white/90 text-sm mb-4">
                        Real-time inventory tracking ensures every recommendation is available for purchase.
                      </p>
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium text-white border border-white/20">
                        Always Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Expert Guidance Card */}
            <motion.div 
              className="relative h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2 h-full">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={70}
                  inactiveZone={0.05}
                  borderWidth={2}
                  movementDuration={1.8}
                />
                <div className="relative overflow-hidden rounded-xl shadow-xl h-full">
                  {/* Card background image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/3-yep.jpg" 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-900 via-accent-900/30 to-transparent" />
                  </div>
                  
                  {/* Card content */}
                  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                    <div className="mt-auto">
                      <h3 className="text-xl font-bold text-white mb-2">Expert Guidance</h3>
                      <p className="text-white/90 text-sm mb-4">
                        Knowledgeable staff ready to provide personalized insights and education.
                      </p>
                      <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm font-medium text-white border border-white/20">
                        Professional Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <section className="py-20 bg-transparent bg-opacity-30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-black">💵 Clear, Honest </span>
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600">All the power. No confusing tiers.</p>
          </motion.div>
          
          {/* Pricing Toggle */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              {isYearly && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute left-1/2 transform -translate-x-1/2 -top-8 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  Save 17% (2 months free!)
                </motion.div>
              )}
              
              <div className="flex justify-center items-center">
                <span className={`mr-3 font-medium ${!isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Monthly</span>
                <div 
                  className="relative w-16 h-8 bg-gray-200 rounded-full cursor-pointer shadow-inner"
                  onClick={() => setIsYearly(!isYearly)}
                >
                  <motion.div 
                    className="absolute w-6 h-6 bg-primary-500 rounded-full top-1 shadow-md"
                    animate={{ x: isYearly ? 34 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <span className={`ml-3 font-medium ${isYearly ? 'text-primary-600' : 'text-gray-500'}`}>Yearly</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="flex flex-col h-full"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PricingCard
                title={isYearly ? "Annual Plan" : "Standard Plan"}
                price={isYearly ? "$2,490" : "$249"}
                period={isYearly ? "/year" : "/month"}
                description="Everything you need to run a smarter dispensary."
                features={[
                  'AI-Powered Product Matching',
                  'Real-Time Inventory Sync',
                  'Live Analytics & Vibe Trends',
                  'Terpene Effect Explorer',
                  'Staff Dashboard & Query Logs',
                  'Priority Email Support',
                  'Unlimited SKUs'
                ]}
                buttonText="Get Started"
                onClick={() => setShowComingSoonModal(true)}
                highlighted
                isYearly={isYearly}
                monthlyPrice="$249"
              />
            </motion.div>
            <motion.div 
              className="flex flex-col h-full"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <PricingCard
                title="Premium Add-ons"
                price="From $49"
                period="/month"
                description="Enhance your capabilities"
                features={[
                  'Custom AI Model Training',
                  'Multi-Location Support',
                  'Custom Integrations',
                  'Dedicated Account Manager',
                  'Enterprise SLA'
                ]}
                buttonText="Contact Sales"
                onClick={() => setShowComingSoonModal(true)}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-display font-bold mb-6 text-center">Optional Enhancements</h3>
            <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2">
              <GlowingEffect
                spread={45}
                glow={true}
                disabled={false}
                proximity={80}
                inactiveZone={0.05}
                borderWidth={2}
                movementDuration={2}
              />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-8 shadow-sm">
                <p className="text-lg mb-6 text-gray-900 font-medium">Expand LeafIQ as your needs grow:</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-3 mt-1 text-lg">•</span>
                    <span className="text-gray-700">Custom AI tuning with your store's historical data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-3 mt-1 text-lg">•</span>
                    <span className="text-gray-700">Multi-location management dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-3 mt-1 text-lg">•</span>
                    <span className="text-gray-700">Deep POS & menu integrations (Dutchie, Jane, Weedmaps, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-3 mt-1 text-lg">•</span>
                    <span className="text-gray-700">Dedicated account manager & enterprise SLA</span>
                  </li>
                </ul>
                <div className="text-center">
                  <button
                    onClick={() => setShowComingSoonModal(true)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Contact Sales for details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white bg-opacity-90 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link to="/security" className="text-gray-600 hover:text-gray-900">Security</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link to="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link to="/compliance" className="text-gray-600 hover:text-gray-900">Compliance</Link></li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>&copy; {new Date().getFullYear()} LeafIQ. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />
    </div>
  );
};

const PricingCard = ({ 
  title, 
  price, 
  period = "", 
  description, 
  features, 
  buttonText, 
  onClick,
  highlighted = false,
  isYearly = false,
  monthlyPrice = ""
}: {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
  highlighted?: boolean;
  isYearly?: boolean;
  monthlyPrice?: string;
}) => {
  return (
    <motion.div 
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-full rounded-2xl border-[0.75px] border-gray-200/50 p-2">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={70}
          inactiveZone={0.05}
          borderWidth={highlighted ? 3 : 2}
          movementDuration={1.8}
        />
        <div 
          className={
            `relative p-8 rounded-xl h-full flex flex-col justify-between ${
              highlighted 
                ? 'bg-primary-500 text-white shadow-xl' 
                : 'bg-white/80 backdrop-blur-xl text-gray-900 shadow-sm'
            }`
          }
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
            <ShimmerButton
              className="w-full"
              shimmerColor={highlighted ? "#ffffff" : "#22c55e"}
              background={highlighted ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 197, 94, 1)"}
              onClick={onClick}
            >
              {buttonText}
            </ShimmerButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;