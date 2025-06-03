import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Send, Trash2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { PineconeDocument } from '../../types';

const SuperadminPanel: React.FC = () => {
  const [documents, setDocuments] = useState<PineconeDocument[]>([{
    title: '',
    content: '',
    category: 'cannabis-education',
    source: 'LeafIQ Knowledge Base'
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to add a new empty document
  const addDocument = () => {
    setDocuments([...documents, {
      title: '',
      content: '',
      category: 'cannabis-education',
      source: 'LeafIQ Knowledge Base'
    }]);
  };

  // Function to remove a document
  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  // Function to update document field
  const updateDocument = (index: number, field: keyof PineconeDocument, value: string) => {
    const newDocuments = [...documents];
    newDocuments[index] = {
      ...newDocuments[index],
      [field]: value
    };
    setDocuments(newDocuments);
  };

  // Function to handle document ingestion
  const handleIngest = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);

    try {
      // Validate documents
      const invalidDocuments = documents.filter(
        doc => !doc.title.trim() || !doc.content.trim()
      );
      
      if (invalidDocuments.length > 0) {
        throw new Error('All documents must have a title and content');
      }

      // Get auth token for the request
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to ingest documents');
      }

      // Call the Pinecone ingest Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pinecone-ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          documents,
          operation: 'upsert'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ingest documents');
      }

      const data = await response.json();
      setResult(data);

      // If successful, reset the form
      if (data.success) {
        setDocuments([{
          title: '',
          content: '',
          category: 'cannabis-education',
          source: 'LeafIQ Knowledge Base'
        }]);
      }
    } catch (error) {
      console.error('Error ingesting documents:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to load document from a text file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Extract a title from the first line or use the filename
      const lines = content.split('\n');
      const title = lines[0]?.trim() || file.name.replace(/\.[^/.]+$/, "");
      
      updateDocument(index, 'title', title);
      updateDocument(index, 'content', content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Database size={20} className="text-purple-600" />
            <h2 className="text-xl font-semibold">Pinecone Knowledge Base Management</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              This panel allows super admins to ingest cannabis knowledge into the Pinecone vector database.
              The data will be used to power the cannabis knowledge chatbot for customers.
            </p>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
              <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Important Information
              </h3>
              <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                <li>Each document will be processed into embeddings and stored in Pinecone</li>
                <li>Content should be factual and educational about cannabis</li>
                <li>Break large documents into smaller, focused chunks (2000-3000 characters each)</li>
                <li>Provide clear titles that describe the content</li>
              </ul>
            </div>
          </div>
          
          {/* Document Form */}
          <div className="space-y-4 mb-6">
            {documents.map((doc, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Document #{index + 1}</h3>
                  {documents.length > 1 && (
                    <button 
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => updateDocument(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="E.g., Cannabis Terpenes Explained"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={doc.category}
                      onChange={(e) => updateDocument(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="cannabis-education">Cannabis Education</option>
                      <option value="product-types">Product Types</option>
                      <option value="consumption-methods">Consumption Methods</option>
                      <option value="terpenes">Terpenes</option>
                      <option value="cannabinoids">Cannabinoids</option>
                      <option value="medical-effects">Medical Effects</option>
                      <option value="regulations">Regulations & Compliance</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Content*
                    </label>
                    <label className="flex items-center text-sm text-purple-600 cursor-pointer">
                      <input
                        type="file"
                        accept=".txt,.md"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, index)}
                      />
                      <Upload size={14} className="mr-1" /> Upload Text File
                    </label>
                  </div>
                  <textarea
                    value={doc.content}
                    onChange={(e) => updateDocument(index, 'content', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter factual cannabis knowledge here..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Character count: {doc.content.length} 
                    {doc.content.length > 4000 && 
                      <span className="text-red-500"> (Consider breaking into smaller documents)</span>
                    }
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={doc.source}
                    onChange={(e) => updateDocument(index, 'source', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="E.g., LeafIQ Knowledge Base, Research Paper, etc."
                  />
                </div>
              </motion.div>
            ))}
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={addDocument}
                className="flex items-center"
              >
                <FileText size={16} className="mr-2" />
                Add Another Document
              </Button>
            </div>
          </div>
          
          {/* Result display */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-${result.success ? 'green' : 'amber'}-50 border border-${result.success ? 'green' : 'amber'}-200 p-4 rounded-lg mb-6`}
            >
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
                ) : (
                  <AlertCircle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
                )}
                <div>
                  <p className={`text-${result.success ? 'green' : 'amber'}-700 font-medium mb-1`}>
                    {result.success ? 'Documents successfully processed' : 'Processing completed with warnings'}
                  </p>
                  <p className={`text-${result.success ? 'green' : 'amber'}-600 text-sm`}>
                    {result.operation === 'upsert' && `${result.results.successful} of ${result.results.total} documents ingested successfully.`}
                    {result.operation === 'delete' && `${result.count} documents deleted successfully.`}
                  </p>
                  {result.results?.failed > 0 && (
                    <div className="mt-2 text-amber-700 text-sm">
                      <p>Failed documents: {result.results.failed}</p>
                      <ul className="mt-1 list-disc list-inside">
                        {result.results.details
                          .filter((detail: any) => !detail.success)
                          .map((detail: any, i: number) => (
                            <li key={i}>{detail.error}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Submission button */}
          <div className="flex justify-end">
            <Button
              onClick={handleIngest}
              disabled={isProcessing || documents.some(doc => !doc.title || !doc.content)}
              isLoading={isProcessing}
              leftIcon={<Send size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Ingest to Pinecone'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperadminPanel;