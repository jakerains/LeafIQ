import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import VercelV0Chat from '../../components/ui/v0-ai-chat';
import CannabisQuestionsChat from '../../components/kiosk/CannabisQuestionsChat';

interface KioskHomeProps {
  onSearch: (query: string, mode?: 'vibe' | 'activity' | 'cannabis_questions') => void;
  isLoading: boolean;
}


// Define the chat modes
type ChatMode = 'vibe' | 'activity' | 'cannabis_questions';

const KioskHome = ({ onSearch, isLoading }: KioskHomeProps) => {
  // State to track which chat mode is active
  const [activeChatMode, setActiveChatMode] = useState<ChatMode>('vibe');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  

  // Scroll to top when switching to cannabis questions mode
  useEffect(() => {
    if (activeChatMode === 'cannabis_questions') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeChatMode]);

  return (
    <motion.div 
      className="w-full text-center flex flex-col justify-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Chat mode selector */}
      <div className="flex justify-center mb-6 space-x-3">
        <button
          onClick={() => setActiveChatMode('vibe')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
            activeChatMode === 'vibe'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Vibe Planner
        </button>
        <button
          onClick={() => setActiveChatMode('activity')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
            activeChatMode === 'activity'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Activity Planner
        </button>
        <button
          onClick={() => setActiveChatMode('cannabis_questions')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
            activeChatMode === 'cannabis_questions'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Cannabis Questions
        </button>
      </div>
      
      {/* Render the appropriate chat interface based on active mode */}
      <div className="flex-1 flex flex-col justify-center">
        {activeChatMode === 'cannabis_questions' ? (
          <CannabisQuestionsChat onSearch={onSearch} isLoading={isLoading} />
        ) : (
          /* V0 Chat Component for Vibe and Activity modes */
          <VercelV0Chat 
            onSearch={onSearch} 
            isLoading={isLoading}
            mode={activeChatMode}
          />
        )}
      </div>
      
    </motion.div>
  );
};

export default KioskHome;