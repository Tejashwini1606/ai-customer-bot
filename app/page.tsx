"use client";

import { useState } from "react";
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

  const handleEscalate = () => {
    const subject = encodeURIComponent("Complaint/Support Request - SmartStore");
    const body = encodeURIComponent("Hello, I need help with my order. My issue is: ");
    window.location.href = `mailto:support@smartstore.com?subject=${subject}&body=${body}`;
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
        body: JSON.stringify({ messages: newMessages.slice(-5) }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We use h-screen and overflow-hidden here to lock the page in place
    <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 p-2 md:p-4 overflow-hidden">
      
      {/* max-h-[90dvh] ensures the card never gets taller than the screen */}
      <Card className="w-full max-w-2xl h-full max-h-[95dvh] md:max-h-[800px] flex flex-col shadow-2xl border-none overflow-hidden">        
        
        <CardHeader className="border-b bg-white p-4 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold tracking-tight">Customer Care AI</CardTitle>
              <p className="text-[10px] md:text-xs text-green-500 font-medium">● Online | 24/7 Support</p>
            </div>
          </div>
          <Button 
            onClick={handleEscalate}
            variant="outline" 
            size="sm" 
            className="h-8 gap-1 text-xs text-red-500 border-red-200 hover:bg-red-50"
          >
            <LifeBuoy className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Talk to Human</span>
            <span className="xs:hidden">Help</span>
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 p-4 md:p-6 flex flex-col bg-white overflow-hidden">
          
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4 shrink-0">
              {["Shipping info", "Return policy", "Order status"].map((text) => (
                <button
                  key={text}
                  onClick={() => handleSend(text)}
                  className="text-[10px] md:text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* This ScrollArea is now strictly constrained */}
          <ScrollArea className="flex-1 w-full rounded-md border-none pr-2">
            <div className="flex flex-col gap-4 pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-2xl animate-pulse text-slate-400 text-xs">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input Area - Forced to stay at bottom with shrink-0 */}
          <div className="flex gap-2 mt-4 pt-4 border-t shrink-0">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-11 md:h-12 bg-slate-50 border-slate-200 text-sm md:text-base focus-visible:ring-blue-600"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading}
              className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-blue-600 hover:bg-blue-700 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}