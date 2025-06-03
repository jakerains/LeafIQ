import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { getCannabisKnowledgeResponse } from '../../lib/supabase'; // Import the RAG function

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
  const [isBotTyping, setIsBotTyping] = useState(false); // State for typing indicator
  
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
  }, [chatHistory, isBotTyping]); // Include isBotTyping to scroll when indicator appears

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || isBotTyping) return; // Prevent multiple submissions
    
    const userQuery = query.trim();
    // Add user message to chat history
    setChatHistory(prev => [...prev, {type: 'user', text: userQuery}]);
    setQuery(''); // Clear input immediately
    setIsBotTyping(true); // Show typing indicator
    
    // Forward the search query if onSearch is provided (for logging/analytics)
    if (onSearch) {
      onSearch(userQuery, 'cannabis_questions');
    }
    
    try {
      // Get bot response from the RAG function
      const botResponse = await getCannabisKnowledgeResponse(userQuery);
      
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: botResponse || "I'm sorry, I couldn't find an answer to that question."
        }
      ]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'bot', 
          text: "I'm sorry, I encountered an error while trying to answer. Please try again."
        }
      ]);
    } finally {
      setIsBotTyping(false); // Hide typing indicator
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading || isBotTyping) return; // Prevent if already loading or typing
    
    setQuery(suggestion); // Set query in input field
    
    // Auto submit after a brief delay to allow user to see what was selected
    setTimeout(() => {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }, 300);
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
            
            {/* Bot typing indicator */}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src="/budbuddy.png" 
                      alt="Bud" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-green-100">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* This div is used for scrolling to bottom */}
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
                disabled={isLoading || isBotTyping}
              />
              <Button 
                type="submit"
                disabled={!query.trim() || isLoading || isBotTyping}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center"
              >
                {isLoading || isBotTyping ? (
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
          "What is the entourage effect?",
          "Cannabis for beginners",
          "Microdosing tips"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading || isBotTyping}
            className={`bg-white px-4 py-2 rounded-full text-sm font-medium text-emerald-800 border border-emerald-200 
              hover:bg-emerald-50 transition-colors ${(isLoading || isBotTyping) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CannabisQuestionsChat;