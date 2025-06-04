import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  File, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  X,
  Plus,
  Trash2,
  UploadCloud,
  Loader
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface DocumentUpload {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  fileType: string;
  file?: File;
}

interface EnhancedKnowledgeUploaderProps {
  onUploadComplete?: () => void;
}

const EnhancedKnowledgeUploader: React.FC<EnhancedKnowledgeUploaderProps> = ({ onUploadComplete }) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>([{
    id: crypto.randomUUID(),
    title: '',
    content: '',
    category: 'general',
    source: 'superadmin-upload',
    fileType: 'text'
  }]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<any>(null);

  // Supported file types
  const supportedTypes = ['txt', 'md', 'json'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Helper function to parse file content based on type
  const parseFileContent = (content: string, fileType: string): { title?: string; content: string } => {
    try {
      switch (fileType.toLowerCase()) {
        case 'json':
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData)) {
            // Handle array of documents
            return {
              content: jsonData.map(item => 
                typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
              ).join('\n\n')
            };
          } else if (typeof jsonData === 'object') {
            // Handle single object
            return {
              title: jsonData.title || jsonData.name || undefined,
              content: JSON.stringify(jsonData, null, 2)
            };
          }
          return { content };
          
        case 'md':
        case 'markdown':
          // Extract title from first h1 heading if present
          const mdLines = content.split('\n');
          const h1Match = mdLines.find(line => line.startsWith('# '));
          const mdTitle = h1Match ? h1Match.replace('# ', '').trim() : undefined;
          return { title: mdTitle, content };
          
        case 'txt':
        case 'text':
        default:
          // Extract title from first line if it looks like a title
          const textLines = content.split('\n');
          const firstLine = textLines[0]?.trim();
          const textTitle = (firstLine && firstLine.length < 100 && !firstLine.includes('.')) ? firstLine : undefined;
          return { title: textTitle, content };
      }
    } catch (error) {
      console.error('Error parsing file content:', error);
      return { content };
    }
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null, index: number) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase() || 'txt';
    
    // Validate file type
    if (!supportedTypes.includes(fileType)) {
      alert(`Unsupported file type. Please use: ${supportedTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxFileSize) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    try {
      const content = await readFileContent(file);
      const parsed = parseFileContent(content, fileType);
      
      const updatedDocuments = [...documents];
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        title: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
        content: parsed.content,
        fileType,
        file
      };
      setDocuments(updatedDocuments);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent, docId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(docId);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files, index);
    }
  };

  // Update document field
  const updateDocument = (index: number, field: keyof DocumentUpload, value: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: value
    };
    setDocuments(updatedDocuments);
  };

  // Add new document
  const addDocument = () => {
    setDocuments([...documents, {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      category: 'general',
      source: 'superadmin-upload',
      fileType: 'text'
    }]);
  };

  // Remove document
  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      const updatedDocuments = documents.filter((_, i) => i !== index);
      setDocuments(updatedDocuments);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    // Validate documents
    const invalidDocuments = documents.filter(doc => !doc.title.trim() || !doc.content.trim());
    if (invalidDocuments.length > 0) {
      alert('All documents must have a title and content');
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      // Prepare documents for upload
      const documentsToUpload = documents.map(doc => ({
        title: doc.title,
        content: doc.content,
        category: doc.category,
        source: doc.source,
        fileType: doc.fileType
      }));

      // Call the pinecone-ingest Edge Function
      const { data: session } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xaddlctkbrdeigeqfswd.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/pinecone-ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({
          documents: documentsToUpload,
          operation: 'upsert'
        }),
      });

      const result = await response.json();
      setUploadResults(result);
      
      if (result.success) {
        // Reset form
        setDocuments([{
          id: crypto.randomUUID(),
          title: '',
          content: '',
          category: 'general',
          source: 'superadmin-upload',
          fileType: 'text'
        }]);
        
        // Notify parent component
        onUploadComplete?.();
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      setUploadResults({
        success: false,
        error: 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'json': return <Code className="w-5 h-5 text-blue-500" />;
      case 'md': case 'markdown': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Knowledge Base Upload
          </h2>
          <p className="text-gray-600 mt-1">
            Add documents to your AI knowledge base for improved responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          {supportedTypes.map(type => (
            <span key={type} className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">
              .{type}
            </span>
          ))}
          <span className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">Max 10MB</span>
        </div>
      </div>

      {/* Upload Results */}
      <AnimatePresence>
        {uploadResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${
              uploadResults.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadResults.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {uploadResults.success 
                  ? `Successfully uploaded ${uploadResults.results?.successful || documents.length} document(s)` 
                  : uploadResults.error || 'Upload failed'
                }
              </span>
            </div>
            {uploadResults.results && (
              <div className="mt-2 text-sm">
                Total: {uploadResults.results.total} • 
                Successful: {uploadResults.results.successful} • 
                Failed: {uploadResults.results.failed}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Forms */}
      <div className="space-y-6">
        <AnimatePresence>
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 flex justify-between items-center border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {doc.file ? getFileIcon(doc.fileType) : <File className="w-5 h-5 text-gray-400" />}
                    Document {index + 1}
                    {doc.file && (
                      <span className="ml-2 text-xs font-normal px-2 py-1 bg-gray-100 border border-gray-200 rounded">
                        {doc.file.name} ({formatFileSize(doc.file.size)})
                      </span>
                    )}
                  </h3>
                  {documents.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(index)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor={`title-${doc.id}`} className="text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`title-${doc.id}`}
                        type="text"
                        value={doc.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDocument(index, 'title', e.target.value)}
                        placeholder="Document title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor={`category-${doc.id}`} className="text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id={`category-${doc.id}`}
                        value={doc.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDocument(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="general">General</option>
                        <option value="strain-info">Strain Information</option>
                        <option value="effects">Effects & Benefits</option>
                        <option value="consumption">Consumption Methods</option>
                        <option value="terpenes">Terpenes</option>
                        <option value="cannabinoids">Cannabinoids</option>
                        <option value="regulations">Regulations</option>
                        <option value="products">Product Information</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload Zone */}
                  <div
                    className={`
                      relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 
                      ${dragActive === doc.id 
                        ? 'border-purple-400 bg-purple-50/50 scale-[1.01] shadow-lg' 
                        : 'border-gray-300 bg-gray-50/30 hover:border-purple-300 hover:bg-purple-50/30'
                      }
                    `}
                    onDragEnter={(e) => handleDrag(e, doc.id)}
                    onDragLeave={(e) => handleDrag(e)}
                    onDragOver={(e) => handleDrag(e, doc.id)}
                    onDrop={(e) => handleDrop(e, index, doc.id)}
                  >
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        animate={{ 
                          y: dragActive === doc.id ? [-5, 0, -5] : 0,
                          scale: dragActive === doc.id ? [1, 1.05, 1] : 1
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: dragActive === doc.id ? Infinity : 0,
                          ease: "easeInOut" 
                        }}
                        className="relative mb-4"
                      >
                        {dragActive === doc.id && (
                          <motion.div
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-4 bg-purple-400/20 rounded-full blur-md"
                          />
                        )}
                        <UploadCloud 
                          className={`w-12 h-12 ${
                            dragActive === doc.id 
                              ? 'text-purple-500' 
                              : 'text-gray-400 group-hover:text-purple-500'
                          }`} 
                        />
                      </motion.div>

                      {doc.file ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-900">
                            {getFileIcon(doc.fileType)}
                            <span className="font-medium">{doc.file.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => {
                                const updated = [...documents];
                                updated[index] = { ...updated[index], file: undefined };
                                setDocuments(updated);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            File loaded successfully. You can edit the content below.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-gray-900 font-medium">
                            {dragActive === doc.id ? "Drop file here" : "Upload a file"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dragActive === doc.id ? (
                              <span className="text-purple-500 font-medium">Release to upload</span>
                            ) : (
                              <>
                                Drag & drop or{" "}
                                <label className="text-purple-500 hover:text-purple-600 cursor-pointer font-medium">
                                  browse
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".txt,.md,.json"
                                    onChange={(e) => handleFileSelect(e.target.files, index)}
                                  />
                                </label>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports: {supportedTypes.join(', ')} • Max 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Animated border effect */}
                    {dragActive === doc.id && (
                      <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <svg className="absolute inset-0 w-full h-full">
                          <rect 
                            width="100%" 
                            height="100%" 
                            rx="0.75rem" 
                            fill="none" 
                            stroke="url(#gradient)" 
                            strokeWidth="3" 
                            strokeDasharray="10 5"
                            className="animate-[dash_3s_linear_infinite]"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  {/* Content Textarea */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor={`content-${doc.id}`} className="text-sm font-medium text-gray-700">
                        Content <span className="text-red-500">*</span>
                      </label>
                      {doc.content.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {doc.content.length} characters
                        </span>
                      )}
                    </div>
                    <Textarea
                      id={`content-${doc.id}`}
                      value={doc.content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateDocument(index, 'content', e.target.value)}
                      rows={8}
                      placeholder="Enter document content or upload a file above..."
                      className="w-full resize-y min-h-[150px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={addDocument}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Document
        </Button>

        <Button
          onClick={handleUpload}
          disabled={uploading || documents.some(doc => !doc.title || !doc.content)}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          {uploading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload to Pinecone ({documents.length})
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Upload Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span><strong>JSON files:</strong> Will be formatted and any title/name field extracted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span><strong>Markdown files:</strong> First # heading will be used as title</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span><strong>Text files:</strong> First line used as title if it looks like one</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Documents are embedded using Pinecone's llama-text-embed-v2 model</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>All content is searchable through the cannabis knowledge chatbot</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedKnowledgeUploader; 