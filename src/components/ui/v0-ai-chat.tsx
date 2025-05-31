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
    const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [isActivityMode, setIsActivityMode] = useState(false);

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
    
    const [currentSuggestionSet, setCurrentSuggestionSet] = useState(0);

    // Rotate suggestions every 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSuggestionSet((prev) => 
                (prev + 1) % (isActivityMode ? activitySuggestions.length : vibeSuggestions.length)
            );
        }, 10000);
        return () => clearInterval(timer);
    }, [isActivityMode]);

    const handleSubmit = () => {
        const finalQuery = [value.trim(), ...selectedSuggestions]
            .filter(Boolean)
            .join(', ');
            
        if (finalQuery) {
            // Prefix for activity mode to help the AI understand context
            const query = isActivityMode ? `Activity: ${finalQuery}` : finalQuery;
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

    const toggleMode = () => {
        setIsActivityMode(!isActivityMode);
        setValue(""); // Clear input when switching modes
        setSelectedSuggestions([]); // Clear selections when switching modes
        setCurrentSuggestionSet(0); // Reset suggestion set
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (selectedSuggestions.includes(suggestion)) {
            setSelectedSuggestions(prev => prev.filter(s => s !== suggestion));
        } else {
            // If it's a direct search, set the value and submit
            setValue(suggestion);
            setSelectedSuggestions([]);
            // Submit the search immediately
            setTimeout(() => {
                onSearch(suggestion);
            }, 100);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
            <div className="w-full">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={isActivityMode ? "activity" : "vibe"}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-bold text-center text-black font-display mb-8"
                    >
                        {isActivityMode ? "What are you up to?" : "How do you want to feel?"}
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
                                isActivityMode
                                    ? "Describe the activities you're planning (concert, hike, movie night, etc.)..."
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
                    <motion.button
                        onClick={toggleMode}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                    >
                        {isActivityMode ? (
                            <>
                                <HeartHandshake className="w-5 h-5" />
                                <span>Vibe Planner</span>
                            </>
                        ) : (
                            <>
                                <CalendarDays className="w-5 h-5" />
                                <span>Activity Planner</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {selectedSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
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
                    {(isActivityMode ? activitySuggestions : vibeSuggestions)[currentSuggestionSet].map((suggestion) => (
                        <ActionButton
                            key={suggestion}
                            icon={getIconForSuggestion(suggestion)}
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
function getIconForSuggestion(suggestion: string): React.ReactNode {
    const iconMap: { [key: string]: React.ReactNode } = {
        'Relaxed': <ImageIcon className="w-4 h-4" />,
        'Energized': <Figma className="w-4 h-4" />,
        'Creative': <FileUp className="w-4 h-4" />,
        'Focused': <MonitorIcon className="w-4 h-4" />,
        'Pain Relief': <CircleUserRound className="w-4 h-4" />,
        'Social Event': <CalendarDays className="w-4 h-4" />,
        'Creative Work': <MonitorIcon className="w-4 h-4" />,
        'Hiking': <FileUp className="w-4 h-4" />,
        'Movie Night': <CircleUserRound className="w-4 h-4" />,
        'Concert': <Figma className="w-4 h-4" />,
    };
    
    return iconMap[suggestion] || <ImageIcon className="w-4 h-4" />;
}