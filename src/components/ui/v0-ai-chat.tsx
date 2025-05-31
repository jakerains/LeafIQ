"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { cn } from "../../lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    CalendarDays,
    HeartHandshake,
    X,
    Book,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface VercelV0ChatProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export function VercelV0Chat({ onSearch, isLoading = false }: VercelV0ChatProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    
    // Modified to support three modes: 'vibe', 'activity', and 'cannabis'
    const [mode, setMode] = useState<'vibe' | 'activity' | 'cannabis'>('vibe');
    const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

    // Dynamic suggestion pools
    const vibeSuggestions = [
        ['Relaxed', 'Energized', 'Creative', 'Focused', 'Pain Relief'],
        ['Euphoric', 'Sleepy', 'Social', 'Uplifted', 'Calm'],
        ['Happy', 'Motivated', 'Balanced', 'Stress-Free', 'Clear-Headed']
    ];
    
    const activitySuggestions = [
        ['Social Event', 'Creative Work', 'Hiking', 'Movie Night', 'Concert'],
        ['Gaming', 'Meditation', 'Exercise', 'Reading', 'Art Making'],
        ['Yoga', 'Dancing', 'Cooking', 'Music', 'Relaxing']
    ];
    
    const cannabisSuggestions = [
        ['What is THC?', 'CBD benefits', 'Terpenes explained', 'Indica vs Sativa', 'Edible dosing'],
        ['Cannabis history', 'Medical uses', 'Consumption methods', 'Strain differences', 'CBD vs THC'],
        ['First-time tips', 'Product storage', 'Tolerance breaks', 'Legal questions', 'Endocannabinoid system']
    ];
    
    const [currentSuggestionSet, setCurrentSuggestionSet] = useState(0);

    // Rotate suggestions every 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSuggestionSet((prev) => {
                if (mode === 'vibe') {
                    return (prev + 1) % vibeSuggestions.length;
                } else if (mode === 'activity') {
                    return (prev + 1) % activitySuggestions.length;
                } else {
                    return (prev + 1) % cannabisSuggestions.length;
                }
            });
        }, 10000);
        return () => clearInterval(timer);
    }, [mode]);

    const handleSubmit = () => {
        // Use the value from the input which already contains the selected suggestions
        const finalQuery = value.trim();
            
        if (finalQuery) {
            // Prefix based on mode to help the AI understand context
            let query;
            if (mode === 'activity') {
                query = `Activity: ${finalQuery}`;
            } else if (mode === 'cannabis') {
                query = `Cannabis Question: ${finalQuery}`;
            } else {
                query = finalQuery;
            }
            
            onSearch(query);
            setValue("");
            setSelectedSuggestions([]);
            adjustHeight(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Toggle between different modes
    const changeMode = (newMode: 'vibe' | 'activity' | 'cannabis') => {
        setMode(newMode);
        setValue(""); // Clear input when switching modes
        setSelectedSuggestions([]); // Clear selections when switching modes
        setCurrentSuggestionSet(0); // Reset suggestion set
    };

    const handleSuggestionClick = (suggestion: string) => {
        // Check if this suggestion is already selected
        if (selectedSuggestions.includes(suggestion)) {
            // Remove it from selected suggestions
            setSelectedSuggestions(prev => prev.filter(s => s !== suggestion));
            
            // Also remove it from the input value
            setValue(prev => {
                // Handle different cases of how the suggestion might appear in the text
                if (prev === suggestion) return '';
                if (prev.includes(`, ${suggestion}`)) return prev.replace(`, ${suggestion}`, '');
                if (prev.includes(`${suggestion}, `)) return prev.replace(`${suggestion}, `, '');
                return prev;
            });
        } else {
            // Add to selected suggestions
            setSelectedSuggestions(prev => [...prev, suggestion]);
            
            // Update the input value, adding a comma if needed
            setValue(prev => {
                if (!prev.trim()) return suggestion;
                return `${prev.trim()}, ${suggestion}`;
            });
        }
        
        // Focus the textarea after updating
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
        
        // Adjust height to accommodate new content
        adjustHeight();
    };

    // Get current suggestions based on mode
    const getCurrentSuggestions = () => {
        if (mode === 'vibe') {
            return vibeSuggestions[currentSuggestionSet];
        } else if (mode === 'activity') {
            return activitySuggestions[currentSuggestionSet];
        } else {
            return cannabisSuggestions[currentSuggestionSet];
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
            <div className="w-full">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={mode}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-bold text-center text-black font-display mb-8"
                    >
                        {mode === 'vibe' 
                            ? "How do you want to feel?" 
                            : mode === 'activity' 
                            ? "What are you up to?" 
                            : "Have cannabis questions?"}
                    </motion.h1>
                </AnimatePresence>

                <div className="relative bg-white rounded-xl border border-gray-200 shadow-md">
                    <div className="overflow-y-auto">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                mode === 'activity'
                                    ? "Describe the activities you're planning (concert, hike, movie night, etc.)..."
                                    : mode === 'cannabis'
                                    ? "Ask any question about cannabis, terpenes, consumption methods, etc..."
                                    : "Ask about a specific feeling or effect..."
                            }
                            className={cn(
                                "w-full px-4 py-3",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-gray-900 text-sm",
                                "focus:outline-none",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "placeholder:text-gray-500 placeholder:text-sm",
                                "min-h-[60px]"
                            )}
                            style={{
                                overflow: "hidden",
                            }}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="group p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                disabled={isLoading}
                            >
                                <Paperclip className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-600 hidden group-hover:inline transition-opacity">
                                    Attach
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-2 py-1 rounded-lg text-sm text-gray-600 transition-colors border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-between gap-1"
                                disabled={isLoading}
                            >
                                <PlusIcon className="w-4 h-4" />
                                Product
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!value.trim() || isLoading}
                                className={cn(
                                    "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center justify-between gap-1",
                                    value.trim() && !isLoading
                                        ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-600 cursor-pointer"
                                        : "text-gray-400 border-gray-300 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <ArrowUpIcon
                                        className={cn(
                                            "w-4 h-4",
                                            value.trim()
                                                ? "text-white"
                                                : "text-gray-400"
                                        )}
                                    />
                                )}
                                <span className="sr-only">Send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <motion.div className="flex items-center gap-2">
                        <motion.button
                            onClick={() => changeMode('vibe')}
                            className={`flex items-center gap-2 px-4 py-2 ${mode === 'vibe' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'} rounded-full shadow-md transition-all duration-300`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                        >
                            <HeartHandshake className="w-5 h-5" />
                            <span>Vibe Planner</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => changeMode('activity')}
                            className={`flex items-center gap-2 px-4 py-2 ${mode === 'activity' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'} rounded-full shadow-md transition-all duration-300`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                        >
                            <CalendarDays className="w-5 h-5" />
                            <span>Activity Planner</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => changeMode('cannabis')}
                            className={`flex items-center gap-2 px-4 py-2 ${mode === 'cannabis' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'} rounded-full shadow-md transition-all duration-300`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                        >
                            <Book className="w-5 h-5" />
                            <span>Cannabis Questions</span>
                        </motion.button>
                    </motion.div>
                </div>

                {selectedSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {selectedSuggestions.map((suggestion) => (
                            <motion.button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium border border-primary-200 hover:bg-primary-200 transition-all duration-200 flex items-center gap-1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {suggestion}
                                <X size={14} className="ml-1" />
                            </motion.button>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                    {getCurrentSuggestions().map((suggestion) => (
                        <ActionButton
                            key={suggestion}
                            icon={getIconForSuggestion(suggestion, mode)}
                            label={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isLoading} 
                            isSelected={selectedSuggestions.includes(suggestion)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isSelected?: boolean;
}

function ActionButton({ icon, label, onClick, disabled = false, isSelected = false }: ActionButtonProps) {
    return (
        <motion.button
            type="button"
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm",
                disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : isSelected
                        ? "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200"
                        : "bg-white text-gray-700 border-gray-200 hover:text-gray-900 hover:bg-gray-50"
            )}
            whileHover={disabled ? {} : { y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </motion.button>
    );
}

// Helper function to get appropriate icon for suggestion
function getIconForSuggestion(suggestion: string, mode: 'vibe' | 'activity' | 'cannabis'): React.ReactNode {
    // Define mode-specific icon maps
    const vibeIconMap: Record<string, React.ReactNode> = {
        'Relaxed': <ImageIcon className="w-4 h-4" />,
        'Energized': <Figma className="w-4 h-4" />,
        'Creative': <FileUp className="w-4 h-4" />,
        'Focused': <MonitorIcon className="w-4 h-4" />,
        'Pain Relief': <CircleUserRound className="w-4 h-4" />,
    };

    const activityIconMap: Record<string, React.ReactNode> = {
        'Social Event': <CalendarDays className="w-4 h-4" />,
        'Creative Work': <MonitorIcon className="w-4 h-4" />,
        'Hiking': <FileUp className="w-4 h-4" />,
        'Movie Night': <CircleUserRound className="w-4 h-4" />,
        'Concert': <Figma className="w-4 h-4" />,
    };
    
    const cannabisIconMap: Record<string, React.ReactNode> = {
        'What is THC?': <Book className="w-4 h-4" />,
        'CBD benefits': <CircleUserRound className="w-4 h-4" />,
        'Terpenes explained': <FileUp className="w-4 h-4" />,
        'Indica vs Sativa': <MonitorIcon className="w-4 h-4" />,
        'Edible dosing': <Figma className="w-4 h-4" />,
    };
    
    // Choose the appropriate map based on mode
    const activeMap = mode === 'vibe' ? vibeIconMap : 
                     mode === 'activity' ? activityIconMap : 
                     cannabisIconMap;
    
    return activeMap[suggestion] || <ImageIcon className="w-4 h-4" />;
}