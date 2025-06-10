import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Loader2, X } from 'lucide-react';
import { Button } from './button';
import { FlowButton } from './flow-button';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
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
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

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
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
        setShowVoiceModal(false);
        stopAudioVisualization();
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setShowVoiceModal(false);
        stopAudioVisualization();
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setShowVoiceModal(false);
        stopAudioVisualization();
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopAudioVisualization();
    };
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

  // Audio visualization functions
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true
      });
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      // Configure for maximum responsiveness to speech
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.1; // Less smoothing = more responsive
      
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;
      mediaStreamRef.current = stream;
      
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(frequencyData);
          
          // Focus on speech frequency range (85Hz - 255Hz roughly corresponds to indices 4-12 in a 1024 FFT at 44.1kHz)
          // But let's be more aggressive and look at 0-4000Hz range which covers most speech
          const speechRange = frequencyData.slice(4, 80); // Covers ~85Hz to ~4kHz
          
          // Find the maximum value in the speech range
          const maxLevel = Math.max(...speechRange);
          
          // Normalize and apply aggressive amplification
          let normalizedLevel = maxLevel / 255;
          
          // Apply exponential scaling to make quiet sounds more visible
          normalizedLevel = Math.pow(normalizedLevel, 0.5);
          
          // Add a base level so there's always some activity visible
          const finalLevel = Math.min(normalizedLevel * 2 + 0.1, 1);
          
          console.log('Audio levels:', { maxLevel, normalizedLevel, finalLevel }); // Debug
          
          setAudioLevel(finalLevel);
          
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopAudioVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
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
      setShowVoiceModal(false);
      stopAudioVisualization();
    } else {
      // Start listening
      try {
        setShowVoiceModal(true);
        startAudioVisualization();
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Unable to start voice recognition. Please check your microphone permissions.');
        setShowVoiceModal(false);
        stopAudioVisualization();
      }
    }
  };

  // Get instructions based on mode
  const getVoiceInstructions = () => {
    switch (mode) {
      case 'activity':
        return 'Tell me what you want to do';
      case 'vibe':
      default:
        return 'Tell me how you want to feel';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full px-5 py-4 pl-12 pr-4 text-xl bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-300"
              disabled={isLoading}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <FlowButton
            type="submit"
            text="Search"
            isLoading={isLoading}
            disabled={!query.trim() || isLoading}
            className="shadow-lg"
          />
          
          {/* Voice Button - now matches FlowButton style */}
          {isRecognitionSupported && (
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`group relative flex items-center justify-center overflow-hidden rounded-[100px] border-[1.5px] px-4 py-3 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95] disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed min-w-[60px] ${
                isListening 
                  ? 'border-red-500 bg-white text-red-600 hover:text-white' 
                  : 'border-primary-500 bg-white text-primary-500 hover:text-white'
              }`}
              disabled={isLoading}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {/* Circle background */}
              <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-[50%] group-hover:w-[220px] group-hover:h-[220px] transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isListening ? 'bg-red-500' : 'bg-primary-500'
              }`}></span>
              
              {/* Icon */}
              <span className="relative z-[1]">
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </span>
            </button>
          )}
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

      {/* Voice Input Modal */}
      <AnimatePresence>
        {showVoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowVoiceModal(false);
              recognitionRef.current?.stop();
              stopAudioVisualization();
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setShowVoiceModal(false);
                  recognitionRef.current?.stop();
                  stopAudioVisualization();
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Instructions */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Listening...</h3>
              <p className="text-lg text-gray-600 mb-8">{getVoiceInstructions()}</p>

              {/* Microphone visualization */}
              <div className="relative mx-auto mb-6">
                {/* Outer pulsing circle */}
                <motion.div
                  className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mx-auto"
                  animate={{
                    scale: 1 + audioLevel * 0.5,
                    backgroundColor: `rgba(34, 197, 94, ${0.15 + audioLevel * 0.4})`
                  }}
                  transition={{
                    duration: 0.05,
                    ease: "easeOut"
                  }}
                >
                  {/* Inner microphone circle */}
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center"
                    animate={{
                      scale: 1 + audioLevel * 0.4,
                      backgroundColor: `rgba(34, 197, 94, ${0.8 + audioLevel * 0.2})`
                    }}
                    transition={{
                      duration: 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Mic size={32} className="text-white" />
                  </motion.div>
                </motion.div>

                {/* Audio level bars */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const radius = 85;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    // Make bars respond more dramatically with individual variation
                    const individualLevel = audioLevel + (Math.sin(Date.now() * 0.01 + i) * 0.1);
                    const barHeight = 8 + individualLevel * 40;
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 bg-primary-400 rounded-full"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          height: barHeight,
                          opacity: 0.4 + audioLevel * 0.6,
                          backgroundColor: `rgba(34, 197, 94, ${0.6 + audioLevel * 0.4})`
                        }}
                        transition={{
                          duration: 0.05,
                          ease: "easeOut"
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-sm text-gray-600 font-medium">Recording</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VercelV0Chat;