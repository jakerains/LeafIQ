import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface CannabisQuestionsChatProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

const CannabisQuestionsChat: React.FC<CannabisQuestionsChatProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m your cannabis education assistant. Ask me anything about cannabis strains, consumption methods, effects, or any other cannabis-related topics you\'re curious about!'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isLoading) return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    // Simple placeholder response mechanism - in a real app, this would call an actual AI endpoint
    setTimeout(() => {
      const response = getPlaceholderResponse(question);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      // If the response includes product recommendations, we might want to trigger a search
      if (response.toLowerCase().includes('recommend') && onSearch) {
        const searchTerm = extractSearchTerm(question);
        if (searchTerm) {
          onSearch(searchTerm);
        }
      }
    }, 1000);

    // Clear the input
    setQuestion('');
  };

  // Placeholder function to generate responses - would be replaced by actual AI
  const getPlaceholderResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('thc')) {
      return 'THC (tetrahydrocannabinol) is the main psychoactive compound in cannabis that produces the "high" sensation. It can help with pain relief, nausea, and appetite stimulation, but may also cause anxiety or paranoia in some users, especially at higher doses.';
    }
    
    if (lowerQuery.includes('cbd')) {
      return 'CBD (cannabidiol) is a non-intoxicating compound in cannabis known for its potential therapeutic benefits. It won\'t get you "high" but may help with anxiety, inflammation, pain, and seizures. Many people use CBD products for relaxation and wellness.';
    }
    
    if (lowerQuery.includes('edible')) {
      return 'Cannabis edibles are food products infused with cannabis extracts. They typically take 30-90 minutes to take effect but can last 4-8 hours. Start with a low dose (5-10mg THC) and wait at least 2 hours before consuming more to avoid uncomfortable experiences from taking too much.';
    }
    
    if (lowerQuery.includes('strain') || lowerQuery.includes('indica') || lowerQuery.includes('sativa')) {
      return 'Cannabis strains are typically categorized as indica, sativa, or hybrid. Indicas are often associated with relaxing, sedating effects good for nighttime use. Sativas typically provide energizing, uplifting effects better for daytime. Hybrids combine characteristics of both. However, the effects are actually determined more by the specific cannabinoids and terpenes rather than just the strain category.';
    }
    
    return 'That\'s a great question about cannabis! While I\'m just a simple demo placeholder, the real LeafIQ Cannabis Assistant would provide detailed, educational information on this topic. Is there anything specific about cannabis strains, effects, consumption methods, or cannabinoids you\'d like to learn more about?';
  };

  // Extract potential search terms from questions
  const extractSearchTerm = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('recommend')) {
      // Extract words after "recommend" or "for"
      const matches = lowerQuery.match(/recommend\s+(\w+)/i) || lowerQuery.match(/for\s+(\w+)/i);
      return matches ? matches[1] : null;
    }
    
    return null;
  };
  
  // Common cannabis-related questions for quick selection
  const questionSuggestions = [
    "What's the difference between THC and CBD?",
    "How do terpenes affect cannabis effects?",
    "What are the benefits of different consumption methods?",
    "How do I understand cannabis dosing?",
    "What strains help with sleep?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Chat history */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4">
        {chatHistory.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-primary-500 text-white rounded-tr-none' 
                  : 'bg-gray-100 rounded-tl-none'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-2">
                  <Bot size={16} className="mr-2 text-primary-600" />
                  <span className="font-medium text-primary-600">Cannabis Assistant</span>
                </div>
              )}
              <p className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {message.content}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] p-4 bg-gray-100 rounded-2xl rounded-tl-none">
              <div className="flex items-center">
                <Bot size={16} className="mr-2 text-primary-600" />
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Question suggestions */}
      <div className="bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-500 mb-2">Common questions:</p>
        <div className="flex flex-wrap gap-2">
          {questionSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="px-3 py-1.5 text-xs bg-white rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              onClick={() => setQuestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about cannabis..."
            className="flex-1 px-4 py-3 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!question.trim() || isLoading}
            className={`px-4 py-3 h-full rounded-r-xl ${
              !question.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CannabisQuestionsChat;