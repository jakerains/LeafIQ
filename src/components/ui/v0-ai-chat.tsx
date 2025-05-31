{`"use client";

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
                textarea.style.height = \`\${minHeight}px\`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = \`\${minHeight}px\`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = \`\${newHeight}px\`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = \`\${minHeight}px\`;
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
                content: "Hi there! I'm Bud Buddy, your friendly cannabis educator. What would you like to know about cannabis? Feel free to ask about terpenes, consumption methods, effects, or any other cannabis topics you're curious about!"
            }]);
        }
    }, [mode, chatHistory.length]);

    const handleSubmit = () => {
        // Use the value from the input which already contains the selected suggestions
        const finalQuery = value.trim();
            
        if (finalQuery) {
            // Handle differently based on mode
            if (mode === 'cannabis') {
                // Add user message to chat history
                setChatHistory(prev => [...prev, { role: 'user', content: finalQuery }]);
                setIsChatLoading(true);
                
                // Generate educational response using the Bud Buddy personality
                setTimeout(() => {
                    const response = getEducationalResponse(finalQuery);
                    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
                    setIsChatLoading(false);
                    
                    // Check if user specifically requested product recommendations
                    if (finalQuery.toLowerCase().includes('recommend') || 
                        finalQuery.toLowerCase().includes('suggestion') || 
                        (finalQuery.toLowerCase().includes('what') && finalQuery.toLowerCase().includes('product')) ||
                        (finalQuery.toLowerCase().includes('which') && finalQuery.toLowerCase().includes('strain')) || 
                        (finalQuery.toLowerCase().includes('for me') || finalQuery.toLowerCase().includes('should i'))) {
                        
                        // Send to recommendation engine with cannabis context
                        const recommendationQuery = \`Cannabis Question: \${finalQuery}\`;
                        onSearch(recommendationQuery);
                    }
                }, 1000);
            } else {
                // For vibe and activity modes, prefix accordingly to help the AI understand context
                let query;
                if (mode === 'activity') {
                    query = \`Activity: \${finalQuery}\`;
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
                    content: "Hi there! I'm Bud Buddy, your friendly cannabis educator. What would you like to know about cannabis? Feel free to ask about terpenes, consumption methods, effects, or any other cannabis topics you're curious about!"
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
                if (prev.includes(\`, \${suggestion}\`)) return prev.replace(\`, \${suggestion}\`, '');
                if (prev.includes(\`\${suggestion}, \`)) return prev.replace(\`\${suggestion}, \`, '');
                return prev;
            });
        } else {
            // Add to selected suggestions
            setSelectedSuggestions(prev => [...prev, suggestion]);
            
            // Update the input value, adding a comma if needed
            setValue(prev => {
                if (!prev.trim()) return suggestion;
                return \`\${prev.trim()}, \${suggestion}\`;
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
    
    // Generate educational responses about cannabis using the Bud Buddy personality
    const getEducationalResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        
        // Cannabinoids
        if (lowerQuery.includes('what is thc') || lowerQuery === 'thc' || lowerQuery.includes('explain thc')) {
            return "THC (tetrahydrocannabinol) is the primary psychoactive compound in cannabis that creates the 'high' sensation. Think of it as the gas pedal for your cannabis experience.\\n\\n• It works by binding to cannabinoid receptors in your brain\\n• Affects things like mood, thinking, and sensory perception\\n• Potency typically ranges from 15-30% in modern flower\\n\\nWant to know about different THC variants or how it compares to other cannabinoids?";
        } 
        
        if (lowerQuery.includes('thc variants') || lowerQuery.includes('types of thc')) {
            return "Great question! Beyond the standard Delta-9-THC that most people know, there's a whole family of THC variants:\\n\\n• Delta-8-THC: Milder psychoactive effects, often described as clearer and less anxiety-inducing\\n• THCV: May actually suppress appetite at low doses (unlike regular THC) and offers more energetic effects\\n• Delta-10-THC: Newer, less researched variant with reportedly more stimulating effects\\n• THCa: The non-psychoactive acid form found in raw cannabis that converts to THC when heated\\n\\nThey all interact with your endocannabinoid system slightly differently, creating unique experiences. Want to know more about any specific variant?";
        }
        
        if (lowerQuery.includes('cbd benefit') || lowerQuery === 'cbd' || lowerQuery.includes('what is cbd')) {
            return "CBD (cannabidiol) is the second most famous cannabis compound, but unlike THC, it doesn't cause intoxication. If THC is the gas pedal, CBD is like the brake.\\n\\n• Helps with anxiety, inflammation, and certain types of pain\\n• May counterbalance some of THC's uncomfortable effects\\n• Being researched for numerous medical applications from epilepsy to anxiety\\n\\nMany people appreciate CBD for its therapeutic potential without the high. Would you like to know about how CBD works or how it interacts with THC?";
        }
        
        if (lowerQuery.includes('cbg') || lowerQuery.includes('cbn') || lowerQuery.includes('cbc') || 
            (lowerQuery.includes('minor') && lowerQuery.includes('cannabinoid'))) {
            return "Beyond THC and CBD, cannabis contains several fascinating minor cannabinoids:\\n\\n• CBG (cannabigerol): The 'mother cannabinoid' that transforms into other compounds, potentially helpful for inflammation and glaucoma\\n• CBN (cannabinol): Created when THC ages, known for sedative properties that may help with sleep\\n• CBC (cannabichromene): Non-intoxicating and being studied for pain relief and brain health\\n\\nThese compounds are typically present in smaller amounts but contribute to the overall experience through the entourage effect. Is there a specific minor cannabinoid you'd like to explore further?";
        }
        
        // Terpenes
        if (lowerQuery.includes('terpene') && (lowerQuery.includes('what') || lowerQuery.includes('explain'))) {
            return "Terpenes are aromatic compounds that give cannabis its distinctive smell and taste – think of them as the essential oils of the cannabis plant.\\n\\n• They create the unique scent profiles (citrusy, piney, earthy, etc.)\\n• They influence the effects you feel beyond just smell\\n• Research suggests they work with cannabinoids to shape your experience (the entourage effect)\\n\\nFor example, myrcene tends to be relaxing (like in mangoes!), while limonene is often uplifting (like in citrus peels). Would you like to know about specific terpenes or how they affect your cannabis experience?";
        }
        
        if (lowerQuery.includes('myrcene')) {
            return "Myrcene is the most common terpene found in cannabis and has a distinctly earthy, musky aroma with hints of cloves.\\n\\n• Often associated with relaxation and couch-lock effects\\n• Also found in mangoes, hops, and lemongrass\\n• Typically dominant in indica varieties\\n\\nIf you've ever felt that heavy body relaxation from certain strains, myrcene likely played a starring role! Fun fact: some people believe eating mangoes before cannabis enhances effects due to myrcene content, though scientific evidence is limited. Would you like to know about other common terpenes?";
        }
        
        if (lowerQuery.includes('limonene')) {
            return "Limonene brings bright citrus notes to cannabis and is the second most common terpene in many varieties.\\n\\n• Creates uplifting, mood-enhancing effects\\n• Found in citrus fruit peels, juniper, and peppermint\\n• May help reduce stress and anxiety\\n\\nIf a strain smells like fresh lemons or oranges, that's limonene at work! It's often found in sativa-dominant strains associated with daytime use. Would you like to learn about other terpenes or how they interact with cannabinoids?";
        }
        
        if (lowerQuery.includes('pinene')) {
            return "Pinene smells exactly like you'd expect – like pine needles and fresh forest air. It's actually the most common terpene in the natural world.\\n\\n• Associated with alertness, memory retention, and focus\\n• May counteract some of the memory impairment from THC\\n• Also found in pine needles, rosemary, and basil\\n\\nInterestingly, pinene is being studied for its bronchodilator effects, potentially helping to open airways. If you're looking for a clear-headed experience, strains with pinene might be worth exploring. Anything else about terpenes you'd like to know?";
        }
        
        if (lowerQuery.includes('entourage effect')) {
            return "The entourage effect is like a cannabis symphony – the idea that the whole plant works better than isolated compounds alone.\\n\\n• Cannabinoids and terpenes work synergistically to enhance benefits\\n• May increase therapeutic potential beyond what isolated compounds offer\\n• Explains why full-spectrum products often feel different than isolates\\n\\nThis is why two strains with identical THC percentages can feel completely different. The unique combination of compounds creates distinct experiences. Would you like to know more about full-spectrum products versus isolates?";
        }
        
        // Chemovars & genetics
        if ((lowerQuery.includes('indica') || lowerQuery.includes('sativa')) && 
            (lowerQuery.includes('difference') || lowerQuery.includes('vs'))) {
            return "The indica/sativa classification is actually one of the biggest myths in cannabis! While these terms are still widely used, they're oversimplified.\\n\\n• Originally, these terms described plant appearance and growth patterns, not effects\\n• Modern science focuses on chemotypes (chemical profiles) rather than plant shape\\n• A more accurate approach uses Type I (THC-dominant), Type II (balanced), and Type III (CBD-dominant) classifications\\n\\nThe effects you feel depend on the specific terpene and cannabinoid profile, not whether something is labeled indica or sativa. Would you like to know more about what actually determines cannabis effects?";
        }
        
        if (lowerQuery.includes('strain') && lowerQuery.includes('cultivar') && lowerQuery.includes('difference')) {
            return "'Strain' vs 'cultivar' is a fascinating distinction in cannabis terminology!\\n\\n'Cultivar' is technically more accurate – it means 'cultivated variety' and is the proper horticultural term for plants bred for specific traits. 'Strain' originated from bacteria/virus terminology and isn't botanically correct, though it's deeply embedded in cannabis culture.\\n\\nThink of it this way: Blue Dream is a cannabis cultivar that has been selectively bred for its specific traits and characteristics. The cannabis industry is gradually shifting toward this more scientifically accurate language. Does that distinction make sense?";
        }
        
        if (lowerQuery.includes('breed') && lowerQuery.includes('stabil')) {
            return "Cannabis breeding is an art and science that takes serious dedication! Breeders stabilize traits through a process called selective breeding:\\n\\n• They cross plants with desirable characteristics over multiple generations\\n• Select offspring that consistently show the desired traits (potency, flavor, yield, etc.)\\n• Inbreed the most stable plants (called 'backcrossing' or 'BX')\\n• Test for consistent expression across different environments\\n\\nIt often takes 7+ generations to truly stabilize a new cultivar. This is why established genetics from reputable breeders command premium prices – they're the result of years of careful work! Anything specific about breeding techniques you'd like to explore?";
        }
        
        // Consumption methods
        if (lowerQuery.includes('consumption') || lowerQuery.includes('method') || lowerQuery.includes('how to use') || lowerQuery.includes('ways to consume')) {
            return "Cannabis can be enjoyed in several different ways, each with its own timeline and experience:\\n\\n• Inhalation (smoking/vaping): Effects in 2-10 minutes, lasting 1-3 hours\\n• Edibles: Effects in 30-90 minutes, lasting 4-8 hours\\n• Tinctures (under tongue): Effects in 15-45 minutes, lasting 2-4 hours\\n• Topicals: Localized effects without intoxication\\n\\nYour ideal method depends on how quickly you want effects, how long you want them to last, and your comfort level. What factors are most important for your consumption choice?";
        }
        
        if (lowerQuery.includes('edible') && (lowerQuery.includes('dosing') || lowerQuery.includes('dose'))) {
            return "The golden rule with edibles is \\"start low, go slow.\\" Here's a quick guide:\\n\\n• First-timers: 2-5mg THC\\n• Occasional users: 5-15mg THC\\n• Regular users: 15-30mg THC\\n• Experienced users: 30-50mg+ THC\\n\\nRemember, edibles take 30-90 minutes to feel and last 4-8 hours. Unlike smoking, they're processed by your liver, creating a stronger, longer-lasting effect. Wait at least 2 hours before taking more – many uncomfortable experiences happen when people get impatient and take a second dose too soon.\\n\\nWould you like advice on edible types or how to handle if you take too much?";
        }
        
        if (lowerQuery.includes('vape') || lowerQuery.includes('vaping') || lowerQuery.includes('vaporizer')) {
            return "Vaporizing heats cannabis without combustion, creating vapor instead of smoke – a middle ground between smoking and edibles.\\n\\n• Faster onset than edibles (within minutes)\\n• Generally gentler on the lungs than smoking\\n• More efficient cannabinoid extraction than combustion\\n• Better flavor preservation of terpenes\\n\\nYou'll find options ranging from disposable pens to refillable cartridges to dry herb vaporizers for flower. For beginners, I often suggest starting with a simple rechargeable battery and a mid-potency cartridge. Would you like to know more about specific vape options?";
        }
        
        if (lowerQuery.includes('concentrate') || lowerQuery.includes('dab')) {
            return "Cannabis concentrates are exactly what they sound like – concentrated forms of cannabis with significantly higher potency!\\n\\n• Types range from solventless (like rosin and hash) to solvent-based (like shatter and budder)\\n• Potency typically ranges from 60-90% THC (compared to flower's 15-30%)\\n• Usually consumed by dabbing, vaporizing, or adding to flower\\n\\nConcentrates are generally recommended for experienced users due to their high potency. If you're curious about trying them, solventless options like rosin are often suggested for beginners since they're full-spectrum and use mechanical extraction rather than chemicals. Would you like to know about specific concentrate types?";
        }
        
        // Dosing & tolerance
        if (lowerQuery.includes('microdose') || lowerQuery.includes('micro-dose') || lowerQuery.includes('micro dose')) {
            return "Microdosing is the practice of taking very small amounts of cannabis – just enough to get subtle benefits without feeling obviously high.\\n\\n• Typical microdoses: 1-2.5mg THC for edibles or just a small puff from flower\\n• Benefits may include mood enhancement, creativity, or subtle symptom relief\\n• Many people report improved focus and functionality versus traditional dosing\\n\\nIt's all about finding that sweet spot where you feel better but not noticeably intoxicated. Many professionals use this approach for daytime relief while staying productive. Would you like some tips on how to start microdosing?";
        }
        
        if (lowerQuery.includes('tolerance') && lowerQuery.includes('break')) {
            return "A tolerance break (or t-break) is a period of abstaining from cannabis to reset your body's cannabinoid receptors.\\n\\n• Even 48 hours can begin restoring sensitivity\\n• 1-2 weeks is typically more effective for regular users\\n• Stay hydrated and exercise to help release stored cannabinoids\\n\\nDuring your break, you might experience mild effects like changes in sleep or appetite that typically resolve within a few days. Many users report enhanced effects, reduced consumption needs, and greater clarity after returning to cannabis. Have you considered trying a tolerance break?";
        }
        
        if (lowerQuery.includes('tolerance') && !lowerQuery.includes('break')) {
            return "Cannabis tolerance develops when your body gets used to regular consumption, requiring more to achieve the same effects.\\n\\n• Happens through downregulation of cannabinoid receptors\\n• Develops at different rates for different people\\n• More common with high-THC products used frequently\\n\\nTo manage tolerance, consider: rotation between different chemovars (strains), taking occasional breaks, using lower THC products, or trying products with different cannabinoid ratios. Would you like to know more about tolerance breaks specifically?";
        }
        
        // Physiology & safety
        if (lowerQuery.includes('endocannabinoid') || lowerQuery.includes('ecs')) {
            return "Think of your endocannabinoid system (ECS) as your body's Wi-Fi network – it's a cell-signaling system that helps maintain balance throughout your body.\\n\\n• Discovered in the 1990s while researching how THC affects the body\\n• Present in most major systems: nervous, immune, digestive, etc.\\n• Consists of receptors (CB1 and CB2), endocannabinoids, and enzymes\\n\\nCannabis compounds like THC and CBD work by interacting with this system. THC binds directly to CB1 receptors (mainly in your brain), while CBD works more indirectly. This explains why cannabis affects so many different bodily functions! Would you like me to elaborate on specific parts of the ECS?";
        }
        
        if (lowerQuery.includes('side effect')) {
            return "Cannabis can cause side effects that vary widely between individuals:\\n\\n• Common short-term effects: dry mouth, red eyes, increased heart rate, coordination issues, short-term memory changes\\n• Possible psychological effects: anxiety or paranoia (especially with high-THC products)\\n• Long-term considerations: potential respiratory issues (if smoking), tolerance development\\n\\nMany side effects can be minimized by starting with low doses, choosing appropriate products (like balanced THC:CBD ratios), and consuming in comfortable environments. What specific concerns do you have about cannabis effects?";
        }
        
        if (lowerQuery.includes('interact') && (lowerQuery.includes('medication') || lowerQuery.includes('drug'))) {
            return "Cannabis can interact with other medications, which is an important safety consideration.\\n\\n• It may amplify effects of alcohol and some sedatives\\n• May affect blood levels of drugs metabolized by the same liver enzymes (CYP450)\\n• Could impact blood pressure medications\\n• May increase risk of bleeding with blood thinners\\n\\nI'm not a doctor, and this isn't medical advice. If you take prescription medications, it's crucial to consult with a healthcare provider before using cannabis. They can provide personalized guidance about potential interactions with your specific medications.";
        }
        
        // Medical use cases
        if (lowerQuery.includes('medical') || lowerQuery.includes('medicine') || lowerQuery.includes('medicinal')) {
            return "Cannabis is used medicinally for numerous conditions, though research quality varies by condition:\\n\\n• Stronger evidence exists for: chronic pain, chemotherapy-induced nausea, multiple sclerosis spasticity\\n• Moderate evidence for: sleep disorders, anxiety (particularly CBD)\\n• Emerging research for: PTSD, inflammatory conditions, epilepsy\\n\\nEffective medical use often depends on finding the right cannabinoid profile, dose, and consumption method for your specific condition. I'm not a doctor, and this isn't medical advice. A healthcare provider knowledgeable about cannabis can provide personalized guidance based on your specific health needs. Would you like information about specific medical applications?";
        }
        
        if (lowerQuery.includes('pain') && (lowerQuery.includes('relief') || lowerQuery.includes('manage'))) {
            return "Cannabis for pain management works through multiple mechanisms:\\n\\n• THC activates CB1 receptors that can modulate pain signals\\n• CBD may reduce inflammation and impact pain perception\\n• Terpenes like myrcene and caryophyllene have their own pain-relieving properties\\n\\nFor pain relief, many people find products with balanced THC:CBD ratios or certain terpene profiles particularly effective. The specific type of pain matters too - inflammatory pain might respond differently than neuropathic pain.\\n\\nI'm not a doctor, and individual responses vary significantly. What type of pain are you interested in learning about?";
        }
        
        // Legal & responsible use
        if (lowerQuery.includes('legal') || lowerQuery.includes('laws')) {
            return "Cannabis legality varies dramatically by location and continues to evolve rapidly.\\n\\n• US federal law still classifies cannabis as a Schedule I controlled substance\\n• However, many states have legalized medical and/or recreational use\\n• Other countries range from fully legal to decriminalized to strictly prohibited\\n\\nEven in legal areas, there are typically restrictions on:\\n• Purchase limits and possession amounts\\n• Public consumption\\n• Driving under the influence\\n• Crossing state/country borders with cannabis\\n\\nAlways verify the current laws in your specific location, especially when traveling. Would you like to know about other aspects of cannabis regulations?";
        }
        
        if (lowerQuery.includes('store') || lowerQuery.includes('storage')) {
            return "Proper cannabis storage preserves potency and prevents degradation:\\n\\n• Keep in airtight containers away from light (UV rays degrade cannabinoids)\\n• Store in a cool, dark place (60-70°F/15-21°C is ideal)\\n• Maintain moderate humidity (58-62% for flower)\\n• Keep away from heat sources and electronics\\n\\nGlass mason jars with humidity packs are popular for flower, while concentrates do well in silicone or glass containers. Refrigeration works well for some concentrates, but can degrade flower if not properly sealed against humidity changes. And always keep cannabis products stored securely away from children and pets!";
        }
        
        // Product care
        if (lowerQuery.includes('humidity') || lowerQuery.includes('boveda') || lowerQuery.includes('integra')) {
            return "Humidity control is crucial for cannabis flower quality!\\n\\n• Ideal humidity range is 58-62% for most cannabis flower\\n• Too dry: terpenes evaporate, leading to harsh smoke and diminished effects\\n• Too humid: risk of mold and mildew growth\\n\\nProducts like Boveda or Integra humidity packs maintain the perfect moisture level. They contain special salts that either release or absorb moisture to maintain consistent relative humidity. Just pop one in your storage container, and it'll keep your flower in prime condition for months. They're especially helpful if you live in very dry or humid climates!";
        }
        
        if (lowerQuery.includes('shelf life') || lowerQuery.includes('old') || lowerQuery.includes('expire')) {
            return "Cannabis doesn't technically \\"expire\\" but it does degrade over time:\\n\\n• Properly stored flower generally stays good for 6-12 months\\n• THC gradually converts to CBN (more sedative)\\n• Terpenes evaporate, reducing aroma and changing effects\\n• Concentrates typically last 1-2 years when stored properly\\n• Edibles follow their stated expiration dates\\n\\nVisual cues of aging include color changes, brittle texture, and diminished aroma. While old cannabis is rarely harmful, the experience changes as compounds degrade. Good storage practices dramatically extend the optimal window of use. Would you like tips on how to determine if your cannabis is still good?";
        }
        
        // Culture & etiquette
        if (lowerQuery.includes('420') || lowerQuery.includes('four twenty')) {
            return "The origin of \\"420\\" has a fun history! It started in the early 1970s with a group of high school students in California called the \\"Waldos.\\"\\n\\n• They would meet at 4:20pm to search for an abandoned cannabis crop\\n• \\"420\\" became their code word for cannabis activities\\n• The term spread through Grateful Dead subculture\\n• Now April 20th (4/20) is celebrated globally as a cannabis holiday\\n\\nToday, you'll see \\"420\\" referenced in everything from dating profiles to business names to legislative bills. It's evolved from a secret code to a mainstream cultural touchstone. Any other cannabis culture questions I can help with?";
        }
        
        if (lowerQuery.includes('etiquette') || lowerQuery.includes('rules') || lowerQuery.includes('puff puff pass')) {
            return "Cannabis social etiquette varies by circle, but some common courtesies include:\\n\\n• \\"Puff, puff, pass\\" – take two hits then pass to the left\\n• Corner the bowl when lighting (don't burn the entire top)\\n• Contribute to the session if you're partaking regularly\\n• Ask before mixing cannabis with tobacco\\n• Respect others' tolerance levels and boundaries\\n\\nMost importantly, cannabis circles should be judgment-free zones where everyone feels comfortable going at their own pace. Like any shared experience, good communication goes a long way! Any specific etiquette questions you're curious about?";
        }
        
        // Special topics from the coverage map
        if (lowerQuery.includes('entourage') || (lowerQuery.includes('full') && lowerQuery.includes('spectrum'))) {
            return "The entourage effect is a fascinating concept in cannabis science! It suggests the whole plant works better than isolated compounds alone.\\n\\n• Cannabis contains hundreds of compounds that work synergistically\\n• The combined effect is potentially greater than the sum of individual parts\\n• Explains why synthetic or isolated THC medications (like Marinol) often feel different from whole-plant cannabis\\n\\nThis is why many people prefer full-spectrum products over isolates – you're getting the complete ensemble of cannabinoids, terpenes, and other beneficial compounds working together. Would you like to know more about specific compound interactions?";
        }
        
        if (lowerQuery.includes('terpene') && lowerQuery.includes('food')) {
            return "Pairing cannabis with food based on terpenes is like wine pairing but for cannabis enthusiasts!\\n\\n• Myrcene-rich strains (earthy, musky) pair well with mangoes, thyme, and lemongrass\\n• Limonene-dominant varieties (citrusy) complement citrus desserts and Mediterranean dishes\\n• Pinene-forward strains (pine, rosemary) enhance rosemary roasted potatoes or pine nut dishes\\n• Linalool-heavy options (floral, lavender) pair beautifully with floral teas and lavender-infused foods\\n\\nThe idea is to either complement or contrast the terpene profile with your meal. It's a fun way to elevate both the cannabis and culinary experience! Would you like some specific pairing suggestions?";
        }
        
        // Recommendation requests - flag for product recommendations
        if (lowerQuery.includes('recommend') || lowerQuery.includes('suggestion') || 
           (lowerQuery.includes('what') && lowerQuery.includes('strain')) ||
           (lowerQuery.includes('which') && lowerQuery.includes('product'))) {
            return "I'd be happy to recommend some products tailored to your needs! To provide the best suggestions, could you tell me what effects you're looking for (relaxation, energy, pain relief, sleep aid, etc.), your experience level with cannabis, and your preferred consumption method? Once I understand your preferences better, I can suggest some great options that would be a good match.";
        }
        
        // Default response with Bud Buddy personality
        return "Great question about cannabis! Cannabis contains over 100 cannabinoids (like THC and CBD) and numerous terpenes that work together to create different effects.\\n\\nThe specific experience you'll have depends on the chemical profile of the product, your individual endocannabinoid system, consumption method, dosage, and environment.\\n\\nI'd be happy to dive deeper into any specific aspect of cannabis that interests you - just let me know what you'd like to learn more about!";
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
                                    className={\`flex \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex-shrink-0 mr-2 flex items-center justify-center">
                                            <Leaf className="h-4 w-4 text-primary-700" />
                                        </div>
                                    )}
                                    <div 
                                        className={\`max-w-[80%] p-3 rounded-xl \${
                                            message.role === 'user' 
                                                ? 'bg-primary-100 text-primary-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }\`}
                                    >
                                        {message.content.split('\\n\\n').map((paragraph, i) => (
                                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            {isChatLoading && (
                                <div className="flex justify-start">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex-shrink-0 mr-2 flex items-center justify-center">
                                        <Leaf className="h-4 w-4 text-primary-700" />
                                    </div>
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
                            className={\`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden \${
                                mode === 'vibe' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }\`}
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
                            className={\`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden \${
                                mode === 'activity' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }\`}
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
                            className={\`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 relative overflow-hidden \${
                                mode === 'cannabis' 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                            }\`}
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
                            <Leaf className="w-3 h-3 mr-1 text-primary-500" />
                            <span>Ask anything about cannabis - from basic to advanced topics</span>
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
        'Endocannabinoid system': <Leaf className="w-4 h-4" />,
        'Terpene effects': <Leaf className="w-4 h-4" />,
        'Consumption methods': <Info className="w-4 h-4" />,
        'First-time tips': <Info className="w-4 h-4" />,
    };
    
    // Choose the appropriate map based on mode
    const activeMap = mode === 'vibe' ? vibeIconMap : 
                     mode === 'activity' ? activityIconMap : 
                     cannabisIconMap;
    
    return activeMap[suggestion] || <Book className="w-4 h-4" />;
}`}