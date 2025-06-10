import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, MicOff } from 'lucide-react';
import { Button } from './button';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VercelV0ChatProps {
  onSearch: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading?: boolean;
  mode?: 'vibe' | 'activity';
}

const VercelV0Chat: React.FC<VercelV0ChatProps> = ({
  onSearch,
  isLoading = false,
  mode = 'vibe'
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // Set default placeholder text based on mode
  const getPlaceholderText = () => {
    switch (mode) {
      case 'activity':
        return 'What activity are you planning?';
      case 'vibe':
      default:
        return 'How do you want to feel?';
    }
  };

  // Set default suggestions based on mode
  const getSuggestions = () => {
    switch (mode) {
      case 'activity':
        return ['hiking trip', 'movie night', 'social gathering', 'creative session', 'before sleep'];
      case 'vibe':
      default:
        return ['relaxed', 'energized', 'creative', 'focused', 'pain relief'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      // Pass the mode along with the query
      onSearch(query, mode);
    }
  };

  // Modified to just add the suggestion to the query instead of triggering search
  const handleSuggestionClick = (suggestion: string) => {
    // Check if the query is empty or already ends with a comma
    if (query.trim() === '' || query.trim().endsWith(',')) {
      // If empty or ends with comma, just add the suggestion
      setQuery((prev) => prev.trim() + (prev.trim() ? ' ' : '') + suggestion);
    } else {
      // Otherwise add a comma and the suggestion
      setQuery((prev) => prev.trim() + ', ' + suggestion);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!isRecognitionSupported) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Unable to start voice recognition. Please check your microphone permissions.');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full px-5 py-4 pl-12 pr-32 text-xl bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          {/* Voice Button */}
          {isRecognitionSupported && (
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-20 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={isLoading}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            variant="primary"
            isLoading={isLoading}
            disabled={!query.trim() || isLoading}
          >
            Search
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {getSuggestions().map((suggestion) => (
          <motion.button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-4 py-2 bg-white bg-opacity-60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-opacity-80 transition-all duration-200"
            whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default VercelV0Chat;