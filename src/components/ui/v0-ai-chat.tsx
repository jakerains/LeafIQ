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
    Info,
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

// Type for chat messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
    
    // Scroll to bottom of chat when new messages appear
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSubmit = () => {
        // Use the value from the input which already contains the selected suggestions
        const finalQuery = value.trim();
            
        if (finalQuery) {
            // Handle differently based on mode
            if (mode === 'cannabis') {
                // Add user message to chat history
                setChatHistory(prev => [...prev, { role: 'user', content: finalQuery }]);
                setIsChatLoading(true);
                
                // Simulate AI processing delay for more natural feel
                setTimeout(() => {
                    // Generate educational response
                    const response = getEducationalResponse(finalQuery);
                    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
                    setIsChatLoading(false);
                    
                    // Check if user specifically requested product recommendations
                    if (finalQuery.toLowerCase().includes('recommend') || 
                        finalQuery.toLowerCase().includes('suggestion') || 
                        finalQuery.toLowerCase().includes('product') || 
                        finalQuery.toLowerCase().includes('strain') && 
                        (finalQuery.toLowerCase().includes('for me') || finalQuery.toLowerCase().includes('should i'))) {
                        
                        // Send to recommendation engine with cannabis context
                        const recommendationQuery = `Cannabis Question: ${finalQuery}`;
                        onSearch(recommendationQuery);
                    }
                }, 1000);
            } else {
                // For vibe and activity modes, prefix accordingly to help the AI understand context
                let query;
                if (mode === 'activity') {
                    query = `Activity: ${finalQuery}`;
                } else {
                    query = finalQuery;
                }
                
                onSearch(query);
            }
            
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
        
        // Clear chat history when switching to/from cannabis mode
        if (newMode === 'cannabis' || mode === 'cannabis') {
            setChatHistory([]);
        }
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

        // For cannabis mode, if a suggestion was clicked, treat it as a submission
        if (mode === 'cannabis') {
            setTimeout(() => {
                handleSubmit();
            }, 100);
        }
    };
    
    // Generate educational responses about cannabis
    const getEducationalResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        
        // Responses for general cannabis questions
        if (lowerQuery.includes('what is thc') || lowerQuery === 'thc') {
            return "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that creates the 'high' sensation. It works by binding to cannabinoid receptors in the brain, affecting things like thinking, memory, pleasure, coordination, and time perception. Different strains and products contain varying levels of THC, which impacts the intensity and nature of effects.";
        } 
        
        if (lowerQuery.includes('cbd benefit') || lowerQuery === 'cbd') {
            return "CBD (cannabidiol) offers several potential benefits without causing intoxication. These include anxiety reduction, pain relief, anti-inflammatory effects, and possible help with sleep issues. Many people use CBD for conditions like chronic pain, inflammation, anxiety, PTSD, and epilepsy. Unlike THC, CBD doesn't produce a high, making it appealing for therapeutic use. Research continues to explore its effectiveness for various health conditions.";
        }
        
        if (lowerQuery.includes('terpene') && (lowerQuery.includes('what') || lowerQuery.includes('explain'))) {
            return "Terpenes are aromatic compounds found in cannabis and many other plants that give them distinctive smells and flavors. Beyond aroma, terpenes play a crucial role in the effects of cannabis through the 'entourage effect' - they work synergistically with cannabinoids like THC and CBD. Common cannabis terpenes include myrcene (relaxing), limonene (uplifting), pinene (focusing), and linalool (calming). Each strain has a unique terpene profile that contributes to its specific effects and therapeutic properties.";
        }
        
        if ((lowerQuery.includes('indica') || lowerQuery.includes('sativa')) && 
            (lowerQuery.includes('difference') || lowerQuery.includes('vs'))) {
            return "Traditionally, Indica strains are described as physically sedating, perfect for relaxing evenings, with effects felt throughout the body ('in-da-couch'). Sativas are said to be energizing, cerebral, and better for daytime use with effects felt in the head. However, modern cannabis science has evolved beyond this simplistic divide. The specific effects of any strain actually depend more on its unique combination of cannabinoids, terpenes, and your individual endocannabinoid system rather than just its Indica/Sativa classification. Many experts now consider these labels outdated or oversimplified.";
        }
        
        if (lowerQuery.includes('edible') && (lowerQuery.includes('dosing') || lowerQuery.includes('dose'))) {
            return "When dosing edibles, the golden rule is 'start low and go slow.' For beginners, 2-5mg of THC is a good starting point. More experienced users may be comfortable with 5-15mg, while heavy users might use 20-50mg or more. Remember that edibles take 30-90 minutes to take effect and the high can last 4-8 hours. Unlike smoking, edibles are processed by your liver, creating a stronger and longer-lasting effect. Wait at least 2 hours before considering more, as effects can intensify over time. Always check product labels for accurate dosing information.";
        }
        
        if (lowerQuery.includes('medical') || lowerQuery.includes('medicinal')) {
            return "Medical cannabis is used to treat various conditions including chronic pain, nausea from chemotherapy, muscle spasms from multiple sclerosis, epilepsy, PTSD, anxiety, and sleep disorders. Different cannabinoids target different symptoms - THC may help with pain and nausea, while CBD addresses inflammation and anxiety. The effectiveness varies by individual and condition. Many states have medical cannabis programs with specific qualifying conditions, though regulations vary. Always consult a healthcare provider about using cannabis medically, especially regarding dosing, potential drug interactions, and treatment plans.";
        }
        
        if (lowerQuery.includes('consumption') || lowerQuery.includes('method') || lowerQuery.includes('how to use')) {
            return "Cannabis can be consumed in several ways, each with different onset times and duration: (1) Inhalation (smoking or vaporizing) provides fast effects (within minutes) lasting 2-3 hours, (2) Edibles are processed through the digestive system, taking 30-90 minutes to feel effects that last 4-8 hours, (3) Tinctures applied under the tongue offer a middle ground with effects in 15-45 minutes lasting 2-4 hours, (4) Topicals are applied to the skin for localized relief without intoxication. Different methods suit different needs - consider your desired effect timing, duration, discretion needs, and lung health when choosing.";
        }
        
        if (lowerQuery.includes('entourage') || (lowerQuery.includes('full') && lowerQuery.includes('spectrum'))) {
            return "The entourage effect refers to how cannabis compounds work better together than in isolation. Rather than just THC or CBD alone, the hundreds of cannabinoids, terpenes, and flavonoids in the plant interact synergistically, potentially enhancing therapeutic benefits and modulating side effects. This is why full-spectrum cannabis products (containing all naturally occurring compounds) often provide different effects than isolates. This concept is increasingly supported by research and explains why different cannabis strains with similar THC levels can produce distinctly different experiences.";
        }
        
        if (lowerQuery.includes('cbd vs thc') || (lowerQuery.includes('difference') && lowerQuery.includes('cbd') && lowerQuery.includes('thc'))) {
            return "THC and CBD are the two most prominent cannabinoids in cannabis, but they work quite differently. THC is psychoactive, producing the 'high' sensation, while CBD is non-intoxicating. THC binds directly to CB1 receptors in the brain, while CBD works more indirectly on the endocannabinoid system. THC can help with pain, nausea, and appetite stimulation but may cause anxiety or paranoia in some people. CBD is used for anxiety, inflammation, seizures, and may actually counteract some of THC's side effects. Products range from THC-dominant to CBD-dominant, with many balanced options available for those seeking therapeutic benefits with minimal intoxication.";
        }
        
        if (lowerQuery.includes('endocannabinoid')) {
            return "The endocannabinoid system (ECS) is a complex cell-signaling network discovered during research into how THC affects the body. It exists in all vertebrates and plays crucial roles in regulating sleep, mood, appetite, memory, reproduction, and pain sensation. The ECS consists of three components: endocannabinoids (naturally produced cannabinoids in your body), receptors (CB1 primarily in the brain and CB2 mainly in the immune system), and enzymes that break down endocannabinoids. Cannabis compounds like THC and CBD interact with this system, which explains their wide range of effects. The ECS works to maintain homeostasis, or biological balance, throughout your body.";
        }
        
        if (lowerQuery.includes('strain') && lowerQuery.includes('recommend') || 
           (lowerQuery.includes('what') && lowerQuery.includes('strain'))) {
            return "I'd be happy to recommend cannabis strains, but I'd need to know what effects you're looking for (relaxation, energy, creativity, pain relief, etc.) and your experience level. If you'd like product recommendations, just let me know what kind of experience you're seeking, and I can suggest some options. Would you like me to show you some product recommendations based on specific effects or needs?";
        }
        
        if (lowerQuery.includes('first time') || lowerQuery.includes('beginner') || lowerQuery.includes('new to cannabis')) {
            return "For first-time cannabis users, start with low-THC products (5-10%) and minimal amounts. Consider high-CBD varieties that are less likely to cause anxiety. Begin with just 1-2 puffs if smoking/vaping, or 2-5mg THC for edibles. Create a comfortable environment with trusted friends, stay hydrated, and have snacks ready. Avoid alcohol and plan for 2-4 hours of effects. Remember that edibles take 30-90 minutes to work and last longer. Don't worry if your first experience isn't perfect - finding what works for you is a personal journey. Feel free to ask our staff for beginner-friendly recommendations.";
        }
        
        if (lowerQuery.includes('legal') || lowerQuery.includes('laws')) {
            return "Cannabis legality varies dramatically by location. In the United States, it remains federally illegal but many states have legalized it for medical and/or adult recreational use. Each state has different regulations regarding purchase limits, possession amounts, cultivation, and qualifying medical conditions. Other countries range from fully legal (Canada, Uruguay) to decriminalized (Portugal, Netherlands) to strictly prohibited. Always check your local laws before purchasing or possessing cannabis, especially when traveling, as penalties can be severe in some jurisdictions. Even in legal areas, there are typically restrictions on public consumption and driving under the influence.";
        }
        
        if (lowerQuery.includes('cbd oil') || lowerQuery.includes('cbd tincture')) {
            return "CBD oil or tincture is a liquid extract containing cannabidiol (CBD) mixed with a carrier oil like MCT or hemp seed oil. It's typically used by placing drops under the tongue for faster absorption, though it can also be added to foods or beverages. CBD oils vary in potency (from 5mg to 100+mg per serving) and may be full-spectrum (containing all cannabis compounds), broad-spectrum (CBD plus other cannabinoids but no THC), or isolate (pure CBD). People use CBD oil for anxiety, pain, inflammation, sleep issues, and various other conditions, though research is still developing. CBD oil generally doesn't cause intoxication as it contains minimal or no THC.";
        }
        
        if (lowerQuery.includes('recommend') || lowerQuery.includes('suggestion') || lowerQuery.includes('products for')) {
            return "I'd be happy to recommend some products tailored to your needs. To provide the best recommendations, could you tell me what effects you're looking for (relaxation, energy, pain relief, sleep aid, etc.), your experience level with cannabis, and your preferred consumption method (flower, vape, edible, etc.)? Once I understand your preferences better, I can suggest some great products we have available.";
        }
        
        // Default educational response for other cannabis questions
        return "Cannabis contains over 100 cannabinoids (like THC and CBD) and numerous terpenes that work together to create different effects. The specific effects you'll experience depend on the strain's chemical profile, your individual endocannabinoid system, consumption method, dosage, and setting. Modern cannabis science focuses on the entire chemical profile rather than just THC content or indica/sativa categories to better predict effects. If you have more specific questions about cannabis compounds, consumption methods, or therapeutic applications, feel free to ask!";
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
                    {/* Chat history for cannabis mode */}
                    {mode === 'cannabis' && chatHistory.length > 0 && (
                        <div 
                            ref={chatContainerRef}
                            className="max-h-[300px] overflow-y-auto p-4 space-y-3 border-b border-gray-100"
                        >
                            {chatHistory.map((message, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[80%] p-3 rounded-xl ${
                                            message.role === 'user' 
                                                ? 'bg-primary-100 text-primary-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            
                            {isChatLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-xl bg-gray-100 text-gray-800 flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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
                            disabled={isLoading || isChatLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="group p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                                disabled={isLoading || isChatLoading}
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
                                disabled={isLoading || isChatLoading}
                            >
                                <PlusIcon className="w-4 h-4" />
                                Product
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!value.trim() || isLoading || isChatLoading}
                                className={cn(
                                    "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center justify-between gap-1",
                                    value.trim() && !isLoading && !isChatLoading
                                        ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-600 cursor-pointer active:translate-y-0.5 active:shadow-inner"
                                        : "text-gray-400 border-gray-300 cursor-not-allowed"
                                )}
                            >
                                {isLoading || isChatLoading ? (
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden ${
                                mode === 'vibe' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            whileHover={{ 
                                y: -2,
                                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ 
                                y: 0,
                                scale: 0.97,
                                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.1 }
                            }}
                            disabled={isLoading || isChatLoading}
                        >
                            {/* Glimmer effect - ONLY on hover for active button */}
                            {mode === 'vibe' && (
                                <motion.div
                                    className="absolute inset-0 w-40 h-full bg-white opacity-0"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ 
                                        x: ["0%", "100%"],
                                        opacity: [0, 0.3, 0]
                                    }}
                                    transition={{ 
                                        duration: 0.8,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                            <HeartHandshake className="w-5 h-5" />
                            <span>Vibe Planner</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => changeMode('activity')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden ${
                                mode === 'activity' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            whileHover={{ 
                                y: -2,
                                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ 
                                y: 0,
                                scale: 0.97,
                                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.1 }
                            }}
                            disabled={isLoading || isChatLoading}
                        >
                            {/* Glimmer effect - ONLY on hover for active button */}
                            {mode === 'activity' && (
                                <motion.div
                                    className="absolute inset-0 w-40 h-full bg-white opacity-0"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ 
                                        x: ["0%", "100%"],
                                        opacity: [0, 0.3, 0]
                                    }}
                                    transition={{ 
                                        duration: 0.8,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                            <CalendarDays className="w-5 h-5" />
                            <span>Activity Planner</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => changeMode('cannabis')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden ${
                                mode === 'cannabis' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            whileHover={{ 
                                y: -2,
                                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ 
                                y: 0,
                                scale: 0.97,
                                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.1 }
                            }}
                            disabled={isLoading || isChatLoading}
                        >
                            {/* Glimmer effect - ONLY on hover for active button */}
                            {mode === 'cannabis' && (
                                <motion.div
                                    className="absolute inset-0 w-40 h-full bg-white opacity-0"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ 
                                        x: ["0%", "100%"],
                                        opacity: [0, 0.3, 0]
                                    }}
                                    transition={{ 
                                        duration: 0.8,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
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
                            disabled={isLoading || isChatLoading} 
                            isSelected={selectedSuggestions.includes(suggestion)}
                        />
                    ))}
                </div>
                
                {mode === 'cannabis' && (
                    <div className="mt-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                        >
                            <Info className="w-3 h-3 mr-1" />
                            Ask any cannabis question or request product recommendations
                        </motion.div>
                    </div>
                )}
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
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm relative overflow-hidden",
                disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : isSelected
                        ? "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200"
                        : "bg-white text-gray-700 border-gray-200 hover:text-gray-900 hover:bg-gray-50"
            )}
            whileHover={disabled ? {} : { 
                y: -2, 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={disabled ? {} : { 
                scale: 0.97,
                y: 0,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.1 }
            }}
            onClick={onClick}
            disabled={disabled}
        >
            {/* Glimmer effect - now only appears on hover, not as continuous animation */}
            {!disabled && !isSelected && (
                <motion.div
                    className="absolute inset-0 w-20 h-full bg-white opacity-0"
                    initial={{ opacity: 0, x: "-100%" }}
                    whileHover={{ 
                        x: ["0%", "100%"],
                        opacity: [0, 0.15, 0]
                    }}
                    transition={{ 
                        duration: 0.8,
                        ease: "easeInOut"
                    }}
                />
            )}
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