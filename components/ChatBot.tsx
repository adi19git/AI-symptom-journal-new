"use client";

import { getSymptomChatbotReply } from "@/lib/aichat";
import { saveSymptom, saveAIMessage, getAIMessages } from "@/lib/storage";
import type { AIMessage, Symptom } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export default function AIChat({ symptoms }: { symptoms: Symptom[] }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getAIMessages());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const autoDetectAndSaveSymptom = (userInput: string) => {
    const symptomKeywords = ["headache", "fever", "nausea", "cough", "pain", "dizziness", "fatigue", "sore throat", "cold", "stomach ache"];

    const matchedSymptom = symptomKeywords.find(keyword =>
      userInput.toLowerCase().includes(keyword)
    );

    if (matchedSymptom) {
      const newSymptom: Symptom = {
        id: uuidv4(),
        name: matchedSymptom,
        intensity: 5,
        duration: "unknown",
        triggers: [],
        notes: userInput,
        timestamp: Date.now(),
      };

      saveSymptom(newSymptom);
      console.log("✅ Auto-logged symptom:", newSymptom);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: AIMessage = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveAIMessage(userMessage);

    autoDetectAndSaveSymptom(input);

    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await getSymptomChatbotReply(input) || "I'm sorry, I couldn't understand your symptoms. Please try again.";

      const aiMessage: AIMessage = {
        id: uuidv4(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      saveAIMessage(aiMessage);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage: AIMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, I had trouble analyzing your symptoms. Please try again later.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      saveAIMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    if (confirm("Are you sure you want to reset the conversation?")) {
      localStorage.removeItem("ai-messages");
      setMessages([]);
    }
  };

  return (
    <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm flex flex-col h-[600px]">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg pb-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          <CardTitle>AI Health Assistant</CardTitle>
        </div>
        <CardDescription className="text-purple-100">
          Ask questions about your symptoms and get personalized insights
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto p-4">
        <div className="space-y-4">
          {Array.isArray(messages) && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <div className="h-12 w-12 mb-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                A
              </div>
              <p className="mb-2">No conversation history yet.</p>
              <p className="text-sm max-w-xs">
                Ask me questions about your symptoms, potential triggers, or patterns I've noticed in your data.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const role = message?.role || "user"; 
              const fallbackLetter = role === "user" ? "U" : "A";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    role === "user" ? "bg-muted/50" : "bg-purple-50",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted-foreground text-background font-bold">
                      {fallbackLetter ? fallbackLetter.toString() : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{role === "user" ? "You" : "AI Assistant"}</div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Ask about your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ""}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isLoading ? <span className="animate-pulse">...</span> : <Send className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={handleResetConversation}
            disabled={isLoading}
            className="text-red-500 border-red-300 hover:bg-red-50"
          >
            Reset
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
