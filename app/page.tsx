"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, LifeBuoy } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI Support Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling to the bottom
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleEscalate = () => {
    window.location.href = `mailto:support@smartstore.com?subject=Support Request`;
  };

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim()) return;

    const userMsg = { role: "user", content: messageToSend };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FULL SCREEN WRAPPER - Prevents the whole page from scrolling
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 p-0 md:p-4 overflow-hidden">
      
      {/* THE CHAT CARD - Set to fill height/width correctly */}
      <Card className="w-full max-w-2xl h-full md:h-[90vh] flex flex-col shadow-2xl border-none md:rounded-2xl overflow-hidden bg-white">        
        
        {/* HEADER - Fixed at top */}
        <CardHeader className="flex-none border-b p-4 flex flex-row items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Customer Care AI</CardTitle>
              <p className="text-[10px] text-green-500 font-medium">● Online</p>
            </div>
          </div>
          <Button onClick={handleEscalate} variant="outline" size="sm" className="text-red-500 text-xs h-8">
            <LifeBuoy className="w-4 h-4 mr-1" /> Help
          </Button>
        </CardHeader>

        {/* MESSAGES AREA - This is the only part that scrolls */}
        <CardContent className="flex-1 min-h-0 p-0 relative flex flex-col">
          
          {/* Custom Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin"
          >
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {["Shipping info", "Return policy", "Order status"].map((text) => (
                  <button
                    key={text}
                    onClick={() => handleSend(text)}
                    className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                  msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl animate-pulse text-slate-400 text-xs italic">
                  AI is typing...
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* INPUT AREA - Fixed at the very bottom */}
        <div className="flex-none p-4 border-t bg-white">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-11 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-600"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading}
              className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
}