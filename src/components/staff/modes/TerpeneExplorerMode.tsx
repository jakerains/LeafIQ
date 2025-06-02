import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Atom, 
  Search, 
  BookOpen, 
  Lightbulb, 
  Share2,
  Heart,
  Brain,
  Zap,
  Leaf,
  Moon,
  Smile
} from 'lucide-react';
import { Button } from '../../ui/button';

// Common terpenes and their properties
const TERPENES = [
  {
    name: 'Myrcene',
    description: 'The most common terpene in cannabis, known for its earthy, musky aroma.',
    effects: ['Relaxing', 'Sedating', 'Muscle relaxant'],
    aroma: 'Earthy, musky, herbal',
    medicalBenefits: ['Pain relief', 'Insomnia', 'Muscle tension'],
    color: 'bg-green-500',
    icon: <Leaf size={20} />,
    foundIn: ['Mangoes', 'Hops', 'Lemongrass'],
    percentage: '65% of strains'
  },
  {
    name: 'Limonene',
    description: 'A citrusy terpene that may elevate mood and relieve stress.',
    effects: ['Mood elevation', 'Stress relief', 'Focus'],
    aroma: 'Citrus, lemon, orange',
    medicalBenefits: ['Depression', 'Anxiety', 'Stress'],
    color: 'bg-yellow-500',
    icon: <Smile size={20} />,
    foundIn: ['Citrus fruits', 'Juniper', 'Peppermint'],
    percentage: '25% of strains'
  },
  {
    name: 'Pinene',
    description: 'A pine-scented terpene that may promote alertness and memory retention.',
    effects: ['Alertness', 'Memory retention', 'Focus'],
    aroma: 'Pine, forest, fresh',
    medicalBenefits: ['Asthma', 'Memory issues', 'Inflammation'],
    color: 'bg-emerald-500',
    icon: <Brain size={20} />,
    foundIn: ['Pine trees', 'Rosemary', 'Basil'],
    percentage: '19% of strains'
  },
  {
    name: 'Linalool',
    description: 'A floral terpene with calming and anti-anxiety properties.',
    effects: ['Calming', 'Anti-anxiety', 'Sleep aid'],
    aroma: 'Floral, lavender, spicy',
    medicalBenefits: ['Anxiety', 'Depression', 'Insomnia'],
    color: 'bg-purple-500',
    icon: <Moon size={20} />,
    foundIn: ['Lavender', 'Coriander', 'Mint'],
    percentage: '16% of strains'
  },
  {
    name: 'Caryophyllene',
    description: 'A spicy terpene that may reduce inflammation and pain.',
    effects: ['Pain relief', 'Anti-inflammatory', 'Stress relief'],
    aroma: 'Spicy, peppery, woody',
    medicalBenefits: ['Chronic pain', 'Inflammation', 'Anxiety'],
    color: 'bg-red-500',
    icon: <Heart size={20} />,
    foundIn: ['Black pepper', 'Cloves', 'Cinnamon'],
    percentage: '14% of strains'
  },
  {
    name: 'Terpinolene',
    description: 'A complex terpene with uplifting and energizing properties.',
    effects: ['Uplifting', 'Energizing', 'Creative'],
    aroma: 'Fresh, piney, floral, citrusy',
    medicalBenefits: ['Fatigue', 'Mood disorders', 'Lack of focus'],
    color: 'bg-blue-500',
    icon: <Zap size={20} />,
    foundIn: ['Tea tree', 'Nutmeg', 'Cumin'],
    percentage: '10% of strains'
  }
];

export const TerpeneExplorerMode: React.FC = () => {
  const [selectedTerpene, setSelectedTerpene] = useState(TERPENES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'wheel' | 'list'>('cards');

  const filteredTerpenes = TERPENES.filter(terpene =>
    terpene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    terpene.effects.some(effect => effect.toLowerCase().includes(searchQuery.toLowerCase())) ||
    terpene.aroma.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-green-100 rounded-lg">
            <Atom size={22} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-semibold">Terpene Explorer</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" 
              placeholder="Search by terpene name, effect, or aroma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all shadow-sm"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
            {['cards', 'wheel', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terpene List/Grid with decorative background */}
        <div className="lg:col-span-2 space-y-5 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-50 rounded-full opacity-40 blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-40 blur-3xl -z-10"></div>
          
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Leaf size={18} className="mr-2 text-green-600" />
            Common Cannabis Terpenes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTerpenes.map((terpene) => (
              <motion.div
                key={terpene.name}
                onClick={() => setSelectedTerpene(terpene)}
                className={`
                  p-5 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 cursor-pointer
                  transition-all duration-300 hover:shadow-xl
                  ${selectedTerpene.name === terpene.name 
                    ? 'border-green-300 shadow-lg scale-[1.02]' 
                    : 'border-gray-200 hover:border-green-200'
                  }
                `}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 ${terpene.color} text-white rounded-xl shadow-md`}>
                    {terpene.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{terpene.name}</h4>
                    <p className="text-sm text-gray-600">{terpene.percentage}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{terpene.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {terpene.effects.slice(0, 2).map((effect) => (
                    <span
                      key={effect}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium shadow-sm border border-gray-200"
                    >
                      {effect}
                    </span>
                  ))}
                  {terpene.effects.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      +{terpene.effects.length - 2} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Terpene Info */}
        <div className="space-y-4">
          <motion.div
            key={selectedTerpene.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-5">
              <div className={`p-3.5 ${selectedTerpene.color} text-white rounded-xl shadow-md`}>
                {selectedTerpene.icon}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{selectedTerpene.name}</h3>
                <p className="text-sm text-gray-600">{selectedTerpene.percentage}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-5 leading-relaxed">{selectedTerpene.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Brain size={16} className="mr-1" /> Effects
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTerpene.effects.map((effect) => (
                    <span
                      key={effect}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium shadow-sm border border-blue-200"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Aroma Profile</h4>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 shadow-inner border border-gray-100">
                  {selectedTerpene.aroma}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Heart size={16} className="mr-1" /> Medical Benefits
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedTerpene.medicalBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Also Found In</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTerpene.foundIn.map((source) => (
                    <span
                      key={source}
                      className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium shadow-sm border border-green-200"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" size="sm" className="flex-1 bg-white shadow-sm hover:shadow">
                <BookOpen size={16} className="mr-1" />
                Learn More
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-white shadow-sm hover:shadow">
                <Share2 size={16} className="mr-1" />
                Share Info
              </Button>
            </div>

            <Button variant="default" className="w-full mt-3 shadow-md hover:shadow-lg">
              <Search size={16} className="mr-1" />
              Find Products with {selectedTerpene.name}
            </Button>
          </motion.div>

          {/* Quick Education Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 border border-blue-200 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-blue-200 bg-opacity-50 rounded-lg">
                <Lightbulb size={18} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-900 text-lg">Employee Tip</h4>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              When explaining terpenes to customers, use simple analogies. For example: 
              "Myrcene is like the 'couch-lock' terpene - it's what makes some strains feel more relaxing, 
              just like how lavender makes you feel calm."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 