import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';

interface V0ChatProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const VercelV0Chat: React.FC<V0ChatProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
  }[]>([
    {
      role: 'assistant',
      content: '👋 Hey there! Welcome to your cannabis education center!\n\nI\'m Bud, and I\'m here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!'
    }
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "What's the difference between indica and sativa?",
    "How do terpenes affect cannabis?",
    "What should I know about edible dosing?",
    "Can you explain THC vs CBD?",
    "What are the effects of different strains?",
    "How do I understand product lab results?"
  ];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setShowSuggestions(false);

    // Send to the search function
    onSearch(userMessage);
    
    // Add thinking state
    setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    setShowSuggestions(false);
    
    // Send to the search function
    onSearch(suggestion);
    
    // Add thinking state
    setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      {/* Chat Messages */}
      <div className="w-full">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl shadow-xl border border-green-200 overflow-hidden max-w-5xl mx-auto">
          <div className="overflow-y-auto p-6 space-y-4 bg-white bg-opacity-60">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`flex ${
                  message.role === 'user' 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div className={`flex max-w-[80%] ${
                  message.role === 'user' 
                    ? 'flex-row-reverse' 
                    : 'flex-row'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 h-10 w-10 bg-green-50 rounded-full mr-3 overflow-hidden">
                      <img 
                        src="/budbuddy.png" 
                        alt="Bud AI" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-green-500 text-white ml-3' 
                      : 'bg-gray-50 border border-gray-100 text-left'
                  }`}>
                    <p className="text-left whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            {showSuggestions && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <span className="mr-1">💡</span> Quick tip: Try clicking one of the suggestion cards below, or type your own question about cannabis. I can explain everything from basic terms to advanced topics!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white rounded-xl p-3 shadow-sm border border-green-100 cursor-pointer hover:shadow-md hover:border-green-300 transition-all"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question about cannabis..."
                  className="w-full p-4 pr-12 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl resize-none min-h-[60px] max-h-[200px] bg-green-50"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`absolute right-3 bottom-3 p-2 rounded-full ${
                    !inputValue.trim() || isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  } transition-colors`}
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VercelV0Chat;