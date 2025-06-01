import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskRound as Flask, Plus, Search, Edit, Trash2, Circle as InfoCircle, X, Save, ChevronDown, ChevronUp, Loader2, Upload, Download, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import TerpeneInfoModal from './components/TerpeneInfoModal';
import { TerpeneService } from '../../lib/terpeneService';
import type { Terpene, TerpeneInsert, TerpeneUpdate } from '../../types/terpene';
import { useAuthStore } from '../../stores/authStore';

const TerpeneDatabase: React.FC = () => {
  // Auth state
  const { user, role } = useAuthStore();
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';

  // State management
  const [terpenes, setTerpenes] = useState<Terpene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Terpene>>({});
  const [selectedTerpene, setSelectedTerpene] = useState<Terpene | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportData, setBulkImportData] = useState('');
  const [newTerpene, setNewTerpene] = useState<TerpeneInsert>({
    name: '',
    aroma: [],
    flavor: [],
    common_sources: [],
    effects: [],
    usage_vibes: [],
    therapeutic_notes: '',
    research: [],
    default_intensity: 'moderate'
  });

  // Load terpenes from database
  useEffect(() => {
    loadTerpenes();
  }, []);

  const loadTerpenes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await TerpeneService.getTerpenes();
      setTerpenes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load terpenes');
      console.error('Error loading terpenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTerpenes();
      return;
    }
    
    try {
      setLoading(true);
      const results = await TerpeneService.searchTerpenes(searchTerm);
      setTerpenes(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTerpene = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to add terpenes');
      return;
    }

    try {
      const createdTerpene = await TerpeneService.createTerpene(newTerpene);
      setTerpenes(prev => [...prev, createdTerpene]);
      setShowAddForm(false);
    setNewTerpene({
      name: '',
        aroma: [],
        flavor: [],
        common_sources: [],
        effects: [],
        usage_vibes: [],
        therapeutic_notes: '',
      research: [],
        default_intensity: 'moderate'
    });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create terpene');
    }
  };

  const handleEditTerpene = (terpene: Terpene) => {
    if (!isAuthenticated) {
      setError('You must be logged in to edit terpenes');
      return;
    }
    setEditingId(terpene.id);
    setEditForm({ ...terpene });
  };

  const handleUpdateTerpene = async () => {
    if (!editingId || !editForm.name || !isAuthenticated) return;
    
    try {
      const updatedTerpene = await TerpeneService.updateTerpene({
        id: editingId,
        ...editForm
      });
      setTerpenes(prev => prev.map(t => t.id === editingId ? updatedTerpene : t));
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update terpene');
    }
  };

  const handleDeleteTerpene = async (id: string) => {
    if (!isAuthenticated) {
      setError('You must be logged in to delete terpenes');
      return;
    }

    if (!confirm('Are you sure you want to delete this terpene?')) return;
    
    try {
      await TerpeneService.deleteTerpene(id);
      setTerpenes(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete terpene');
    }
  };

  const handleBulkImport = async () => {
    if (!isAuthenticated || !isAdmin) {
      setError('Admin access required for bulk import');
      return;
    }

    try {
      const terpeneData = JSON.parse(bulkImportData) as TerpeneInsert[];
      const results = await TerpeneService.bulkImportTerpenes(terpeneData);
      
      if (results.errors.length > 0) {
        setError(`Import completed with ${results.errors.length} errors: ${results.errors.join(', ')}`);
      } else {
        setError(null);
      }
      
      await loadTerpenes(); // Refresh the list
      setShowBulkImport(false);
      setBulkImportData('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk import failed');
    }
  };

  const handleExport = async () => {
    try {
      const terpenes = await TerpeneService.exportTerpenes();
      const dataStr = JSON.stringify(terpenes, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'terpenes-export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleViewTerpeneInfo = (terpene: Terpene) => {
    setSelectedTerpene(terpene);
    setShowInfoModal(true);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleArrayInputChange = (value: string, field: keyof Pick<TerpeneInsert, 'aroma' | 'flavor' | 'common_sources' | 'effects' | 'usage_vibes'>) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    if (editingId) {
      setEditForm(prev => ({ ...prev, [field]: arrayValue }));
    } else {
      setNewTerpene(prev => ({ ...prev, [field]: arrayValue }));
    }
  };

  // Loading state
  if (loading && terpenes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading terpenes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Flask className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">Terpene Database</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {terpenes.length} compounds
        </span>
        {!isAuthenticated && (
          <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded">
            Read-only mode (login to edit)
          </span>
        )}
          </div>
          
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Search and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search terpenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
            <Button variant="outline" onClick={loadTerpenes}>
              Show All
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => setShowBulkImport(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
            )}
            {isAuthenticated && (
              <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Terpene
              </Button>
            )}
          </div>
        </div>
        </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Bulk Import Terpenes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Import multiple terpenes from JSON data. Format should be an array of terpene objects.
            </p>
            <textarea
              value={bulkImportData}
              onChange={(e) => setBulkImportData(e.target.value)}
              className="w-full h-64 p-3 border rounded-md font-mono text-sm"
              placeholder={`[
  {
    "name": "Example Terpene",
    "aroma": ["Citrus", "Fresh"],
    "flavor": ["Lemon", "Sweet"],
    "common_sources": ["Lemon", "Orange"],
    "effects": ["Uplifting", "Energizing"],
    "usage_vibes": ["Daytime", "Social"],
    "therapeutic_notes": "May help with mood"
  }
]`}
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleBulkImport} className="bg-emerald-600 hover:bg-emerald-700">
                Import Terpenes
              </Button>
              <Button variant="outline" onClick={() => setShowBulkImport(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Terpene</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newTerpene.name}
                  onChange={(e) => setNewTerpene(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aroma (comma-separated)</label>
                  <input
                    type="text"
                  value={newTerpene.aroma.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'aroma')}
                  className="w-full p-2 border rounded-md"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flavor (comma-separated)</label>
                  <input
                    type="text"
                  value={newTerpene.flavor.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'flavor')}
                  className="w-full p-2 border rounded-md"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">Common Sources (comma-separated)</label>
                  <input
                    type="text"
                  value={newTerpene.common_sources.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'common_sources')}
                  className="w-full p-2 border rounded-md"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Effects (comma-separated)</label>
                      <input
                        type="text"
                  value={newTerpene.effects.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'effects')}
                  className="w-full p-2 border rounded-md"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usage Vibes (comma-separated)</label>
                  <input
                    type="text"
                  value={newTerpene.usage_vibes.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'usage_vibes')}
                  className="w-full p-2 border rounded-md"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">Therapeutic Notes</label>
                <textarea
                  value={newTerpene.therapeutic_notes || ''}
                  onChange={(e) => setNewTerpene(prev => ({ ...prev, therapeutic_notes: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddTerpene} className="bg-emerald-600 hover:bg-emerald-700">
                Add Terpene
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* Terpenes List */}
        <div className="space-y-4">
        {terpenes.map((terpene) => {
          const isExpanded = expandedItems.has(terpene.id);
          const isEditing = editingId === terpene.id;

          return (
            <motion.div
                key={terpene.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
              {/* Header */}
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <button
                  onClick={() => toggleExpanded(terpene.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <Flask className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{terpene.name}</h3>
                    {terpene.aliases && terpene.aliases.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Also known as: {terpene.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewTerpeneInfo(terpene)}
                  >
                    <InfoCircle className="w-4 h-4" />
                  </Button>
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTerpene(terpene)}
                        >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTerpene(terpene.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                    </div>
                    
              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t border-gray-100">
                  {isEditing ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Therapeutic Notes</label>
                        <textarea
                          value={editForm.therapeutic_notes || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, therapeutic_notes: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateTerpene} className="bg-emerald-600 hover:bg-emerald-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                  </div>
                </div>
                  ) : (
                    // View Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Profile</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Aroma:</span> {terpene.aroma.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Flavor:</span> {terpene.flavor.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Effects</h4>
                        <div className="flex flex-wrap gap-1">
                          {terpene.effects.map((effect, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded"
                            >
                              {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Common Sources</h4>
                        <p className="text-sm text-gray-700">{terpene.common_sources.join(', ')}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Usage Vibes</h4>
                        <div className="flex flex-wrap gap-1">
                          {terpene.usage_vibes.map((vibe, idx) => (
                              <span 
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                              {vibe}
                              </span>
                            ))}
                          </div>
                        </div>
                      {terpene.therapeutic_notes && (
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-900 mb-2">Therapeutic Notes</h4>
                          <p className="text-sm text-gray-700">{terpene.therapeutic_notes}</p>
                          </div>
                        )}
                  </div>
                )}
              </div>
          )}
            </motion.div>
          );
        })}
        </div>
        
      {/* Empty State */}
      {terpenes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Flask className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No terpenes found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first terpene'}
          </p>
          {isAuthenticated && (
            <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Terpene
            </Button>
          )}
        </div>
      )}

      {/* Info Modal */}
      {selectedTerpene && (
        <TerpeneInfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          terpene={{
            // Convert our new format to the legacy format expected by the modal
            id: selectedTerpene.id,
            name: selectedTerpene.name,
            aliases: selectedTerpene.aliases || [],
            profile: {
              aroma: selectedTerpene.aroma,
              flavor: selectedTerpene.flavor
            },
            commonSources: selectedTerpene.common_sources,
            effects: selectedTerpene.effects,
            therapeuticNotes: selectedTerpene.therapeutic_notes || '',
            research: selectedTerpene.research || [],
            usageVibes: selectedTerpene.usage_vibes,
            defaultIntensity: selectedTerpene.default_intensity || 'moderate'
          }}
        />
      )}
    </div>
  );
};

export default TerpeneDatabase;