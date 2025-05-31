import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Save, RefreshCw, Play, PlusCircle, Trash2, FlaskRound as Flask } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { vibesToTerpenes } from '../../data/demoData';
import TerpeneTabs from './components/TerpeneTabs';
import TerpeneDatabase from './TerpeneDatabase';

const AdminAIModel = () => {
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [mappings, setMappings] = useState(Object.entries(vibesToTerpenes).map(([vibe, data]) => ({
    vibe,
    terpenes: data.terpenes,
    effects: data.effects
  })));

  const [newMapping, setNewMapping] = useState({
    vibe: '',
    terpenes: {
      myrcene: 0.5,
      limonene: 0.5,
      pinene: 0.5,
      caryophyllene: 0.5,
      linalool: 0.0
    },
    effects: ['Custom Effect']
  });

  const [activeTab, setActiveTab] = useState<'mapping' | 'database'>('mapping');

  const handleTestModel = () => {
    if (!testQuery) return;
    
    setIsTestingModel(true);
    
    // Simulate API call to test model
    setTimeout(() => {
      // Generate mock results based on the query
      const results = {
        query: testQuery,
        matchedVibe: Object.keys(vibesToTerpenes).find(vibe => 
          testQuery.toLowerCase().includes(vibe.toLowerCase())
        ) || 'custom',
        recommendations: [
          { productId: 'p001', confidence: 0.92, reason: 'Terpene profile matches relaxation needs' },
          { productId: 'p006', confidence: 0.87, reason: 'Strong myrcene content aligns with query' },
          { productId: 'p010', confidence: 0.82, reason: 'Balanced profile suitable for desired effects' }
        ],
        effects: ['Relaxation', 'Stress Relief'],
        isAIPowered: true,
        executionTimeMs: 423
      };
      
      setTestResults(results);
      setIsTestingModel(false);
    }, 2000);
  };

  const handleAddMapping = () => {
    if (!newMapping.vibe.trim()) return;
    
    setMappings([...mappings, { ...newMapping }]);
    setNewMapping({
      vibe: '',
      terpenes: {
        myrcene: 0.5,
        limonene: 0.5,
        pinene: 0.5,
        caryophyllene: 0.5,
        linalool: 0.0
      },
      effects: ['Custom Effect']
    });
  };

  const handleRemoveMapping = (index: number) => {
    const newMappings = [...mappings];
    newMappings.splice(index, 1);
    setMappings(newMappings);
  };

  const handleChangeTerpene = (index: number, terpene: string, value: number) => {
    const newMappings = [...mappings];
    newMappings[index].terpenes = {
      ...newMappings[index].terpenes,
      [terpene]: value
    };
    setMappings(newMappings);
  };

  const handleChangeEffect = (index: number, effectIndex: number, value: string) => {
    const newMappings = [...mappings];
    newMappings[index].effects[effectIndex] = value;
    setMappings(newMappings);
  };

  const handleAddEffect = (index: number) => {
    const newMappings = [...mappings];
    newMappings[index].effects.push('New Effect');
    setMappings(newMappings);
  };

  const handleRemoveEffect = (index: number, effectIndex: number) => {
    const newMappings = [...mappings];
    newMappings[index].effects.splice(effectIndex, 1);
    setMappings(newMappings);
  };

  const handleSaveMappings = () => {
    // In a real app, this would send the mappings to the API
    alert('Vibe mappings saved successfully');
  };

  if (activeTab === 'database') {
    return (
      <div className="space-y-6">
        <TerpeneTabs activeTab={activeTab} onChange={setActiveTab} />
        <TerpeneDatabase />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TerpeneTabs activeTab={activeTab} onChange={setActiveTab} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <BrainCircuit size={20} className="text-primary-600" />
            <h2 className="text-xl font-semibold">AI Model Testing</h2>
          </div>
          
          <div className="mb-6">
            <label htmlFor="test_query" className="block text-sm font-medium text-gray-700 mb-1">
              Test Query
            </label>
            <div className="flex">
              <input
                type="text"
                id="test_query"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="e.g., I want to feel relaxed but not sleepy"
                className="flex-1 px-4 py-2 bg-white rounded-l-xl border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button
                onClick={handleTestModel}
                className="rounded-l-none"
                isLoading={isTestingModel}
                disabled={!testQuery || isTestingModel}
                leftIcon={<Play size={16} />}
              >
                Test
              </Button>
            </div>
          </div>
          
          {testResults && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">Test Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Query</p>
                  <p className="font-medium">{testResults.query}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Matched Vibe</p>
                  <p className="font-medium">{testResults.matchedVibe}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Detected Effects</p>
                  <div className="flex flex-wrap gap-1">
                    {testResults.effects.map((effect: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Response Time</p>
                  <p className="font-medium">{testResults.executionTimeMs}ms</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Recommended Products</p>
                <ul className="space-y-2">
                  {testResults.recommendations.map((rec: any, i: number) => (
                    <li key={i} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between">
                      <div>
                        <p className="font-medium">Product ID: {rec.productId}</p>
                        <p className="text-sm text-gray-600">{rec.reason}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {(rec.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <RefreshCw size={20} className="text-primary-600" />
              <h2 className="text-xl font-semibold">Vibe to Terpene Mappings</h2>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                leftIcon={<Flask size={16} />}
                onClick={() => setActiveTab('database')}
              >
                Terpene Database
              </Button>
              
              <Button
                onClick={handleSaveMappings}
                leftIcon={<Save size={16} />}
              >
                Save Mappings
              </Button>
            </div>
          </div>
          
          <div className="space-y-6 mb-8">
            {mappings.map((mapping, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveMapping(index)}
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vibe Keyword
                    </label>
                    <input
                      type="text"
                      value={mapping.vibe}
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        newMappings[index].vibe = e.target.value;
                        setMappings(newMappings);
                      }}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terpene Profile
                    </label>
                    <div className="space-y-2">
                      {Object.entries(mapping.terpenes).map(([terpene, value]) => (
                        <div key={terpene} className="flex items-center">
                          <span className="w-24 text-sm">{terpene.charAt(0).toUpperCase() + terpene.slice(1)}</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={value}
                            onChange={(e) => handleChangeTerpene(index, terpene, parseFloat(e.target.value))}
                            className="flex-1 mx-2"
                          />
                          <span className="w-12 text-right text-sm">{value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Effects
                      </label>
                      <button
                        onClick={() => handleAddEffect(index)}
                        className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                      >
                        <PlusCircle size={14} className="mr-1" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {mapping.effects.map((effect, effectIndex) => (
                        <div key={effectIndex} className="flex items-center">
                          <input
                            type="text"
                            value={effect}
                            onChange={(e) => handleChangeEffect(index, effectIndex, e.target.value)}
                            className="flex-1 px-3 py-1 text-sm bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <button
                            onClick={() => handleRemoveEffect(index, effectIndex)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-medium mb-3">Add New Mapping</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vibe Keyword
                </label>
                <input
                  type="text"
                  value={newMapping.vibe}
                  onChange={(e) => setNewMapping({ ...newMapping, vibe: e.target.value })}
                  placeholder="e.g., energetic"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terpene Profile
                </label>
                <div className="space-y-2">
                  {Object.entries(newMapping.terpenes).map(([terpene, value]) => (
                    <div key={terpene} className="flex items-center">
                      <span className="w-24 text-sm">{terpene.charAt(0).toUpperCase() + terpene.slice(1)}</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={value}
                        onChange={(e) => setNewMapping({
                          ...newMapping,
                          terpenes: {
                            ...newMapping.terpenes,
                            [terpene]: parseFloat(e.target.value)
                          }
                        })}
                        className="flex-1 mx-2"
                      />
                      <span className="w-12 text-right text-sm">{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effects
                </label>
                <div className="space-y-2">
                  {newMapping.effects.map((effect, effectIndex) => (
                    <div key={effectIndex} className="flex items-center">
                      <input
                        type="text"
                        value={effect}
                        onChange={(e) => {
                          const newEffects = [...newMapping.effects];
                          newEffects[effectIndex] = e.target.value;
                          setNewMapping({ ...newMapping, effects: newEffects });
                        }}
                        className="flex-1 px-3 py-1 text-sm bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={() => {
                          const newEffects = [...newMapping.effects];
                          newEffects.splice(effectIndex, 1);
                          setNewMapping({ ...newMapping, effects: newEffects });
                        }}
                        className="ml-2 text-gray-400 hover:text-red-500"
                        disabled={newMapping.effects.length <= 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewMapping({
                      ...newMapping,
                      effects: [...newMapping.effects, 'New Effect']
                    })}
                    className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                  >
                    <PlusCircle size={14} className="mr-1" /> Add Effect
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAddMapping}
                disabled={!newMapping.vibe.trim()}
                leftIcon={<PlusCircle size={16} />}
              >
                Add Mapping
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAIModel;