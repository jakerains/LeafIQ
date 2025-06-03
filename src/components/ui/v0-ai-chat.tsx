import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, Bot, User, Lightbulb, Wand2 } from 'lucide-react';
import { Button } from './button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface V0ChatProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const VercelV0Chat = ({ onSearch, isLoading }: V0ChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hey there! Welcome to your cannabis education center!\n\nI'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!"
    },
    {
      role: 'assistant',
      content: "💡 Quick tip: Try clicking one of the suggestion cards below, or type your own question about cannabis. I can explain everything from basic terms to advanced topics!"
    }
  ]);
  const [suggestions] = useState([
    "What's the difference between indica and sativa?",
    "How do terpenes affect cannabis?",
    "What are the benefits of CBD?",
    "How should beginners start with cannabis?",
    "What's the endocannabinoid system?",
    "Tell me about cannabis edibles"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Pass the query to parent component
    onSearch(input);
    
    // Clear input
    setInput('');
    
    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add suggestion as user message
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    
    // Pass to search
    onSearch(suggestion);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
      {/* Chat messages */}
      <div className="w-full">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex justify-start"
              >
                {message.role === 'assistant' ? (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-2 mt-2 shadow-md">
                      <Bot size={16} />
                    </div>
                    <div className="max-w-[85%] flex-1">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 overflow-hidden max-w-5xl mx-auto">
                        <div className="overflow-y-auto p-6 space-y-4 bg-black bg-opacity-95 text-green-500">
                          {message.content.split('\n\n').map((paragraph, j) => (
                            <p key={j} className="leading-relaxed text-lg">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="max-w-[85%] flex-1 ml-auto">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 ml-auto mr-2">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 ml-2 mt-2">
                      <User size={16} />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about cannabis..."
            className="w-full px-4 py-3 pr-12 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[60px] max-h-[150px] resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <SendHorizonal className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Suggestion cards */}
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="cursor-pointer px-4 py-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl border border-primary-200 shadow-sm hover:shadow-md transition-all flex items-start max-w-xs"
          >
            <div className="mr-2 mt-0.5 text-primary-600">
              {i % 2 === 0 ? <Lightbulb size={16} /> : <Wand2 size={16} />}
            </div>
            <span className="text-gray-800 text-sm">{suggestion}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VercelV0Chat;