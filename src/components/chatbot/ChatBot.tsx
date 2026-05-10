import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, Bot, Search, MoreHorizontal, Trash2, Download, LogOut, RotateCcw, ChevronLeft } from "lucide-react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("bobo_session_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("bobo_session_id", id);
    }
    return id;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<"idle" | "happy" | "sad" | "confused" | "dead">("happy");
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedHistoryRef = useRef(false);

  // Fetch History from Backend (Phase 7)
  useEffect(() => {
    if (!isOpen || hasFetchedHistoryRef.current) return;
    hasFetchedHistoryRef.current = true;

    const fetchHistory = async () => {
      try {
        const cached = sessionStorage.getItem(`bobo_chat_history_${sessionId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setMessages(parsed);
        }

        const apiUrl = window.location.hostname === "localhost" ? `http://localhost:3001/api/history/${sessionId}` : `/api/history/${sessionId}`;
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const nextMessages = data.map((m: any) => ({ role: m.role, content: m.content }));
            setMessages(nextMessages);
            sessionStorage.setItem(`bobo_chat_history_${sessionId}`, JSON.stringify(nextMessages));
          }
        }
      } catch (e) {
        console.error("Failed to fetch session history:", e);
      }
    };
    fetchHistory();
  }, [isOpen, sessionId]);

  const BOBO_TEAL = "#00d1b2";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const inferMood = (text: string): "happy" | "sad" | "idle" => {
    const lower = text.toLowerCase();
    if (lower.includes("died") || lower.includes("fatally") || lower.includes("emergency")) return "sad";
    if (lower.includes("hello") || lower.includes("happy") || lower.includes("welcome")) return "happy";
    return "idle";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => {
      const nextMessages = [...prev, userMessage];
      sessionStorage.setItem(`bobo_chat_history_${sessionId}`, JSON.stringify(nextMessages));
      return nextMessages;
    });
    setInput("");
    setIsLoading(true);
    setCurrentMood("idle");
    const startedAt = Date.now();

    try {
      const apiUrl = window.location.hostname === "localhost" ? "http://localhost:3001/api/chat" : "/api/chat";
      
      const apiHistory = messages
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: apiHistory, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.status.toString());
      }
  
      const data = await response.json();
      const minDelay = 850 + Math.min(input.trim().length * 18, 900);
      const elapsed = Date.now() - startedAt;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      setConsecutiveErrors(0);
      const mood = inferMood(data.response);
      setCurrentMood(mood);
  
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        expression: mood
      };
      setMessages((prev) => {
        const nextMessages = [...prev, assistantMessage];
        sessionStorage.setItem(`bobo_chat_history_${sessionId}`, JSON.stringify(nextMessages));
        return nextMessages;
      });
    } catch (error: any) {
      setCurrentMood("idle");
      const newErrorCount = consecutiveErrors + 1;
      setConsecutiveErrors(newErrorCount);
  
      let errorMessage = "";
  
      if (error.message.includes("404")) {
        errorMessage = "I couldn't find that specific information in my medical records yet. I've flagged this for our doctors. Can I help you with our services or location instead?";
      } else if (error.message.includes("403")) {
        errorMessage = "It seems I don't have permission to access that right now. I've notified the admin team. Is there something else I can help you with?";
      } else if (error.message.includes("credits") || error.message.includes("402")) {
        errorMessage = "I'm having a bit of a service interruption with my AI core. Our technical team has been notified. Please try again in a few minutes!";
      } else {
        errorMessage = error.message.length < 150 ? `Something went wrong: ${error.message}` : "I've hit a small snag. Our technical team is looking into it!";
      }
  
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage, expression: "idle" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };




  const handleCloseAttempt = () => {
    setIsEndModalOpen(true);
  };

  const handleMarkdownLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) return;
    if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) return;

    event.preventDefault();
    navigate(href);
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
                      {msg.role === "assistant" ? (
                        <ErrorBoundary fallback={<div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm italic">Message rendering error</div>}>
                          <div className="markdown-content">
                            <Markdown
                              components={{
                                a: ({ href, children }) => (
                                  <a href={href} onClick={(event) => handleMarkdownLinkClick(event, href)}>
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {msg.content || ""}
                            </Markdown>
                          </div>
                        </ErrorBoundary>
                      ) : (
                        msg.content
                      )}
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
                          localStorage.removeItem("bobo_chat_history");
                          sessionStorage.removeItem(`bobo_chat_history_${sessionId}`);
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
