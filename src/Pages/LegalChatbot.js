import React, { useState, useRef, useEffect } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader, MessageCircle, Sparkles } from "lucide-react";

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
  "What documents do I need for a boundary dispute case?",
  "How long does property title verification take in India?",
  "What are the steps to resolve land encroachment?",
  "How much does it cost to file a property dispute case?",
  "What is the difference between civil and criminal land disputes?",
  "How can I check if a property has clear title?",
  "What are my rights as a property owner in India?",
  "How to handle illegal encroachment on my land?"
];

export default function LegalChatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "🙏 Namaste! I'm your AI legal assistant specializing in land disputes and property law in India.\n\nI can help you understand:\n• Legal procedures for land disputes\n• Required documents and paperwork\n• Court processes and timelines\n• Your rights as a property owner\n• Cost estimates for legal proceedings\n\nHow may I assist you today?",
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
        return <h3 key={index} className="text-xl font-bold text-slate-800 mt-4 mb-2 break-words">{line.substring(2)}</h3>;
      } else if (line.startsWith('## ')) {
        return <h4 key={index} className="text-lg font-semibold text-slate-700 mt-3 mb-2 break-words">{line.substring(3)}</h4>;
      } else if (line.startsWith('### ')) {
        return <h5 key={index} className="text-base font-semibold text-slate-600 mt-2 mb-1 break-words">{line.substring(4)}</h5>;
      } else if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2 ml-2">
            <span className="font-semibold text-blue-600 flex-shrink-0 min-w-6">{line.split('.')[0]}.</span>
            <span className="break-words flex-1">{line.substring(line.indexOf('.') + 1).trim()}</span>
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1 ml-2">
            <span className="text-blue-600 font-bold flex-shrink-0">•</span>
            <span className="break-words flex-1">{line.substring(2)}</span>
          </div>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-slate-800 my-2 break-words">{line.slice(2, -2)}</p>;
      } else if (line.includes('₹')) {
        return <p key={index} className="my-2 font-medium text-green-700 break-words">{line}</p>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="my-2 text-gray-700 leading-relaxed break-words">{line}</p>;
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
        prompt: `${SYSTEM_PROMPT}\n\nUser question: ${message}\n\nProvide a detailed, well-formatted response about land dispute law in India with specific references to Indian legal system:`,
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
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment, or feel free to connect with one of our verified advocates for immediate assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSampleQuestion = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            AI Legal Assistant for Land Disputes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant, detailed guidance on property law, legal procedures, and documentation in India
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sample Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white sticky top-4">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {SAMPLE_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleQuestion(question)}
                    className="w-full text-left justify-start text-xs h-auto py-3 px-3 hover:bg-blue-50 hover:border-blue-300 transition-all break-words"
                  >
                    <span className="text-blue-600 mr-2 flex-shrink-0">→</span>
                    <span className="break-words">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-lg md:text-xl flex-wrap">
                  <Bot className="w-6 h-6 flex-shrink-0" />
                  <span className="break-words">Legal Assistant Chat</span>
                  <span className="ml-auto text-sm font-normal bg-white/20 px-3 py-1 rounded-full">AI-Powered</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages Area */}
                <div className="h-[500px] md:h-[600px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 md:p-5 shadow-md ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-white text-gray-800 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          {message.type === 'bot' && (
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                            </div>
                          )}
                          {message.type === 'user' && (
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 overflow-hidden">
                            {message.type === 'bot' ? (
                              <div className="prose prose-sm max-w-none">
                                {formatBotResponse(message.content)}
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {message.content}
                              </p>
                            )}
                            <p className="text-xs mt-2 opacity-60">
                              {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 rounded-2xl p-4 md:p-5 shadow-md border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Loader className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-sm font-medium">Analyzing your question...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex gap-2 md:gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask about land disputes, property rights, legal procedures..."
                      disabled={isLoading}
                      className="flex-1 h-12 md:h-14 text-sm md:text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !inputMessage.trim()}
                      className="h-12 md:h-14 px-6 md:px-8 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 rounded-xl shadow-lg flex-shrink-0"
                    >
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="text-xs text-gray-600 flex items-center gap-2 break-words">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                      <span>AI-powered legal guidance. For specific cases, please consult our verified advocates.</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">AI-Powered Guidance</h3>
              <p className="text-sm text-gray-600">
                Get instant answers with up-to-date legal information from across India
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">24/7 Available</h3>
              <p className="text-sm text-gray-600">
                Chat anytime, day or night, for immediate legal guidance
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Expert Knowledge</h3>
              <p className="text-sm text-gray-600">
                Trained on Indian property law, procedures, and documentation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}