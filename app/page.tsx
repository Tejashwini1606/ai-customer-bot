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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
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
        { role: "assistant", content: "Sorry, I'm having trouble connecting." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // h-[100dvh] is "Dynamic Viewport Height" - it auto-adjusts when mobile bars appear/disappear
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-slate-50 p-2 md:p-4 overflow-hidden">
      
      <Card className="w-full max-w-2xl h-full md:h-[750px] flex flex-col shadow-2xl border-none overflow-hidden">        
        
        {/* Header: Made padding smaller on mobile (p-4 vs md:p-6) */}
        <CardHeader className="border-b bg-white p-4 md:p-6 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold">Customer Care AI</CardTitle>
              <p className="text-[10px] md:text-xs text-green-500 font-medium">● Online | 24/7 Support</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs md:text-sm text-red-500 border-red-200">
            <LifeBuoy className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Talk to Human</span>
            <span className="xs:hidden">Help</span>
          </Button>
        </CardHeader>

        {/* Content: p-4 for mobile to give more chat space */}
        <CardContent className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col bg-white">
          <ScrollArea className="flex-1 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
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
              <div className="flex justify-start mb-4">
                <div className="bg-slate-100 p-3 rounded-2xl animate-pulse text-slate-400 text-xs">
                  AI is thinking...
                </div>
              </div>
            )}
          </ScrollArea>
          
          {/* Input Area: Fixed at bottom with mt-auto */}
          <div className="flex gap-2 mt-2 pt-3 border-t shrink-0">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-11 md:h-12 bg-slate-50 border-slate-200 text-sm md:text-base"
            />
            <Button onClick={handleSend} className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-blue-600 shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}