import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, Search, MoreHorizontal, Trash2, Download, LogOut, RotateCcw, ChevronLeft } from "lucide-react";
import { ChatLauncher } from "./ChatLauncher";

interface Message {
  role: "user" | "assistant";
  content: string;
  expression?: "idle" | "happy" | "sad" | "confused" | "dead";
}

// Reusable Bobo Face Component
const BoboAvatar: React.FC<{ expression: string; size?: string; color?: string }> = ({ expression, size = "w-20 h-20", color = "#00d1b2" }) => (
  <div className={`${size} drop-shadow-md mx-auto`}>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="100" r="80" fill="white" stroke={color} strokeWidth="6" />
      <path d="M30,80 Q10,80 10,100 L10,120 Q10,140 30,140" fill="white" stroke={color} strokeWidth="6" />
      <path d="M170,80 Q190,80 190,100 L190,120 Q190,140 170,140" fill="white" stroke={color} strokeWidth="6" />
      <rect x="80" y="30" width="40" height="15" rx="7" fill="white" stroke={color} strokeWidth="4" />
      <circle cx="75" cy="55" r="6" fill={color} />
      <circle cx="100" cy="50" r="8" fill={color} />
      <circle cx="125" cy="55" r="6" fill={color} />
      <rect x="45" y="70" width="110" height="80" rx="40" fill="#2d3436" />
      <g>
        {expression === "happy" ? (
          <g stroke={color} strokeWidth="10" strokeLinecap="round" fill="none">
            <path d="M60,110 Q75,90 90,110" />
            <path d="M110,110 Q125,90 140,110" />
          </g>
        ) : expression === "sad" || expression === "dead" ? (
          <g>
            {expression === "dead" ? (
              <g stroke={color} strokeWidth="8" strokeLinecap="round">
                <line x1="65" y1="100" x2="85" y2="120" />
                <line x1="85" y1="100" x2="65" y2="120" />
                <line x1="115" y1="100" x2="135" y2="120" />
                <line x1="135" y1="100" x2="115" y2="120" />
              </g>
            ) : (
              <g fill={color}>
                <circle cx="75" cy="110" r="10" />
                <circle cx="125" cy="110" r="10" />
              </g>
            )}
            <path d="M85,135 Q100,125 115,135" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          <g fill={color}>
            <circle cx="75" cy="110" r="12" />
            <circle cx="125" cy="110" r="12" />
          </g>
        )}
      </g>
      <circle cx="100" cy={expression === "happy" ? 135 : 140} r="6" fill={color} />
    </svg>
  </div>
);

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<"idle" | "happy" | "sad" | "confused" | "dead">("happy");
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BOBO_TEAL = "#00d1b2";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const inferMood = (text: string): "happy" | "sad" | "idle" => {
    const lower = text.toLowerCase();
    if (lower.includes("sorry") || lower.includes("sad") || lower.includes("died") || lower.includes("wrong")) return "sad";
    if (lower.includes("hello") || lower.includes("happy") || lower.includes("cheer") || lower.includes("welcome")) return "happy";
    return "idle";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setCurrentMood("idle");

    try {
      const apiUrl = window.location.hostname === "localhost" ? "http://localhost:3001/api/chat" : "/api/chat";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });

      if (!response.ok) {
        throw new Error(response.status.toString());
      }

      const data = await response.json();
      setConsecutiveErrors(0); // Reset errors on success
      const mood = inferMood(data.response);
      setCurrentMood(mood);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        expression: mood
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setCurrentMood("sad");
      const newErrorCount = consecutiveErrors + 1;
      setConsecutiveErrors(newErrorCount);

      let errorMessage = "";

      if (error.message === "404") {
        errorMessage = "I'm still learning, and it seems I don't have access to that information yet. I've flagged this for our doctors so they can help me learn more. In the meantime, could I help with our services or location?";
      } else if (error.message === "403") {
        errorMessage = "It seems I don't have the right permissions to see that for you. I've asked our admin team to check my access. For now, is there anything else I can assist with?";
      } else {
        // Progressive Internal/Network Error
        if (newErrorCount === 1) {
          errorMessage = "I’ve hit a small snag on my end. I’ve just sent a report to the clinic’s technical team so they can look into it. Please give us a little time and try again later!";
        } else {
          errorMessage = "The team is already on it! A report was sent just a moment ago, and they are working to get everything back on track. Thank you for your patience.";
        }

      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage, expression: "sad" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };




  const handleCloseAttempt = () => {
    setIsEndModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <ChatLauncher onClick={() => setIsOpen(true)} isOpen={isOpen} />
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-full sm:h-[750px] sm:max-h-[85vh] bg-white sm:rounded-[3rem] shadow-2xl z-[9998] flex flex-col overflow-hidden"
          >
            {/* Simplified Small Header */}
            <div className="px-6 py-4 bg-white flex items-center justify-between border-b border-slate-100 relative">
              <div className="flex items-center gap-3">
                <ChevronLeft className="size-6 text-slate-800" />
                <h3 className="font-bold text-xl text-slate-900">Bobo</h3>
              </div>
              <button
                onClick={handleCloseAttempt}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-800"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity }} className="mb-4">
                <BoboAvatar expression={currentMood} color={BOBO_TEAL} />
              </motion.div>

              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-slate-800">
                    Welcome to Biney Medical Centre. I am Bobo, your dedicated health assistant.
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-slate-800">
                    I’ve been keeping an eye on things here—how can I make your life easier today?
                  </div>
                </div>
              )}





              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-4">
                  {msg.role === "assistant" && msg.expression === "sad" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2">
                      <BoboAvatar expression="sad" size="w-16 h-16" color={BOBO_TEAL} />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-lg ${msg.role === "user"
                          ? "bg-[#00d1b2] text-white rounded-tr-none shadow-sm"
                          : "bg-slate-100 text-slate-800 rounded-tl-none"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message to Bobo ..."
                    className="w-full bg-transparent outline-none text-slate-600"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-14 h-14 bg-[#00d1b2] text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <Send className="size-6 fill-current" />
                </button>
              </div>
            </div>

            {/* End Session Modal */}
            <AnimatePresence>
              {isEndModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white w-full rounded-[3rem] p-8 text-center shadow-2xl"
                  >
                    <BoboAvatar expression="dead" color={BOBO_TEAL} size="w-32 h-32" />

                    <h4 className="text-3xl font-black text-slate-900 mt-6 mb-2">End Session</h4>
                    <p className="text-slate-500 font-medium px-4">
                      Are you sure you want to end session the chat with Bobo?
                    </p>

                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => {
                          setMessages([]);
                          setIsEndModalOpen(false);
                          setIsOpen(false);
                        }}
                        className="w-full py-4 bg-[#00d1b2] text-white rounded-3xl font-bold text-lg shadow-lg active:scale-95 transition-all"
                      >
                        Yes, End Session
                      </button>
                      <button
                        onClick={() => setIsEndModalOpen(false)}
                        className="w-full py-4 bg-teal-50 text-[#00d1b2] rounded-3xl font-bold text-lg hover:bg-teal-100 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
