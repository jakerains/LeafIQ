import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskRound as Flask, TrendingUp, Users, Calendar, Filter, BarChart3, PieChart, Sparkles, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TerpeneService } from '../../lib/terpeneService';
import type { Terpene } from '../../types/terpene';

interface TerpeneAnalytics {
  total: number;
  byEffects: Record<string, number>;
  byVibes: Record<string, number>;
  recentlyAdded: Terpene[];
}

const TerpeneAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<TerpeneAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'effects' | 'vibes'>('effects');
  const [recommendations, setRecommendations] = useState<Terpene[]>([]);

  useEffect(() => {
    loadAnalytics();
    loadRecommendations();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await TerpeneService.getTerpeneAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recs = await TerpeneService.getRecommendations({
        strainType: 'hybrid',
        limit: 5
      });
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-gray-600">
          <Flask className="w-5 h-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <Flask className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
        <p className="text-gray-500">{error || 'Failed to load analytics data'}</p>
      </div>
    );
  }

  const topEffects = Object.entries(analytics.byEffects)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const topVibes = Object.entries(analytics.byVibes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const maxCount = Math.max(
    ...Object.values(analytics.byEffects),
    ...Object.values(analytics.byVibes)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Terpene Analytics</h1>
        </div>
        <Button variant="outline" onClick={loadAnalytics}>
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Terpenes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Compounds</p>
              <p className="text-3xl font-bold">{analytics.total}</p>
            </div>
            <Flask className="w-8 h-8 text-emerald-200" />
          </div>
        </motion.div>

        {/* Unique Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Unique Effects</p>
              <p className="text-3xl font-bold">{Object.keys(analytics.byEffects).length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        {/* Usage Vibes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Usage Vibes</p>
              <p className="text-3xl font-bold">{Object.keys(analytics.byVibes).length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        {/* Recently Added */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Recently Added</p>
              <p className="text-3xl font-bold">{analytics.recentlyAdded.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effects/Vibes Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedFilter === 'effects' ? 'Top Effects' : 'Top Usage Vibes'}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'effects' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('effects')}
              >
                Effects
              </Button>
              <Button
                variant={selectedFilter === 'vibes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('vibes')}
              >
                Vibes
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {(selectedFilter === 'effects' ? topEffects : topVibes).map(([name, count], index) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700 truncate">
                  {name}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      selectedFilter === 'effects'
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                        : 'bg-gradient-to-r from-purple-400 to-purple-500'
                    }`}
                  />
                </div>
                <div className="w-8 text-sm font-semibold text-gray-900">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recently Added Terpenes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Added</h2>
          <div className="space-y-4">
            {analytics.recentlyAdded.map((terpene, index) => (
              <motion.div
                key={terpene.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Flask className="w-5 h-5 text-emerald-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{terpene.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {terpene.effects.slice(0, 3).map((effect, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded"
                      >
                        {effect}
                      </span>
                    ))}
                    {terpene.effects.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        +{terpene.effects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended Terpenes</h2>
            <span className="text-sm text-gray-500">(for hybrid strains)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((terpene, index) => (
              <motion.div
                key={terpene.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flask className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-medium text-gray-900">{terpene.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {terpene.aroma.slice(0, 2).join(', ')}
                  {terpene.aroma.length > 2 && '...'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {terpene.effects.slice(0, 2).map((effect, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Flask className="w-4 h-4 mr-2" />
            Add New Terpene
          </Button>
          <Button variant="outline">
            <PieChart className="w-4 h-4 mr-2" />
            Export Analytics
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Advanced Search
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TerpeneAnalyticsDashboard; 