import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload, FileJson, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import ImportExportInstructions from './ImportExportInstructions';
import { importInventoryData, exportInventoryData, validateImportData, ImportResult, ImportMode } from '../../../utils/inventoryImporter';
import { parseMarkdownToImportData, parseMultipleMarkdownFiles } from '../../../utils/markdownInventoryParser';
import { useAuthStore } from '../../../stores/authStore';
import { useSimpleAuthStore } from '../../../stores/simpleAuthStore';
import { useProductsStore } from '../../../stores/productsStore';

interface ImportExportOptionsProps {
  onClose: () => void;
}

const ImportExportOptions = ({ onClose }: ImportExportOptionsProps) => {
  const [activeTab, setActiveTab] = useState('import');
  const [importSource, setImportSource] = useState('json');
  const [exportFormat, setExportFormat] = useState('json');
  const [jsonInput, setJsonInput] = useState('');
  const [markdownInput, setMarkdownInput] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('update');
  
  const { user } = useAuthStore();
  const { organizationId } = useSimpleAuthStore();
  
  // Log organization ID when component mounts
  useEffect(() => {
    console.log('🔍 DEBUG ImportExportOptions - Component mounted with:', {
      organizationId,
      authStoreUserId: user?.id
    });
  }, [organizationId, user?.id]);

  const handleImport = async () => {
    console.log('🔍 DEBUG ImportExportOptions - handleImport called with:', {
      organizationId,
      authStoreUserId: user?.id,
      authStoreOrgId: user?.organizationId
    });
    
    // Try to use organizationId from simpleAuthStore first, then fall back to user.organizationId
    const effectiveOrgId = organizationId || user?.organizationId;
    
    if (!effectiveOrgId) {
      console.error('🔍 DEBUG ImportExportOptions - No organization ID found in either store');
      setImportResult({
        success: false,
        message: 'No organization found. Please contact support.',
      });
      return;
    }

    setIsProcessing(true);
    setImportResult(null);

    try {
    if (importSource === 'json') {
        if (!jsonInput.trim()) {
          console.log('🔍 DEBUG ImportExportOptions - Empty JSON input');
          setImportResult({
            success: false,
            message: 'Please enter JSON data or upload a file',
          });
          return;
        }

        let parsedData;
      try {
          parsedData = JSON.parse(jsonInput);
          console.log('🔍 DEBUG ImportExportOptions - Successfully parsed JSON data');
        } catch (error) {
          console.error('🔍 DEBUG ImportExportOptions - JSON parse error:', error);
          setImportResult({
            success: false,
            message: 'Invalid JSON format. Please check your syntax.',
          });
          return;
        }

        // Validate the data structure
        const validation = validateImportData(parsedData);
        if (!validation.valid) {
          console.log('🔍 DEBUG ImportExportOptions - JSON validation failed:', validation.errors);
          setImportResult({
            success: false,
            message: `Validation failed: ${validation.errors.join(', ')}`,
          });
          return;
        }

        // Import the data
        const result = await importInventoryData(
          parsedData,
          effectiveOrgId,
          importMode
        );

        console.log('🔍 DEBUG ImportExportOptions - Import result:', result);
        setImportResult(result);

        // Refresh the products store if successful
        if (result.success) {
          await fetchProducts();
          setTimeout(() => {
        onClose();
          }, 3000);
      }

    } else if (importSource === 'markdown') {
        if (!markdownInput.trim()) {
          setImportResult({
            success: false,
            message: 'Please enter markdown data or upload a file',
          });
          return;
        }

        try {
          // Parse markdown to JSON format
          const parsedData = parseMarkdownToImportData(
            markdownInput,
            effectiveOrgId
          );

          if (parsedData.products.length === 0) {
            console.log('🔍 DEBUG ImportExportOptions - No products found in markdown');
            setImportResult({
              success: false,
              message: 'No products found in markdown. Please check the format.',
            });
            return;
          }

          // Import the parsed data
          const result = await importInventoryData(
            parsedData,
            effectiveOrgId,
            importMode
          );

          console.log('🔍 DEBUG ImportExportOptions - Markdown import result:', result);
          setImportResult(result);

          // Refresh the products store if successful
          if (result.success) {
            await fetchProducts();
            setTimeout(() => {
        onClose();
            }, 3000);
          }

        } catch (error) {
          console.error('🔍 DEBUG ImportExportOptions - Markdown parsing failed:', error);
          setImportResult({
            success: false,
            message: `Markdown parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      } else if (importSource === 'api') {
        console.log('🔍 DEBUG ImportExportOptions - Dutchie API import not implemented');
        setImportResult({
          success: false,
          message: 'Dutchie API import is not yet implemented. Please use JSON format.',
        });
      }
    } catch (error) {
      console.error('🔍 DEBUG ImportExportOptions - Import failed:', error);
      setImportResult({
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    const effectiveOrgId = organizationId || user?.organizationId;
    
    if (!effectiveOrgId) {
      console.error('🔍 DEBUG ImportExportOptions - No organization ID found for export');
      alert('No organization found. Please contact support.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔍 DEBUG ImportExportOptions - Starting export with organizationId:', effectiveOrgId);
      const exportData = await exportInventoryData(effectiveOrgId);
      
      if (!exportData) {
        console.log('🔍 DEBUG ImportExportOptions - No inventory data found to export');
        alert('No inventory data found to export.');
        return;
      }
    
    if (exportFormat === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportName = `leafiq_inventory_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
        
        alert(`Exported ${exportData.products.length} products successfully!`);
    } else if (exportFormat === 'csv') {
      // Generate CSV format
        let csv = 'product_id,product_name,brand,category,variant_id,size_weight,price,thc_percentage,cbd_percentage,inventory_level,is_available\n';
        
        exportData.products.forEach(product => {
          product.variants.forEach(variant => {
            csv += `"${product.id}","${product.name}","${product.brand}","${product.category}","${variant.id}","${variant.size_weight}",${variant.price},${variant.thc_percentage || ''},${variant.cbd_percentage || ''},${variant.inventory_level},${variant.is_available}\n`;
          });
      });
      
      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
        const exportName = `leafiq_inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    
        alert(`Exported ${exportData.products.length} products successfully!`);
      }
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showInstructions) {
    return <ImportExportInstructions onClose={() => setShowInstructions(false)} />;
  }

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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paste JSON data:
                </label>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  View Template & Instructions
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Mode:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="update"
                      checked={importMode === 'update'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Update Inventory</strong> - Add new products and update existing ones
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Replace Inventory</strong> - ⚠️ Delete all current products and replace with imported data
                    </span>
                  </label>
                </div>
              </div>
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paste Markdown data:
                </label>
                <button
                  onClick={() => setShowInstructions(true)}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  View Template & Instructions
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Mode:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="update"
                      checked={importMode === 'update'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Update Inventory</strong> - Add new products and update existing ones
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={(e) => setImportMode(e.target.value as ImportMode)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Replace Inventory</strong> - ⚠️ Delete all current products and replace with imported data
                    </span>
                  </label>
                </div>
              </div>
              
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

          {/* Import Result Display */}
          {importResult && (
            <div className={`mb-6 p-4 rounded-lg border ${
              importResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.success ? 'Import Successful!' : 'Import Failed'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    importResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {importResult.message}
                  </p>
                  
                  {importResult.stats && (
                    <div className="mt-2 text-xs space-y-1">
                      <div className="grid grid-cols-2 gap-2">
                        <span>Products Created: {importResult.stats.productsCreated}</span>
                        <span>Products Updated: {importResult.stats.productsUpdated}</span>
                        <span>Variants Created: {importResult.stats.variantsCreated}</span>
                        <span>Variants Updated: {importResult.stats.variantsUpdated}</span>
                      </div>
                      
                      {importResult.stats.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Errors:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {importResult.stats.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResult.stats.errors.length > 5 && (
                              <li>... and {importResult.stats.errors.length - 5} more errors</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
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
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Import Data'}
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
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Export Data'}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImportExportOptions;