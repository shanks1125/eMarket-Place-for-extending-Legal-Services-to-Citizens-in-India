import React, { useState, useRef, useEffect } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User, Loader, Sparkles } from "lucide-react";

const SYSTEM_PROMPT = `You are an expert AI legal assistant specializing in land dispute and property law in India. 

Provide detailed, well-formatted guidance on:
1. Land dispute processes and procedures
2. Required documents for land-related legal matters
3. Steps to resolve property conflicts
4. Legal advice for boundary disputes, title issues, and property rights
5. Court procedures and timelines in India

FORMAT YOUR RESPONSES AS FOLLOWS:
- Use clear headings and subheadings
- Break down complex information into numbered steps or bullet points
- Include specific Indian legal references (Acts, Sections) when relevant
- Mention approximate costs in Indian Rupees (₹)
- Provide realistic timelines for Indian legal processes
- Use simple, clear language that non-lawyers can understand
- Always end with a reminder to consult qualified advocates for case-specific advice

Be conversational, empathetic, and supportive while maintaining professional accuracy.`;

const SAMPLE_QUESTIONS = [
  "What documents do I need for a boundary dispute?",
  "How long does title verification take?",
  "Steps to resolve land encroachment?",
  "Cost of filing a property dispute case?"
];

export default function AILegalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "🙏 Namaste! I'm your AI legal assistant for land disputes.\n\nI can help you with:\n• Legal procedures\n• Required documents\n• Court processes\n• Cost estimates\n\nHow may I assist you?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatBotResponse = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h4 key={index} className="text-base font-bold text-slate-800 mt-3 mb-1 break-words">{line.substring(2)}</h4>;
      } else if (line.startsWith('## ')) {
        return <h5 key={index} className="text-sm font-semibold text-slate-700 mt-2 mb-1 break-words">{line.substring(3)}</h5>;
      } else if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1 ml-1 text-sm">
            <span className="font-semibold text-blue-600 flex-shrink-0 min-w-5">{line.split('.')[0]}.</span>
            <span className="text-gray-700 break-words flex-1">{line.substring(line.indexOf('.') + 1).trim()}</span>
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1 ml-1 text-sm">
            <span className="text-blue-600 flex-shrink-0">•</span>
            <span className="text-gray-700 break-words flex-1">{line.substring(2)}</span>
          </div>
        );
      } else if (line.includes('₹')) {
        return <p key={index} className="my-1 text-sm font-medium text-green-700 break-words">{line}</p>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="my-1 text-sm text-gray-700 leading-relaxed break-words">{line}</p>;
      }
    });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nUser question: ${message}\n\nProvide a detailed, well-formatted response:`,
        add_context_from_internet: true
      });

      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        type: 'bot',
        content: "I apologize for the trouble. Please try again or connect with our verified advocates.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSampleQuestion = (question) => {
    handleSendMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 shadow-2xl flex items-center justify-center group"
        >
          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]">
      <Card className="shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span className="break-words">Legal Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    {message.type === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {message.type === 'bot' ? (
                        <div>{formatBotResponse(message.content)}</div>
                      ) : (
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-blue-50">
              <p className="text-xs font-semibold text-gray-700 mb-2">Quick Questions:</p>
              <div className="space-y-2">
                {SAMPLE_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleQuestion(question)}
                    className="w-full text-left justify-start text-xs h-auto py-2 px-3 bg-white hover:bg-blue-100 border-blue-200 break-words"
                  >
                    <span className="text-blue-600 mr-2 flex-shrink-0">→</span>
                    <span className="break-words">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about land disputes..."
                disabled={isLoading}
                className="flex-1 border-2 focus:border-blue-500"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 px-4 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2 flex items-center gap-1 break-words">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              <span>For specific cases, consult our verified advocates</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}