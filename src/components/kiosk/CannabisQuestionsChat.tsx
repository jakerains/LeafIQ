import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Loader } from 'lucide-react';
import { Button } from '../ui/button';

interface CannabisQuestionsChatProps {
  onSearch?: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading?: boolean;
}

const CannabisQuestionsChat: React.FC<CannabisQuestionsChatProps> = ({
  onSearch,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    {type: 'bot', text: "I'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!"}
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat container when messages are added
  useEffect(() => {
    // Only scroll the chat container, not the entire page
    if (chatEndRef.current && chatContainerRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'start' 
      });
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    // Add user message to chat history
    setChatHistory([...chatHistory, {type: 'user', text: query}]);
    
    // Forward the search query if onSearch is provided
    if (onSearch) {
      onSearch(query, 'cannabis_questions');
    }
    
    // Simulate a bot response (in a real app, this would come from the API)
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: `Thanks for asking about "${query}". Cannabis contains compounds called cannabinoids like THC and CBD, along with aromatic compounds called terpenes. These work together to create various effects. What else would you like to know?`
        }
      ]);
    }, 1500);
    
    // Clear input
    setQuery('');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-emerald-700">Cannabis Knowledge Center</h2>
        <p className="text-gray-600 mt-2">
          Ask me anything about cannabis - effects, strains, consumption methods, or terminology.
        </p>
      </motion.div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 overflow-hidden max-w-5xl mx-auto">
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="overflow-y-auto p-6 space-y-4 bg-white bg-opacity-70" 
            style={{ maxHeight: '400px', minHeight: '300px' }}
          >
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''} max-w-[85%]`}>
                  {message.type === 'bot' && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src="/budbuddy.png" 
                        alt="Bud" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`${
                    message.type === 'user' 
                      ? 'bg-emerald-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm' 
                      : 'bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100'
                  }`}>
                    <p className={`${message.type === 'user' ? 'text-white' : 'text-gray-700'} leading-relaxed`}>
                      {message.text}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0 h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white bg-opacity-90 border-t border-green-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ask about cannabis effects, strains, or consumption methods..."
                disabled={isLoading}
              />
              <Button 
                type="submit"
                disabled={!query.trim() || isLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center"
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Quick suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 max-w-3xl"
      >
        {[
          "What are terpenes?",
          "Indica vs. Sativa",
          "How to dose edibles",
          "CBD benefits",
          "What is the entourage effect?"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(suggestion);
              // Auto submit after a brief delay
              setTimeout(() => {
                if (!isLoading) {
                  setChatHistory([...chatHistory, {type: 'user', text: suggestion}]);
                  if (onSearch) {
                    onSearch(suggestion, 'cannabis_questions');
                  }
                  // Simulate bot response
                  setTimeout(() => {
                    setChatHistory(prev => [
                      ...prev, 
                      {
                        type: 'bot', 
                        text: `Thanks for asking about "${suggestion}". I'd be happy to explain this topic in detail. What specific aspect are you most interested in learning about?`
                      }
                    ]);
                  }, 1500);
                  setQuery('');
                }
              }, 300);
            }}
            className="bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-800 border border-emerald-200 hover:bg-emerald-50 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CannabisQuestionsChat;