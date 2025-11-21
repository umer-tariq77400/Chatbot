import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'model',
      text: "Hi! I'm Alex's AI assistant. Ask me anything about his projects, skills, or blog posts.",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const streamResult = await sendMessageToGemini(userMessage.text);
      
      const modelMessageId = (Date.now() + 1).toString();
      // Initialize empty model message
      setMessages((prev) => [
        ...prev,
        {
          id: modelMessageId,
          role: 'model',
          text: '', // Start empty
          timestamp: Date.now(),
        },
      ]);

      let accumulatedText = '';

      for await (const chunk of streamResult) {
        const chunkText = chunk.text || '';
        accumulatedText += chunkText;
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === modelMessageId 
              ? { ...msg, text: accumulatedText }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "I'm having trouble connecting right now. Please try again later.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-10 fade-in">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                <p className="text-xs text-indigo-100">Powered by Gemini</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 border border-indigo-200">
                    <Bot size={16} />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-normal prose-a:text-indigo-600">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
               <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 border border-indigo-200">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                    <div className="flex space-x-1 h-5 items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about projects, skills..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-90' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatWidget;