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

    // 1. Create the new user message
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages); // Show user message immediately
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call our Backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.slice(-5) }), // Send last 5 messages for context
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // 3. Show the AI's real response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please check your API key!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-2xl h-[700px] flex flex-col shadow-2xl border-none">
        <CardHeader className="border-b bg-white rounded-t-xl flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Customer Care AI</CardTitle>
              <p className="text-xs text-green-500 font-medium">● Online | 24/7 Support</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-red-500 border-red-200 hover:bg-red-50">
            <LifeBuoy className="w-4 h-4" />
            Talk to Human
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-6 flex flex-col bg-white">
          <ScrollArea className="flex-1 pr-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-6 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-slate-100 p-4 rounded-2xl animate-pulse text-slate-400 text-sm">
                  AI is thinking...
                </div>
              </div>
            )}
          </ScrollArea>
          
          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Input
              placeholder="Ask about orders, services, or complaints..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-12 bg-slate-50 border-slate-200"
            />
            <Button onClick={handleSend} className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}