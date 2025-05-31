import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flask, Plus, Search, Edit, Trash2, InfoCircle, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import TerpeneInfoModal from './components/TerpeneInfoModal';

// Terpene interface
interface Terpene {
  id: string;
  name: string;
  aliases: string[];
  aroma: string;
  flavorNotes: string;
  effectTags: string[];
  therapeuticNotes: string;
  defaultIntensity: number;
}

// Initial terpene data based on the provided guide
const initialTerpenes: Terpene[] = [
  {
    id: 'terpene-1',
    name: 'Myrcene',
    aliases: [],
    aroma: 'Earthy, musky, cloves',
    flavorNotes: 'Ripe mango, herbal',
    effectTags: ['Sedative', 'Pain Relief', 'Relaxation'],
    therapeuticNotes: 'Anxiolytic, muscle-relaxant, anti-inflammatory',
    defaultIntensity: 0.7
  },
  {
    id: 'terpene-2',
    name: 'Limonene',
    aliases: [],
    aroma: 'Bright citrus zest',
    flavorNotes: 'Lemon, orange',
    effectTags: ['Uplift', 'Mood-Boost', 'Stress Relief'],
    therapeuticNotes: 'Antidepressant & anti-anxiety via A2A receptor',
    defaultIntensity: 0.6
  },
  {
    id: 'terpene-3',
    name: 'Pinene',
    aliases: ['α-Pinene', 'β-Pinene'],
    aroma: 'Pine needles, rosemary, crisp forest',
    flavorNotes: 'Woody, sharp, pine',
    effectTags: ['Focus', 'Alert', 'Memory Aid'],
    therapeuticNotes: 'Bronchodilator; may counter THC memory fog; anti-inflammatory',
    defaultIntensity: 0.5
  },
  {
    id: 'terpene-4',
    name: 'Linalool',
    aliases: [],
    aroma: 'Lavender, floral, spicy undertone',
    flavorNotes: 'Floral, sweet',
    effectTags: ['Calm', 'Sleep', 'Anti-Anxiety'],
    therapeuticNotes: 'Sedative, anticonvulsant, may reduce anxiety—great for "calm"',
    defaultIntensity: 0.7
  },
  {
    id: 'terpene-5',
    name: 'Caryophyllene',
    aliases: ['β-Caryophyllene'],
    aroma: 'Peppercorn, spice, wood',
    flavorNotes: 'Peppery, spicy, warm',
    effectTags: ['Relief', 'Anti-Inflammatory', 'Relax'],
    therapeuticNotes: 'Selective CB₂ agonist; tissue-protective, analgesic',
    defaultIntensity: 0.5
  },
  {
    id: 'terpene-6',
    name: 'Humulene',
    aliases: ['α-Humulene'],
    aroma: 'Hops, woody, herbal',
    flavorNotes: 'Earthy, woody',
    effectTags: ['Appetite Suppression', 'Anti-Bacterial'],
    therapeuticNotes: 'Possible weight-management & GI support',
    defaultIntensity: 0.4
  },
  {
    id: 'terpene-7',
    name: 'Terpinolene',
    aliases: [],
    aroma: 'Pine-citrus, fresh herbs, lilac',
    flavorNotes: 'Fresh, herbal',
    effectTags: ['Creative Spark', 'Light Energy', 'Clear Mind'],
    therapeuticNotes: 'Synergistic antioxidant; can feel uplifting yet calm',
    defaultIntensity: 0.5
  },
  {
    id: 'terpene-8',
    name: 'Ocimene',
    aliases: [],
    aroma: 'Sweet herb-mint, fruity',
    flavorNotes: 'Sweet, herbal',
    effectTags: ['Energize', 'Social Ease', 'Decongest'],
    therapeuticNotes: 'Decongestant & antioxidant; mild stimulant',
    defaultIntensity: 0.4
  },
  {
    id: 'terpene-9',
    name: 'Bisabolol',
    aliases: ['α-Bisabolol'],
    aroma: 'Chamomile, sweet floral',
    flavorNotes: 'Floral, sweet',
    effectTags: ['Soothing', 'Skin Relief', 'Relax'],
    therapeuticNotes: 'Anti-inflammatory & skin-healing; gentle muscle relaxation',
    defaultIntensity: 0.3
  },
  {
    id: 'terpene-10',
    name: 'Valencene',
    aliases: [],
    aroma: 'Tangy orange-grapefruit',
    flavorNotes: 'Citrus, fresh',
    effectTags: ['Focus', 'Day-Bright', 'Anti-Inflammatory'],
    therapeuticNotes: 'Antioxidant & anti-inflammatory; citrus uplift',
    defaultIntensity: 0.5
  }
];

const TerpeneDatabase: React.FC = () => {
  // State variables
  const [terpenes, setTerpenes] = useState<Terpene[]>(initialTerpenes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTerpene, setIsAddingTerpene] = useState(false);
  const [editingTerpeneId, setEditingTerpeneId] = useState<string | null>(null);
  const [selectedTerpene, setSelectedTerpene] = useState<Terpene | null>(null);
  const [showTerpeneInfo, setShowTerpeneInfo] = useState(false);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  
  // New terpene form state
  const [newTerpene, setNewTerpene] = useState<Omit<Terpene, 'id'>>({
    name: '',
    aliases: [],
    aroma: '',
    flavorNotes: '',
    effectTags: [''],
    therapeuticNotes: '',
    defaultIntensity: 0.5
  });

  // Filtered terpenes based on search term
  const filteredTerpenes = terpenes.filter(terpene => 
    terpene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terpene.aroma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terpene.effectTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle new terpene form input change
  const handleNewTerpeneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<Terpene, 'id' | 'aliases' | 'effectTags'>
  ) => {
    setNewTerpene(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Handle aliases change
  const handleAliasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const aliases = e.target.value.split(',').map(alias => alias.trim()).filter(alias => alias);
    setNewTerpene(prev => ({
      ...prev,
      aliases
    }));
  };

  // Handle effect tags change
  const handleEffectTagChange = (index: number, value: string) => {
    setNewTerpene(prev => {
      const updatedTags = [...prev.effectTags];
      updatedTags[index] = value;
      return { ...prev, effectTags: updatedTags };
    });
  };

  // Add new effect tag field
  const addEffectTagField = () => {
    setNewTerpene(prev => ({
      ...prev,
      effectTags: [...prev.effectTags, '']
    }));
  };

  // Remove effect tag field
  const removeEffectTagField = (index: number) => {
    setNewTerpene(prev => {
      const updatedTags = [...prev.effectTags];
      updatedTags.splice(index, 1);
      return { ...prev, effectTags: updatedTags.length ? updatedTags : [''] }; // Ensure at least one empty field
    });
  };

  // Add new terpene
  const handleAddTerpene = () => {
    if (!newTerpene.name.trim()) return;

    const newTerpeneEntry: Terpene = {
      ...newTerpene,
      id: `terpene-${Date.now()}`,
      effectTags: newTerpene.effectTags.filter(tag => tag.trim())
    };

    setTerpenes([...terpenes, newTerpeneEntry]);
    
    // Reset form
    setNewTerpene({
      name: '',
      aliases: [],
      aroma: '',
      flavorNotes: '',
      effectTags: [''],
      therapeuticNotes: '',
      defaultIntensity: 0.5
    });
    
    setIsAddingTerpene(false);
  };

  // Edit terpene
  const handleEditTerpene = (id: string) => {
    const terpeneToEdit = terpenes.find(t => t.id === id);
    if (!terpeneToEdit) return;
    
    // Pre-fill form with terpene data
    setNewTerpene({
      name: terpeneToEdit.name,
      aliases: terpeneToEdit.aliases,
      aroma: terpeneToEdit.aroma,
      flavorNotes: terpeneToEdit.flavorNotes,
      effectTags: terpeneToEdit.effectTags.length ? terpeneToEdit.effectTags : [''],
      therapeuticNotes: terpeneToEdit.therapeuticNotes,
      defaultIntensity: terpeneToEdit.defaultIntensity
    });
    
    setEditingTerpeneId(id);
    setIsAddingTerpene(true);
  };

  // Update terpene
  const handleUpdateTerpene = () => {
    if (!editingTerpeneId) return;

    setTerpenes(prev => 
      prev.map(terpene => 
        terpene.id === editingTerpeneId 
          ? {
              ...terpene, 
              name: newTerpene.name,
              aliases: newTerpene.aliases,
              aroma: newTerpene.aroma,
              flavorNotes: newTerpene.flavorNotes,
              effectTags: newTerpene.effectTags.filter(tag => tag.trim()),
              therapeuticNotes: newTerpene.therapeuticNotes,
              defaultIntensity: newTerpene.defaultIntensity
            }
          : terpene
      )
    );
    
    // Reset form and editing state
    setNewTerpene({
      name: '',
      aliases: [],
      aroma: '',
      flavorNotes: '',
      effectTags: [''],
      therapeuticNotes: '',
      defaultIntensity: 0.5
    });
    
    setEditingTerpeneId(null);
    setIsAddingTerpene(false);
  };

  // Delete terpene
  const handleDeleteTerpene = (id: string) => {
    if (window.confirm('Are you sure you want to delete this terpene?')) {
      setTerpenes(terpenes.filter(terpene => terpene.id !== id));
    }
  };

  // View terpene info
  const handleViewTerpeneInfo = (terpene: Terpene) => {
    setSelectedTerpene(terpene);
    setShowTerpeneInfo(true);
  };

  // Toggle expanded state for a terpene
  const toggleExpanded = (id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Save all terpenes
  const handleSaveAll = () => {
    // In a real app, this would save to the database
    alert('All terpenes saved successfully!');
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Flask size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">Terpene Database</h2>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSaveAll}
              leftIcon={<Save size={16} />}
            >
              Save All Changes
            </Button>
            <Button
              onClick={() => setIsAddingTerpene(true)}
              leftIcon={<Plus size={16} />}
              disabled={isAddingTerpene}
            >
              Add Terpene
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search terpenes by name, aroma or effect..."
            className="pl-10 w-full px-4 py-2 bg-white rounded-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Add/Edit Terpene Form */}
        {isAddingTerpene && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingTerpeneId ? 'Edit Terpene' : 'Add New Terpene'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingTerpene(false);
                  setEditingTerpeneId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terpene Name*
                  </label>
                  <input
                    type="text"
                    value={newTerpene.name}
                    onChange={(e) => handleNewTerpeneChange(e, 'name')}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Myrcene"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aliases (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTerpene.aliases.join(', ')}
                    onChange={handleAliasesChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., β-Myrcene, Myrcia"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aroma Description*
                  </label>
                  <input
                    type="text"
                    value={newTerpene.aroma}
                    onChange={(e) => handleNewTerpeneChange(e, 'aroma')}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Earthy, musky, cloves"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flavor Notes
                  </label>
                  <input
                    type="text"
                    value={newTerpene.flavorNotes}
                    onChange={(e) => handleNewTerpeneChange(e, 'flavorNotes')}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Ripe mango, herbal"
                  />
                </div>
              </div>
              
              {/* Effects & Notes */}
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Effect Tags*
                    </label>
                    <button
                      type="button"
                      onClick={addEffectTagField}
                      className="text-xs text-primary-600 hover:text-primary-800"
                    >
                      + Add Tag
                    </button>
                  </div>
                  
                  {newTerpene.effectTags.map((tag, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleEffectTagChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`e.g., Relaxation${index > 0 ? '' : ' (required)'}`}
                        required={index === 0}
                      />
                      {newTerpene.effectTags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEffectTagField(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Therapeutic Notes
                  </label>
                  <textarea
                    value={newTerpene.therapeuticNotes}
                    onChange={(e) => handleNewTerpeneChange(e, 'therapeuticNotes')}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Anxiolytic, muscle-relaxant, anti-inflammatory"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Intensity: {newTerpene.defaultIntensity.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newTerpene.defaultIntensity}
                    onChange={(e) => setNewTerpene(prev => ({
                      ...prev,
                      defaultIntensity: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.0</span>
                    <span>0.5</span>
                    <span>1.0</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingTerpene(false);
                  setEditingTerpeneId(null);
                }}
              >
                Cancel
              </Button>
              
              <Button
                onClick={editingTerpeneId ? handleUpdateTerpene : handleAddTerpene}
                disabled={!newTerpene.name.trim() || !newTerpene.effectTags[0]?.trim()}
              >
                {editingTerpeneId ? 'Update Terpene' : 'Add Terpene'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Terpenes List */}
        <div className="space-y-4">
          {filteredTerpenes.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <Flask size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No terpenes found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search" : "Add your first terpene to get started"}
              </p>
            </div>
          ) : (
            filteredTerpenes.map(terpene => (
              <div 
                key={terpene.id} 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => toggleExpanded(terpene.id)}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full mr-4 flex items-center justify-center",
                      terpene.name === "Myrcene" ? "bg-green-100 text-green-700" :
                      terpene.name === "Limonene" ? "bg-yellow-100 text-yellow-700" :
                      terpene.name === "Pinene" ? "bg-emerald-100 text-emerald-700" :
                      terpene.name === "Linalool" ? "bg-purple-100 text-purple-700" :
                      terpene.name === "Caryophyllene" ? "bg-red-100 text-red-700" :
                      terpene.name === "Humulene" ? "bg-amber-100 text-amber-700" :
                      terpene.name === "Terpinolene" ? "bg-blue-100 text-blue-700" :
                      terpene.name === "Ocimene" ? "bg-teal-100 text-teal-700" :
                      terpene.name === "Bisabolol" ? "bg-pink-100 text-pink-700" :
                      terpene.name === "Valencene" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      <span className="font-semibold text-sm">{terpene.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{terpene.name}</h3>
                      <p className="text-sm text-gray-500">{terpene.aroma}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className="flex -space-x-1 mr-4">
                      {terpene.effectTags.slice(0, 3).map((tag, i) => (
                        <span 
                          key={`${terpene.id}-tag-${i}`}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium border-2 border-white",
                            i === 0 ? "bg-primary-100 text-primary-800" : 
                            i === 1 ? "bg-secondary-100 text-secondary-800" : 
                            "bg-accent-100 text-accent-800"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                      {terpene.effectTags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border-2 border-white">
                          +{terpene.effectTags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {isExpanded[terpene.id] ? 
                      <ChevronUp size={18} className="text-gray-400" /> : 
                      <ChevronDown size={18} className="text-gray-400" />
                    }
                  </div>
                </div>
                
                {/* Expanded View */}
                {isExpanded[terpene.id] && (
                  <div className="px-5 pt-2 pb-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Aroma & Flavor</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Aroma:</span> {terpene.aroma}
                        </p>
                        {terpene.flavorNotes && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Flavor Notes:</span> {terpene.flavorNotes}
                          </p>
                        )}
                        
                        {terpene.aliases.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Also Known As:</p>
                            <div className="flex flex-wrap gap-2">
                              {terpene.aliases.map((alias, i) => (
                                <span key={`alias-${i}`} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-700">
                                  {alias}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Effects & Benefits</h4>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 mb-1">Effect Tags:</p>
                          <div className="flex flex-wrap gap-2">
                            {terpene.effectTags.map((tag, i) => (
                              <span 
                                key={`effect-${i}`}
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  i % 3 === 0 ? "bg-primary-100 text-primary-800" : 
                                  i % 3 === 1 ? "bg-secondary-100 text-secondary-800" : 
                                  "bg-accent-100 text-accent-800"
                                )}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {terpene.therapeuticNotes && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Therapeutic Notes:</p>
                            <p className="text-sm text-gray-600">{terpene.therapeuticNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        onClick={() => handleViewTerpeneInfo(terpene)}
                        className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
                      >
                        <InfoCircle size={16} />
                        <span>Full Details</span>
                      </button>
                      
                      <button
                        onClick={() => handleEditTerpene(terpene.id)}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTerpene(terpene.id)}
                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Quick Stats at Bottom */}
        <div className="mt-6 flex justify-between text-sm text-gray-500 px-2">
          <span>{filteredTerpenes.length} terpenes</span>
          
          {searchTerm && (
            <button
              className="text-primary-600 hover:text-primary-800 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X size={14} className="mr-1" /> Clear search
            </button>
          )}
        </div>
      </motion.div>

      {/* Terpene Info Modal */}
      {selectedTerpene && (
        <TerpeneInfoModal
          isOpen={showTerpeneInfo}
          onClose={() => setShowTerpeneInfo(false)}
          terpene={selectedTerpene}
        />
      )}
    </div>
  );
};

export default TerpeneDatabase;