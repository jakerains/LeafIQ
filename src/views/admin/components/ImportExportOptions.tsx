import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload, FileJson, FileText, Database } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface ImportExportOptionsProps {
  onClose: () => void;
}

const ImportExportOptions = ({ onClose }: ImportExportOptionsProps) => {
  const [activeTab, setActiveTab] = useState('import');
  const [importSource, setImportSource] = useState('json');
  const [exportFormat, setExportFormat] = useState('json');
  const [jsonInput, setJsonInput] = useState('');
  const [markdownInput, setMarkdownInput] = useState('');

  const handleImport = () => {
    // In a real app, this would process the import
    if (importSource === 'json') {
      try {
        JSON.parse(jsonInput);
        alert('JSON data imported successfully');
        onClose();
      } catch (error) {
        alert('Invalid JSON format');
      }
    } else if (importSource === 'markdown') {
      if (markdownInput.trim()) {
        alert('Markdown data imported successfully');
        onClose();
      } else {
        alert('Please enter markdown data');
      }
    }
  };

  const handleExport = () => {
    // In a real app, this would generate the export file
    const dummyData = {
      products: [
        { id: 'p001', name: 'Blue Dream', category: 'flower' },
        { id: 'p002', name: 'Cosmic Gummies', category: 'edible' }
      ]
    };
    
    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(dummyData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportName = 'mary_inventory_export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    } else if (exportFormat === 'csv') {
      // Generate CSV format
      let csv = 'id,name,category\n';
      dummyData.products.forEach(product => {
        csv += `${product.id},${product.name},${product.category}\n`;
      });
      
      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
      const exportName = 'mary_inventory_export.csv';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    }
    
    alert('Data exported successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Import/Export Inventory
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'import'
                ? 'bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('import')}
          >
            <Upload size={16} className="inline-block mr-2" />
            Import
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              activeTab === 'export'
                ? 'bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={16} className="inline-block mr-2" />
            Export
          </button>
        </div>
      </div>

      {activeTab === 'import' ? (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Source
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={importSource === 'json'}
                  onChange={() => setImportSource('json')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm">JSON</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="markdown"
                  checked={importSource === 'markdown'}
                  onChange={() => setImportSource('markdown')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm">Markdown</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="api"
                  checked={importSource === 'api'}
                  onChange={() => setImportSource('api')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm">Dutchie API</span>
              </label>
            </div>
          </div>

          {importSource === 'json' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste JSON data:
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder='{"products": [{"id": "p001", "name": "Product Name", ...}]}'
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <FileJson size={14} className="inline-block mr-1" />
                  JSON must contain products array with valid product objects
                </div>
                <label className="flex items-center text-primary-600 hover:text-primary-800 text-sm cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setJsonInput(content || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <Upload size={14} className="mr-1" /> Upload JSON File
                </label>
              </div>
            </div>
          )}

          {importSource === 'markdown' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Markdown data:
              </label>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="# Products\n\n- Product Name (Category) - $10.00\n  THC: 20%, CBD: 1%"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <FileText size={14} className="inline-block mr-1" />
                  Markdown should follow a structured format for proper parsing
                </div>
                <label className="flex items-center text-primary-600 hover:text-primary-800 text-sm cursor-pointer">
                  <input
                    type="file"
                    accept=".md,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          setMarkdownInput(content || '');
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <Upload size={14} className="mr-1" /> Upload Markdown File
                </label>
              </div>
            </div>
          )}

          {importSource === 'api' && (
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start mb-4">
                  <Database size={20} className="text-primary-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Dutchie API Import</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Import your inventory directly from Dutchie using the API integration. 
                      Make sure your API credentials are configured in the Settings tab.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="replace_all"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="replace_all" className="ml-2 text-sm text-gray-700">
                      Replace all existing inventory
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include_images"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked
                    />
                    <label htmlFor="include_images" className="ml-2 text-sm text-gray-700">
                      Include product images
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include_out_of_stock"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="include_out_of_stock" className="ml-2 text-sm text-gray-700">
                      Include out-of-stock products
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button 
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              leftIcon={<Upload size={16} />}
              onClick={handleImport}
            >
              Import Data
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm">JSON</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm">CSV</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Options
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include_variants"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked
                />
                <label htmlFor="include_variants" className="ml-2 text-sm text-gray-700">
                  Include variant data
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include_terpenes"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked
                />
                <label htmlFor="include_terpenes" className="ml-2 text-sm text-gray-700">
                  Include terpene profiles
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include_timestamps"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked
                />
                <label htmlFor="include_timestamps" className="ml-2 text-sm text-gray-700">
                  Include timestamp data
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              leftIcon={<Download size={16} />}
              onClick={handleExport}
            >
              Export Data
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImportExportOptions;