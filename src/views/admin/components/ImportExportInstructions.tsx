import React from 'react';
import { motion } from 'framer-motion';
import { FileJson, Download, UploadCloud, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ImportExportInstructionsProps {
  onClose: () => void;
}

const ImportExportInstructions: React.FC<ImportExportInstructionsProps> = ({ onClose }) => {
  // Example snippet of the JSON template
  const jsonSnippet = `{
  "metadata": {
    "format_version": "1.0",
    "organization_id": "YOUR_ORGANIZATION_ID"
  },
  "products": [
    {
      "id": "flower-001",
      "name": "Blue Dream",
      "brand": "Your Brand",
      "category": "flower",
      "strain_type": "hybrid",
      "variants": [
        {
          "id": "flower-001-var1",
          "size_weight": "1g",
          "price": 12.00,
          "thc_percentage": 22.5,
          "terpene_profile": {
            "myrcene": 0.83,
            "limonene": 0.43
          }
        }
      ]
    },
    // More products...
  ]
}`;

  const handleDownloadTemplate = () => {
    // Create a link to download the template
    const link = document.createElement('a');
    link.href = '/templates/inventory-upload-template.json';
    link.download = 'leafiq-inventory-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manual Inventory Upload Instructions</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-start">
          <div className="mt-1 mr-4">
            <FileJson className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">JSON Template</h3>
            <p className="text-gray-600">
              Our JSON template provides a structured format for uploading your entire inventory at once.
              It supports all product types with their variants, terpene profiles, and inventory levels.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Template Preview</h4>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4" />
              <span>Download Full Template</span>
            </Button>
          </div>

          <div className="overflow-auto max-h-80 rounded-md">
            <SyntaxHighlighter
              language="json"
              style={atomOneDark}
              showLineNumbers
              customStyle={{ borderRadius: '0.5rem', fontSize: '0.8rem' }}
            >
              {jsonSnippet}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <h4 className="flex items-center gap-2 font-medium text-primary-800 mb-2">
            <HelpCircle className="h-5 w-5 text-primary-500" />
            Key Instructions
          </h4>
          <ul className="list-disc pl-5 text-primary-700 space-y-2">
            <li>Each product must have at least one variant with pricing and inventory information</li>
            <li>Ensure all IDs are unique across your inventory</li>
            <li>Include terpene profiles for flower and concentrates to enable AI-powered recommendations</li>
            <li>Image URLs should be publicly accessible</li>
            <li>For edibles, THC percentage represents total mg in the package</li>
          </ul>
        </div>

        <div className="flex items-start">
          <div className="mt-1 mr-4">
            <UploadCloud className="h-6 w-6 text-secondary-500" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Upload Process</h3>
            <p className="text-gray-600">
              After preparing your JSON file using our template, you can upload it through the
              Import/Export section of your Admin Dashboard. The system will validate your data
              before importing it into your inventory.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          onClick={handleDownloadTemplate}
          leftIcon={<Download size={16} />}
        >
          Download Template
        </Button>
      </div>
    </motion.div>
  );
};

export default ImportExportInstructions;