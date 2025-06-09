import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskRound as Flask, Sparkles, Filter, RefreshCw, ArrowRight, Target, Moon, Sun, Coffee, Leaf } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TerpeneService } from '../../lib/terpeneService';
import type { Terpene } from '../../types/terpene';

interface RecommendationParams {
  strainType?: 'indica' | 'sativa' | 'hybrid';
  desiredEffects?: string[];
  desiredVibes?: string[];
  limit?: number;
}

const TerpeneRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Terpene[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<RecommendationParams>({
    strainType: 'hybrid',
    limit: 6
  });
  const [availableEffects, setAvailableEffects] = useState<string[]>([]);
  const [availableVibes, setAvailableVibes] = useState<string[]>([]);

  // Common effects and vibes for selection
  const commonEffects = [
    'Relaxation', 'Pain Relief', 'Sedative', 'Uplifting', 'Energizing',
    'Focus', 'Anti-inflammatory', 'Anxiolytic', 'Euphoric', 'Calming'
  ];

  const commonVibes = [
    'Daytime', 'Evening', 'Social', 'Creative', 'Study', 'Workout',
    'Meditation', 'Party', 'Chill', 'Adventure'
  ];

  useEffect(() => {
    loadRecommendations();
    loadAvailableOptions();
  }, [params]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const recs = await TerpeneService.getRecommendations(params);
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableOptions = async () => {
    try {
      const { data: terpenes } = await TerpeneService.getTerpenes({ limit: 100 });
      
      const effects = new Set<string>();
      const vibes = new Set<string>();
      
      terpenes.forEach(terpene => {
        terpene.effects.forEach(effect => effects.add(effect));
        terpene.usage_vibes.forEach(vibe => vibes.add(vibe));
      });
      
      setAvailableEffects(Array.from(effects).sort());
      setAvailableVibes(Array.from(vibes).sort());
    } catch (err) {
      console.error('Failed to load available options:', err);
    }
  };

  const handleStrainTypeChange = (strainType: 'indica' | 'sativa' | 'hybrid') => {
    setParams(prev => ({ ...prev, strainType }));
  };

  const handleEffectToggle = (effect: string) => {
    setParams(prev => ({
      ...prev,
      desiredEffects: prev.desiredEffects?.includes(effect)
        ? prev.desiredEffects.filter(e => e !== effect)
        : [...(prev.desiredEffects || []), effect]
    }));
  };

  const handleVibeToggle = (vibe: string) => {
    setParams(prev => ({
      ...prev,
      desiredVibes: prev.desiredVibes?.includes(vibe)
        ? prev.desiredVibes.filter(v => v !== vibe)
        : [...(prev.desiredVibes || []), vibe]
    }));
  };

  const getStrainIcon = (type: string) => {
    switch (type) {
      case 'indica': return <Moon className="w-4 h-4" />;
      case 'sativa': return <Sun className="w-4 h-4" />;
      case 'hybrid': return <Leaf className="w-4 h-4" />;
      default: return <Leaf className="w-4 h-4" />;
    }
  };

  const getStrainDescription = (type: string) => {
    switch (type) {
      case 'indica': return 'Relaxing, sedating, body-focused effects';
      case 'sativa': return 'Energizing, uplifting, cerebral effects';
      case 'hybrid': return 'Balanced blend of indica and sativa traits';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Terpene Recommendations</h1>
        </div>
        <Button onClick={loadRecommendations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Recommendation Filters
        </h2>

        {/* Strain Type Selection */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Strain Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['indica', 'sativa', 'hybrid'] as const).map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStrainTypeChange(type)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  params.strainType === type
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStrainIcon(type)}
                  <span className="font-medium capitalize">{type}</span>
                </div>
                <p className="text-sm text-gray-600">{getStrainDescription(type)}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Effects Selection */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Desired Effects</h3>
          <div className="flex flex-wrap gap-2">
            {commonEffects.map((effect) => (
              <motion.button
                key={effect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEffectToggle(effect)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  params.desiredEffects?.includes(effect)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {effect}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Vibes Selection */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Usage Vibes</h3>
          <div className="flex flex-wrap gap-2">
            {commonVibes.map((vibe) => (
              <motion.button
                key={vibe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVibeToggle(vibe)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  params.desiredVibes?.includes(vibe)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {vibe}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Recommended Terpenes
            {recommendations.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({recommendations.length} matches)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-600">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Finding perfect terpenes...</span>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Flask className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-500">Try adjusting your filters to find terpenes that match your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((terpene, index) => (
              <motion.div
                key={terpene.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                {/* Terpene Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Flask className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">{terpene.name}</h3>
                </div>

                {/* Aroma Profile */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Aroma:</span> {terpene.aroma.slice(0, 3).join(', ')}
                    {terpene.aroma.length > 3 && '...'}
                  </p>
                </div>

                {/* Effects */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Effects:</p>
                  <div className="flex flex-wrap gap-1">
                    {terpene.effects.slice(0, 3).map((effect, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded ${
                          params.desiredEffects?.includes(effect)
                            ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {effect}
                      </span>
                    ))}
                    {terpene.effects.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{terpene.effects.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Usage Vibes */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Usage Vibes:</p>
                  <div className="flex flex-wrap gap-1">
                    {terpene.usage_vibes.slice(0, 3).map((vibe, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs rounded ${
                          params.desiredVibes?.includes(vibe)
                            ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {vibe}
                      </span>
                    ))}
                    {terpene.usage_vibes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{terpene.usage_vibes.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score Indicator */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Match Score</span>
                    <div className="flex items-center gap-1">
                      {/* Simple match score based on filter matches */}
                      {[1, 2, 3, 4, 5].map((star) => {
                        const effectMatches = terpene.effects.filter(e => params.desiredEffects?.includes(e)).length;
                        const vibeMatches = terpene.usage_vibes.filter(v => params.desiredVibes?.includes(v)).length;
                        const totalMatches = effectMatches + vibeMatches;
                        const filled = star <= Math.min(5, Math.max(1, totalMatches));
                        
                        return (
                          <Sparkles
                            key={star}
                            className={`w-3 h-3 ${
                              filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Presets */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setParams({
              strainType: 'indica',
              desiredEffects: ['Relaxation', 'Pain Relief', 'Sedative'],
              desiredVibes: ['Evening', 'Chill'],
              limit: 6
            })}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              <span className="font-medium">Evening Relaxation</span>
            </div>
            <p className="text-sm text-gray-600">Perfect for winding down after a long day</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setParams({
              strainType: 'sativa',
              desiredEffects: ['Uplifting', 'Energizing', 'Focus'],
              desiredVibes: ['Daytime', 'Creative', 'Workout'],
              limit: 6
            })}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Daytime Energy</span>
            </div>
            <p className="text-sm text-gray-600">Boost energy and creativity for productive days</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setParams({
              strainType: 'hybrid',
              desiredEffects: ['Euphoric', 'Uplifting', 'Calming'],
              desiredVibes: ['Social', 'Party', 'Adventure'],
              limit: 6
            })}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 transition-all text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">Social Balance</span>
            </div>
            <p className="text-sm text-gray-600">Perfect balance for social activities and fun</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TerpeneRecommendations;