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
    Leaf,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateInventoryInsight, getInventoryRAGContext } from '../../utils/budInventoryAccess';
import { useAuthStore } from '../../stores/authStore';
import { useSimpleAuthStore } from '../../stores/simpleAuthStore';

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
    onSearch: (query: string, options?: { inPlace?: boolean }) => void;
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
    const { organizationId } = useSimpleAuthStore();

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
        ['Cannabis history', 'Medical uses', 'Consumption methods', 'Strain differences', 'Endocannabinoid system'],
        ['First-time tips', 'Product storage', 'Legal questions', 'Terpene effects']
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

    // When switching to cannabis mode, show a friendly intro message
    useEffect(() => {
        if (mode === 'cannabis' && chatHistory.length === 0) {
            setChatHistory([{
                role: 'assistant',
                content: "👋 Hey there! Welcome to your cannabis education center!\n\nI'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!\n\n💡 **Quick tip:** Try clicking one of the suggestion cards below, or type your own question about cannabis. I can explain everything from basic terms to advanced topics!"
            }]);
        }
    }, [mode, chatHistory.length]);

    // Generate educational responses about cannabis using the Bud personality with real-time inventory RAG
    const getEducationalResponse = async (query: string): Promise<string> => {
        const lowerQuery = query.toLowerCase();
        
        // Get organization ID for inventory context
        const profile = useAuthStore.getState().profile;
        const orgId = organizationId || profile?.organization_id;
        
        // Get inventory RAG context FIRST - this determines if we should include product info
        let inventoryContext = null;
        if (orgId) {
            inventoryContext = await getInventoryRAGContext(query, orgId);
        }
        
        // Cannabinoids
        if (lowerQuery.includes('what is thc') || lowerQuery === 'thc' || lowerQuery.includes('explain thc')) {
            let response = "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that creates the 'high' sensation. Think of it as the gas pedal for your cannabis experience.\n\n• It works by binding to cannabinoid receptors in your brain\n• Affects things like mood, thinking, and sensory perception\n• Potency typically ranges from 15-30% in modern flower\n\nWant to know about different THC variants or how it compares to other cannabinoids?";
            
            // Add inventory context if RAG determined it's relevant
            if (inventoryContext?.shouldUseInventory && inventoryContext.relevantProducts.length > 0) {
                response += `\n\n💡 Looking at our current inventory, we have ${inventoryContext.inventoryStats.totalProducts} products available with THC levels ranging from ${inventoryContext.inventoryStats.thcRange.min.toFixed(1)}% to ${inventoryContext.inventoryStats.thcRange.max.toFixed(1)}%.`;
                
                if (inventoryContext.relevantProducts.length > 0) {
                    const examples = inventoryContext.relevantProducts.slice(0, 2).map(p => 
                        `${p.name} by ${p.brand} (${p.variant?.thc_percentage?.toFixed(1)}% THC)`
                    );
                    response += ` For example, we have ${examples.join(' and ')}.`;
                }
            }
            
            return response;
        } 
        
        if (lowerQuery.includes('thc variants') || lowerQuery.includes('types of thc')) {
            return "Great question! Beyond the standard Delta-9-THC that most people know, there's a whole family of THC variants:\n\n• Delta-8-THC: Milder psychoactive effects, often described as clearer and less anxiety-inducing\n• THCV: May actually suppress appetite at low doses (unlike regular THC) and offers more energetic effects\n• Delta-10-THC: Newer, less researched variant with reportedly more stimulating effects\n• THCa: The non-psychoactive acid form found in raw cannabis that converts to THC when heated\n\nThey all interact with your endocannabinoid system slightly differently, creating unique experiences. Want to know more about any specific variant?";
        }
        
        if (lowerQuery.includes('cbd benefit') || lowerQuery === 'cbd' || lowerQuery.includes('what is cbd')) {
            return "CBD (cannabidiol) is the second most famous cannabis compound, but unlike THC, it doesn't cause intoxication. If THC is the gas pedal, CBD is like the brake.\n\n• Helps with anxiety, inflammation, and certain types of pain\n• May counterbalance some of THC's uncomfortable effects\n• Being researched for numerous medical applications from epilepsy to anxiety\n\nMany people appreciate CBD for its therapeutic potential without the high. Would you like to know about how CBD works or how it interacts with THC?";
        }
        
        // Terpenes - MORE ROBUST to catch all variations and casual questions
        // First check for exact matches which are highest priority
        if (lowerQuery === 'terps' || lowerQuery === 'terpenes' || 
            lowerQuery === 'terps?' || lowerQuery === 'terpenes?' || 
            lowerQuery === 'what are terps' || lowerQuery === 'what are terpenes' ||
            lowerQuery === 'whats terps' || lowerQuery === 'whats terpenes' ||
            lowerQuery === 'what is terps' || lowerQuery === 'what is terpenes') {
            let response = "Terpenes (or 'terps' for short) are aromatic compounds that give cannabis its distinctive smell and taste – think of them as the essential oils of the cannabis plant.\n\n• They create the unique scent profiles (citrusy, piney, earthy, etc.)\n• They influence the effects you feel beyond just smell\n• Research suggests they work with cannabinoids to shape your experience (the entourage effect)\n\nFor example, myrcene tends to be relaxing (like in mangoes!), while limonene is often uplifting (like in citrus peels). We have strains rich in different terpenes that create unique experiences. Would you like to know about specific terpenes or how they affect your cannabis experience?";
            
            // Add inventory context if RAG determined it's relevant
            if (inventoryContext?.shouldUseInventory && inventoryContext.relevantProducts.length > 0) {
                response += `\n\n💡 In our current inventory, we have several products with rich terpene profiles:`;
                
                inventoryContext.relevantProducts.slice(0, 3).forEach((product, index) => {
                    response += `\n${index + 1}. **${product.name}** by ${product.brand}`;
                    if (product.variant.terpene_profile && Object.keys(product.variant.terpene_profile).length > 0) {
                        const topTerpenes = Object.entries(product.variant.terpene_profile)
                            .sort(([,a], [,b]) => (b as number) - (a as number))
                            .slice(0, 2)
                            .map(([name, value]) => `${name} (${(value as number).toFixed(1)}%)`)
                            .join(', ');
                        response += ` - Top terpenes: ${topTerpenes}`;
                    }
                });
            }
            
            return response;
        }
        
        // Then check for broader pattern matches
        if ((lowerQuery.includes('terpene') || lowerQuery.includes('terp')) && 
            (lowerQuery.includes('what') || lowerQuery.includes('explain') || 
             lowerQuery.includes('whats') || lowerQuery.includes('tell') || 
             lowerQuery.includes('are ') || lowerQuery.includes('is ') || 
             lowerQuery.includes('about'))) {
            return "Terpenes (or 'terps' for short) are aromatic compounds that give cannabis its distinctive smell and taste – think of them as the essential oils of the cannabis plant.\n\n• They create the unique scent profiles (citrusy, piney, earthy, etc.)\n• They influence the effects you feel beyond just smell\n• Research suggests they work with cannabinoids to shape your experience (the entourage effect)\n\nFor example, myrcene tends to be relaxing (like in mangoes!), while limonene is often uplifting (like in citrus peels). We have strains rich in different terpenes that create unique experiences. Would you like to know about specific terpenes or how they affect your cannabis experience?";
        }
        
        // Strain types
        if (lowerQuery.includes('indica vs sativa') || lowerQuery.includes('indica sativa') || 
            lowerQuery.includes('difference between indica') || lowerQuery.includes('indica or sativa')) {
            let response = "Great question! The indica vs sativa classification is actually more complex than most people think:\n\n**Traditional Understanding:**\n• **Indica**: Shorter, bushier plants → supposedly more relaxing, 'body high'\n• **Sativa**: Taller, thinner plants → supposedly more energizing, 'head high'\n• **Hybrid**: Mix of both\n\n**Modern Reality:**\nMost cannabis today is actually hybrid, and the effects depend more on the specific cannabinoid and terpene profile than whether it's labeled indica or sativa. The plant structure doesn't always predict the effects!\n\nWhat really matters is the chemical composition - THC/CBD ratios and terpene profiles.";
            
            // Add inventory context if RAG determined it's relevant
            if (inventoryContext?.shouldUseInventory && inventoryContext.inventoryStats.strainTypes.length > 0) {
                const strainCounts = inventoryContext.inventoryStats.strainTypes.map(type => {
                    const count = inventoryContext.relevantProducts.filter(p => p.strain_type === type).length;
                    return `${count} ${type}`;
                });
                response += `\n\n💡 In our current inventory, we have ${strainCounts.join(', ')} products available. Each has its own unique cannabinoid and terpene profile that determines the actual effects.`;
            }
            
            return response;
        }
        
        // Edibles
        if (lowerQuery.includes('edible') || lowerQuery.includes('gummies') || 
            lowerQuery.includes('how do edibles work') || lowerQuery.includes('edible dosing')) {
            let response = "Edibles are a completely different experience from smoking or vaping! Here's what you need to know:\n\n**How They Work:**\n• Processed through your digestive system and liver\n• THC converts to 11-hydroxy-THC (more potent than regular THC)\n• Takes 30 minutes to 2+ hours to kick in\n• Effects last 4-8 hours (much longer than smoking)\n\n**Dosing Tips:**\n• Start low (2.5-5mg THC) and go slow\n• Wait at least 2 hours before taking more\n• Effects can be stronger and more body-focused\n• Food in your stomach affects absorption time";
            
            // Add inventory context if RAG determined it's relevant
            if (inventoryContext?.shouldUseInventory) {
                const edibleProducts = inventoryContext.relevantProducts.filter(p => p.category === 'edibles');
                if (edibleProducts.length > 0) {
                    response += `\n\n💡 We currently have ${edibleProducts.length} edible products available, including ${edibleProducts.slice(0, 2).map(p => `${p.name} by ${p.brand}`).join(' and ')}.`;
                }
            }
            
            return response;
        }
        
        // Default response with Bud personality - now enhanced with inventory context
        let defaultResponse = "Great question about cannabis! Cannabis contains over 100 cannabinoids (like THC and CBD) and numerous terpenes that work together to create different effects.\n\nThe specific experience you'll have depends on the chemical profile of the product, your individual endocannabinoid system, consumption method, dosage, and environment.\n\nI'd be happy to dive deeper into any specific aspect of cannabis that interests you - just let me know what you'd like to learn more about!";
        
        // Add general inventory context if RAG thinks it's relevant
        if (inventoryContext?.shouldUseInventory && inventoryContext.inventoryStats.totalProducts > 0) {
            defaultResponse += `\n\n💡 We have ${inventoryContext.inventoryStats.totalProducts} products available across ${inventoryContext.inventoryStats.categories.join(', ')} categories. Feel free to ask about any specific products or categories!`;
        }
        
        return defaultResponse;
    };



    const handleSubmit = () => {
        // Use the value from the input which already contains the selected suggestions
        const finalQuery = value.trim();
            
        if (finalQuery) {
            // Handle differently based on mode
            if (mode === 'cannabis') {
                // Add user message to chat history
                setChatHistory(prev => [...prev, { role: 'user', content: finalQuery }]);
                setIsChatLoading(true);
                
                // Generate educational response using the Bud personality with real-time inventory
                setTimeout(async () => {
                    const response = await getEducationalResponse(finalQuery);
                    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
                    setIsChatLoading(false);
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
            
            // Show intro message when switching to cannabis mode
            if (newMode === 'cannabis') {
                setChatHistory([{
                    role: 'assistant',
                    content: "👋 Hey there! Welcome to your cannabis education center!\n\nI'm Bud, and I'm here to answer all your cannabis questions in a friendly, easy-to-understand way. No judgment, just helpful information!\n\n💡 **Quick tip:** Try clicking one of the suggestion cards below, or type your own question about cannabis. I can explain everything from basic terms to advanced topics!"
                }]);
            }
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
                    {mode === 'cannabis' ? (
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center mb-6"
                        >
                            <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">
                                Cannabis Education Center
                            </h1>
                            <p className="text-lg text-gray-600">
                                Learn about cannabis in a friendly, judgment-free space
                            </p>
                        </motion.div>
                    ) : (
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
                                : "What are you up to?"}
                        </motion.h1>
                    )}
                </AnimatePresence>

                {mode === 'cannabis' ? (
                    // Beautiful Cannabis Questions Interface
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 overflow-hidden max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-green-100 bg-white bg-opacity-50">
                            <div className="flex items-center space-x-4">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                                >
                                    <img src="/budbuddy.png" alt="Bud" className="h-14 w-14 object-contain" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Cannabis Guide</h2>
                                    <p className="text-gray-600">Your personal educator for all things cannabis</p>
                                </div>
                            </div>
                        </div>

                        {/* Welcome state - Enhanced Customer-Friendly Design */}
                        {chatHistory.length === 0 && (
                            <div className="p-8 bg-white bg-opacity-90">
                                <div className="flex items-start space-x-4">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        className="h-12 w-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                    >
                                        <Leaf className="h-6 w-6 text-green-600" />
                                    </motion.div>
                                    <div className="flex-1 text-left">
                                        <motion.h3 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-xl font-bold text-gray-900 mb-3"
                                        >
                                            Hi there! I'm Bud, your friendly cannabis educator 🌿
                                        </motion.h3>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-gray-700 mb-4 leading-relaxed"
                                        >
                                            Ask me anything about cannabis and I'll help you learn! I can explain things like:
                                        </motion.p>
                                        
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
                                        >
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">🧪</span>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">What terpenes are</span>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">💊</span>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">THC vs CBD differences</span>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">🍪</span>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">How edibles work</span>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">🌿</span>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">Indica vs Sativa</span>
                                            </div>
                                        </motion.div>
                                        
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-green-800 mb-1">
                                                        Fun fact to get started:
                                                    </p>
                                                    <p className="text-sm text-green-700 leading-relaxed">
                                                        Cannabis contains over 100 cannabinoids and numerous aromatic compounds called terpenes. 
                                                        These work together to create unique effects - it's not just about THC levels!
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="text-sm text-gray-600 mt-4 italic"
                                        >
                                            Type a question below or click any suggestion to get started! 👇
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resizable Chat history for cannabis mode */}
                        {chatHistory.length > 0 && (
                            <div 
                                ref={chatContainerRef}
                                className="overflow-y-auto p-6 space-y-4 bg-white bg-opacity-70"
                                style={{ 
                                    minHeight: '200px',
                                    maxHeight: chatHistory.length > 4 ? '450px' : '300px',
                                    height: 'auto'
                                }}
                            >
                                {chatHistory.map((message, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                                <Leaf className="h-5 w-5 text-green-600" />
                                            </div>
                                        )}
                                        <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'flex-1'}`}>
                                            {message.role === 'user' ? (
                                                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-2xl font-medium">
                                                    {message.content}
                                                </div>
                                            ) : (
                                                                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
                                            {message.content.split('\n\n').map((paragraph, i) => {
                                                // Check if this is a special formatted line (starts with emoji or has **)
                                                const hasEmoji = /^[👋💡🌿🧪💊🍪]/.test(paragraph);
                                                const hasBold = paragraph.includes('**');
                                                
                                                // Process bold text
                                                const processText = (text: string) => {
                                                    if (!hasBold) return text;
                                                    const parts = text.split(/\*\*(.*?)\*\*/g);
                                                    return parts.map((part, index) => 
                                                        index % 2 === 1 
                                                            ? <span key={index} className="font-semibold text-gray-900">{part}</span>
                                                            : part
                                                    );
                                                };
                                                
                                                return (
                                                    <motion.p 
                                                        key={i} 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`text-gray-700 leading-relaxed ${i > 0 ? 'mt-3' : ''} ${hasEmoji ? 'text-left' : ''}`}
                                                    >
                                                        {paragraph.split('\n').map((line, j) => (
                                                            <span key={j}>
                                                                {processText(line)}
                                                                {j < paragraph.split('\n').length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </motion.p>
                                                );
                                            })}
                                        </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {isChatLoading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Leaf className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                            <span className="text-green-600 text-sm ml-2">Learning about cannabis...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Input area */}
                        <div className="p-4 bg-gray-50 border-t border-green-100">
                            <div className="flex items-start gap-3">
                                <textarea
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        adjustHeight();
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything! Try 'What are terpenes?' or 'How do edibles work?'"
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-700 bg-white"
                                    rows={1}
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                    disabled={isLoading || isChatLoading}
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!value.trim() || isLoading || isChatLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-3 rounded-2xl flex items-center justify-center ${
                                        value.trim() && !isLoading && !isChatLoading
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } transition-all`}
                                >
                                    {isLoading || isChatLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ArrowUpIcon className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Original interface for vibe and activity modes
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
                )}

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
                            <CalendarDays className="w-5 h-5" />
                            <span>Activity Planner</span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => changeMode('cannabis')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden ${
                                mode === 'cannabis' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                            whileHover={{ 
                                y: -2,
                                boxShadow: mode === 'cannabis' 
                                    ? "0 8px 25px rgba(34, 197, 94, 0.3)"
                                    : "0 6px 10px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ 
                                y: 0,
                                scale: 0.97,
                                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.1 }
                            }}
                            disabled={isLoading || isChatLoading}
                        >
                            <Leaf className="w-5 h-5" />
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

                {mode === 'cannabis' ? (
                    // Beautiful Cannabis Questions Suggestions
                    <div className="mt-6 space-y-4">
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-gray-600 text-sm"
                        >
                            Popular cannabis questions to get you started
                        </motion.p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
                            {getCurrentSuggestions().map((suggestion, index) => (
                                <motion.button
                                    key={suggestion}
                                    type="button"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -3,
                                        boxShadow: "0 12px 30px rgba(34, 197, 94, 0.2)"
                                    }}
                                    whileTap={{ 
                                        scale: 0.98,
                                        y: 0
                                    }}
                                    className={`
                                        group relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm text-left
                                        ${selectedSuggestions.includes(suggestion)
                                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 text-green-800 shadow-lg'
                                            : 'bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-gray-200 hover:border-green-300 text-gray-700 hover:shadow-lg'
                                        }
                                    `}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    disabled={isLoading || isChatLoading}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                                            ${selectedSuggestions.includes(suggestion)
                                                ? 'bg-green-200 text-green-700 shadow-sm'
                                                : 'bg-gray-100 group-hover:bg-green-100 text-gray-600 group-hover:text-green-600 group-hover:shadow-sm'
                                            }
                                        `}>
                                            {getIconForSuggestion(suggestion, mode)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold leading-tight truncate">
                                                {suggestion}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-green-600 transition-colors">
                                                {suggestion === 'What is THC?' && 'Learn about psychoactive compounds'}
                                                {suggestion === 'CBD benefits' && 'Therapeutic effects and uses'}
                                                {suggestion === 'Terpenes explained' && 'Aromatic compounds in cannabis'}
                                                {suggestion === 'Indica vs Sativa' && 'Understanding strain types'}
                                                {suggestion === 'Edible dosing' && 'Safe consumption guidelines'}
                                                {suggestion === 'Cannabis history' && 'Origins and cultural impact'}
                                                {suggestion === 'Medical uses' && 'Therapeutic applications'}
                                                {suggestion === 'Consumption methods' && 'Ways to use cannabis'}
                                                {suggestion === 'Strain differences' && 'Varieties and effects'}
                                                {suggestion === 'Endocannabinoid system' && 'How cannabis works in body'}
                                                {suggestion === 'First-time tips' && 'Getting started safely'}
                                                {suggestion === 'Product storage' && 'Keeping cannabis fresh'}
                                                {suggestion === 'Legal questions' && 'Laws and regulations'}
                                                {suggestion === 'Terpene effects' && 'How aromas affect you'}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedSuggestions.includes(suggestion) && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}
                                    
                                    {/* Subtle hover indicator */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-emerald-400/0 to-green-400/0 group-hover:from-green-400/5 group-hover:via-emerald-400/5 group-hover:to-green-400/5 transition-all duration-300 pointer-events-none"></div>
                                </motion.button>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center text-xs text-green-600 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200">
                                <Leaf className="w-3 h-3 mr-2" />
                                <span>Ask anything about cannabis - from basic to advanced topics</span>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    // Original suggestions for vibe and activity modes
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
        'What is THC?': <Leaf className="w-4 h-4" />,
        'CBD benefits': <Leaf className="w-4 h-4" />,
        'Terpenes explained': <Leaf className="w-4 h-4" />,
        'Indica vs Sativa': <Leaf className="w-4 h-4" />,
        'Edible dosing': <Info className="w-4 h-4" />,
        'Cannabis history': <Book className="w-4 h-4" />,
        'Medical uses': <Info className="w-4 h-4" />,
        'Consumption methods': <Info className="w-4 h-4" />,
        'Strain differences': <Leaf className="w-4 h-4" />,
        'Endocannabinoid system': <Leaf className="w-4 h-4" />,
        'First-time tips': <Info className="w-4 h-4" />,
        'Product storage': <Info className="w-4 h-4" />,
        'Legal questions': <Book className="w-4 h-4" />,
        'Terpene effects': <Leaf className="w-4 h-4" />,
    };
    
    // Choose the appropriate map based on mode
    const activeMap = mode === 'vibe' ? vibeIconMap : 
                     mode === 'activity' ? activityIconMap : 
                     cannabisIconMap;
    
    return activeMap[suggestion] || <Book className="w-4 h-4" />;
}

// Add default export for backwards compatibility
export default VercelV0Chat;