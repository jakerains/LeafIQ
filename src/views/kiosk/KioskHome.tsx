import { motion } from 'framer-motion';
import { useState } from 'react';
import { VercelV0Chat } from '../../components/ui/v0-ai-chat';
import InfoModal from '../../components/ui/InfoModal';

interface KioskHomeProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

// Define the types of modals we can show
type ModalType = 'personalized' | 'inStock' | 'expert' | null;

const KioskHome = ({ onSearch, isLoading }: KioskHomeProps) => {
  // State to track which modal is open (if any)
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Function to open a specific modal
  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
  };

  // Function to close the modal
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto text-center flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* V0 Chat Component */}
      <VercelV0Chat onSearch={onSearch} isLoading={isLoading} />
      
      <motion.div 
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
      >
        {/* Personalized Matches Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl h-[320px]"
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image - shows in top 2/3 */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/1.jpg" 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay that gets stronger at bottom to support text */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/30 to-transparent" />
          </div>
          
          {/* Card content - positioned at very bottom */}
          <div className="relative z-10 p-4 flex flex-col justify-end h-full">
            <div className="mt-auto pb-1">
              <h3 className="text-lg font-bold text-white mb-1">Personalized Matches</h3>
              
              <p className="text-white/90 text-sm mb-3">
                Find products perfectly suited to your experience.
              </p>
              
              <div 
                className="inline-flex items-center justify-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => openModal('personalized')}
              >
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* In-Stock Guarantee Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl h-[320px]" 
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image - shows in top 2/3 */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/2.jpg" 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay that gets stronger at bottom to support text */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/30 to-transparent" />
          </div>
          
          {/* Card content - positioned at very bottom */}
          <div className="relative z-10 p-4 flex flex-col justify-end h-full">
            <div className="mt-auto pb-1">
              <h3 className="text-lg font-bold text-white mb-1">In-Stock Guarantee</h3>
              
              <p className="text-white/90 text-sm mb-3">
                All recommendations available right now in store.
              </p>
              
              <div 
                className="inline-flex items-center justify-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => openModal('inStock')}
              >
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Expert Guidance Card */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl shadow-xl h-[320px]" 
          variants={item}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          {/* Card background image - shows in top 2/3 */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/3-yep.jpg" 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay that gets stronger at bottom to support text */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent-900 via-accent-900/30 to-transparent" />
          </div>
          
          {/* Card content - positioned at very bottom */}
          <div className="relative z-10 p-4 flex flex-col justify-end h-full">
            <div className="mt-auto pb-1">
              <h3 className="text-lg font-bold text-white mb-1">Expert Guidance</h3>
              
              <p className="text-white/90 text-sm mb-3">
                Our staff provides insights on any recommendation.
              </p>
              
              <div 
                className="inline-flex items-center justify-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium text-white border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => openModal('expert')}
              >
                Learn More
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Personalized Matches Modal */}
      <InfoModal
        isOpen={activeModal === 'personalized'}
        onClose={closeModal}
        title="Personalized Product Matching"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <img 
              src="/1.jpg" 
              alt="Budtender explaining product" 
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">How It Works</h3>
              <p className="text-gray-700">
                Our AI-powered recommendation engine analyzes cannabis terpene profiles alongside your 
                desired feelings and experiences to find perfect matches every time.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Why Terpenes Matter</h3>
            <p className="text-gray-700 mb-4">
              Terpenes are aromatic compounds in cannabis that influence effects more precisely than 
              just indica/sativa classifications. Our system matches terpene profiles to your desired experience.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium mb-2">Common Terpenes & Effects</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-300"></span>
                  <span className="text-sm"><strong>Myrcene:</strong> Relaxation, sedation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-300"></span>
                  <span className="text-sm"><strong>Limonene:</strong> Mood elevation, focus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-300"></span>
                  <span className="text-sm"><strong>Pinene:</strong> Alertness, memory</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-300"></span>
                  <span className="text-sm"><strong>Linalool:</strong> Anxiety relief, calm</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Just Ask About Your Vibe</h3>
            <p className="text-gray-700">
              Whether you're looking for relaxation, energy, creativity, pain relief, or better sleep,
              our system translates your needs into optimal product recommendations that are in-stock and ready.
            </p>
          </div>
        </div>
      </InfoModal>

      {/* In-Stock Guarantee Modal */}
      <InfoModal
        isOpen={activeModal === 'inStock'}
        onClose={closeModal}
        title="In-Stock Guarantee"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <img 
              src="/2.jpg" 
              alt="Inventory display" 
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Inventory</h3>
              <p className="text-gray-700">
                Our system connects directly to our inventory management system, ensuring that all recommendations are 
                products we actually have available for purchase right now.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">No Disappointments</h3>
            <p className="text-gray-700 mb-2">
              We've all been there - finding the perfect product only to discover it's sold out. Our system eliminates
              this frustration by only suggesting products currently in stock.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium mb-2">How We Ensure Availability</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-secondary-300 flex items-center justify-center text-secondary-800 text-xs mt-0.5">1</span>
                  <span className="text-sm">Real-time inventory tracking across our dispensary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-secondary-300 flex items-center justify-center text-secondary-800 text-xs mt-0.5">2</span>
                  <span className="text-sm">Automatic updates when products are purchased</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-secondary-300 flex items-center justify-center text-secondary-800 text-xs mt-0.5">3</span>
                  <span className="text-sm">Inventory levels are factored into our recommendation algorithm</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Inventory Intelligence</h3>
            <p className="text-gray-700">
              Our system not only checks if products are in stock, but also prioritizes recommendations
              based on inventory levels, ensuring you get products we have plenty of or helping to discover
              new alternatives when supplies are limited.
            </p>
          </div>
        </div>
      </InfoModal>

      {/* Expert Guidance Modal */}
      <InfoModal
        isOpen={activeModal === 'expert'}
        onClose={closeModal}
        title="Expert Budtender Guidance"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <img 
              src="/3-yep.jpg" 
              alt="Budtender helping customer" 
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Knowledgeable Staff</h3>
              <p className="text-gray-700">
                Our trained budtenders combine cannabis science expertise with personalized service to 
                help you navigate your cannabis journey with confidence.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Beyond the Algorithm</h3>
            <p className="text-gray-700 mb-4">
              While our AI makes great recommendations, our staff can provide nuanced insights about 
              flavor profiles, consumption methods, and personalized advice based on your preferences.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium mb-2">How Our Experts Help</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-accent-300 flex items-center justify-center text-accent-800 text-xs mt-0.5">✓</span>
                  <span className="text-sm">Detailed terpene profile explanations for experienced users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-accent-300 flex items-center justify-center text-accent-800 text-xs mt-0.5">✓</span>
                  <span className="text-sm">Consumption guidance and dosage recommendations for beginners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-accent-300 flex items-center justify-center text-accent-800 text-xs mt-0.5">✓</span>
                  <span className="text-sm">Product comparisons and alternatives based on specific needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="min-w-4 h-4 rounded-full bg-accent-300 flex items-center justify-center text-accent-800 text-xs mt-0.5">✓</span>
                  <span className="text-sm">Latest information on new products and trending strains</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Educational Resources</h3>
            <p className="text-gray-700">
              Our staff can also provide educational materials on cannabis topics like terpene effects, 
              consumption methods, and how different products might fit into your wellness routine.
            </p>
          </div>
        </div>
      </InfoModal>
    </motion.div>
  );
};

export default KioskHome;