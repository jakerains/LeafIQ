import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface Terpene {
  id: string;
  name: string;
  aliases?: string[];
  profile: {
    aroma: string[];
    flavor: string[];
  };
  commonSources: string[];
  effects: string[];
  therapeuticNotes: string;
  research?: Array<{
    title: string;
    link: string;
    source: string;
  }>;
  usageVibes: string[];
  defaultIntensity: string;
  // Legacy fields for backward compatibility
  aroma?: string;
  flavorNotes?: string;
  effectTags?: string[];
}

interface TerpeneInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  terpene: Terpene;
}

const TerpeneInfoModal: React.FC<TerpeneInfoModalProps> = ({ isOpen, onClose, terpene }) => {
  // Color schemes for different terpenes
  const getColorScheme = (terpeneName: string) => {
    const colorMap: Record<string, { light: string, mid: string, dark: string }> = {
      "Myrcene": { light: 'bg-green-50', mid: 'bg-green-100', dark: 'text-green-800' },
      "Limonene": { light: 'bg-yellow-50', mid: 'bg-yellow-100', dark: 'text-yellow-800' },
      "Pinene": { light: 'bg-emerald-50', mid: 'bg-emerald-100', dark: 'text-emerald-800' },
      "Linalool": { light: 'bg-purple-50', mid: 'bg-purple-100', dark: 'text-purple-800' },
      "Caryophyllene": { light: 'bg-red-50', mid: 'bg-red-100', dark: 'text-red-800' },
      "Humulene": { light: 'bg-amber-50', mid: 'bg-amber-100', dark: 'text-amber-800' },
      "Terpinolene": { light: 'bg-blue-50', mid: 'bg-blue-100', dark: 'text-blue-800' },
      "Ocimene": { light: 'bg-teal-50', mid: 'bg-teal-100', dark: 'text-teal-800' },
      "Bisabolol": { light: 'bg-pink-50', mid: 'bg-pink-100', dark: 'text-pink-800' },
      "Valencene": { light: 'bg-orange-50', mid: 'bg-orange-100', dark: 'text-orange-800' }
    };

    return colorMap[terpeneName] || { light: 'bg-gray-50', mid: 'bg-gray-100', dark: 'text-gray-800' };
  };

  const colors = getColorScheme(terpene.name);

  // Scientific references based on terpene (simplified for demo)
  const getReferences = (terpeneName: string) => {
    const referenceMap: Record<string, { title: string, url: string, source: string }[]> = {
      "Myrcene": [
        {
          title: "Anti-inflammatory activity of myrcene",
          url: "https://pubmed.ncbi.nlm.nih.gov/21115438/",
          source: "PubMed"
        },
        {
          title: "Myrcene and relaxation effects",
          url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3165946/",
          source: "PMC"
        }
      ],
      "Limonene": [
        {
          title: "D-Limonene: Anti-anxiety effects via A2A receptor modulation",
          url: "https://www.sciencedirect.com/science/article/abs/pii/S0091305713000580",
          source: "ScienceDirect"
        }
      ],
      "Linalool": [
        {
          title: "Anxiolytic-like activity of linalool in mice",
          url: "https://pubmed.ncbi.nlm.nih.gov/19962290/",
          source: "PubMed"
        }
      ]
    };

    return referenceMap[terpeneName] || [];
  };

  const references = getReferences(terpene.name);

  // Common sources for terpene
  const getCommonSources = (terpeneName: string) => {
    const sourceMap: Record<string, string[]> = {
      "Myrcene": ["Mango", "Hops", "Lemongrass", "Thyme", "Bay leaves"],
      "Limonene": ["Citrus fruits", "Rosemary", "Juniper", "Peppermint"],
      "Pinene": ["Pine needles", "Rosemary", "Basil", "Parsley", "Dill"],
      "Linalool": ["Lavender", "Coriander", "Sweet basil", "Birch trees"],
      "Caryophyllene": ["Black pepper", "Cloves", "Cinnamon", "Oregano", "Basil"],
      "Humulene": ["Hops", "Sage", "Ginseng", "Basil"],
      "Terpinolene": ["Lilac", "Cumin", "Nutmeg", "Tea tree", "Apples"],
      "Ocimene": ["Mint", "Parsley", "Kumquats", "Orchids", "Basil"],
      "Bisabolol": ["Chamomile", "Candeia tree"],
      "Valencene": ["Valencia oranges", "Grapefruit", "Tangerines"]
    };

    return sourceMap[terpeneName] || ["Various plants and herbs"];
  };

  const commonSources = getCommonSources(terpene.name);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          style={{ alignItems: 'safe center' }}
        >
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden my-auto mx-4 flex flex-col"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 ${colors.light}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${colors.mid} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`text-xl font-bold ${colors.dark}`}>{terpene.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{terpene.name}</h2>
                    
                    {terpene.aliases && terpene.aliases.length > 0 && (
                      <p className="text-gray-500 text-sm">
                        Also known as: {terpene.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Profile</h3>
                    <div className={`p-4 rounded-xl ${colors.light}`}>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-1">Aroma Profile</h4>
                        <p className="text-gray-800">{terpene.aroma || terpene.profile.aroma.join(', ')}</p>
                      </div>
                      
                      {(terpene.flavorNotes || terpene.profile.flavor.length > 0) && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Flavor Notes</h4>
                          <p className="text-gray-800">{terpene.flavorNotes || terpene.profile.flavor.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Effects</h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {(terpene.effectTags || terpene.effects).map((tag, index) => (
                          <span 
                            key={index} 
                            className={`px-3 py-1.5 rounded-full ${colors.mid} ${colors.dark} text-sm font-medium`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {terpene.therapeuticNotes && (
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-700 mb-1">Therapeutic Notes</h4>
                          <p className="text-gray-800">{terpene.therapeuticNotes}</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div>
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Common Sources</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {commonSources.map((source, index) => (
                        <li key={index} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${colors.mid} mr-2`}></span>
                          <span className="text-gray-800">{source}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                  {references.length > 0 && (
                    <section className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Research & Citations</h3>
                      <ul className="space-y-2">
                        {references.map((reference, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-5 text-center mr-2 text-gray-400">{index + 1}.</span>
                            <div>
                              <a 
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                              >
                                {reference.title}
                                <ExternalLink size={14} className="ml-1" />
                              </a>
                              <p className="text-xs text-gray-500">{reference.source}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Terpene Usage</h3>
                    <div className={`p-4 rounded-xl ${colors.light}`}>
                      <p className="text-sm text-gray-700 mb-3">
                        In the LeafIQ system, {terpene.name} is commonly associated with these vibes:
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {getTerpeneVibes(terpene.name, terpene.effectTags || terpene.effects).map((vibe, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-gray-200 shadow-sm"
                          >
                            {vibe}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Default Intensity</h3>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full ${colors.mid} rounded-full`}
                    style={{ width: `${terpene.defaultIntensity === 'low' ? 33 : terpene.defaultIntensity === 'moderate' ? 66 : 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                This terpene information is used for AI recommendations and product matching in LeafIQ.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to get common vibes associated with a terpene
const getTerpeneVibes = (terpeneName: string, effectTags: string[]): string[] => {
  const defaultVibeMap: Record<string, string[]> = {
    "Myrcene": ["relaxed", "sleepy", "calm"],
    "Limonene": ["energized", "happy", "uplifted"],
    "Pinene": ["focused", "alert", "creative"],
    "Linalool": ["calm", "relaxed", "sleep"],
    "Caryophyllene": ["pain relief", "calm", "relaxed"],
    "Humulene": ["appetite control"],
    "Terpinolene": ["creative", "focused", "uplifted"],
    "Ocimene": ["energized", "uplifted"],
    "Bisabolol": ["calm", "soothing"],
    "Valencene": ["happy", "focused", "uplifted"]
  };

  // Use the default vibes for the terpene if available, otherwise derive from effect tags
  return defaultVibeMap[terpeneName] || 
    effectTags.map(tag => tag.toLowerCase())
      .filter(tag => !tag.includes('anti-') && !tag.includes('relief')); // Filter out therapeutic effects
};

export default TerpeneInfoModal;