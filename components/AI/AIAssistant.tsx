
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'assistant', text: "👋 Hi! I'm Sophea, your AI study companion. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getGeminiResponse(input);
    const assistantMessage: Message = { text: response, sender: 'assistant' };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {isOpen && (
        <div className="w-80 h-[28rem] bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <header className="bg-navy-blue text-white p-4 flex justify-between items-center">
            <h3 className="font-bold"><i className="fas fa-robot mr-2"></i> Sophea AI</h3>
            <button onClick={() => setIsOpen(false)} className="text-xl">&times;</button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-dark-bg">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-navy-blue text-white rounded-br-none' : 'bg-gray-200 dark:bg-dark-input text-gray-800 dark:text-white rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-gray-200 dark:bg-dark-input text-gray-800 dark:text-white rounded-bl-none">
                        <span className="animate-pulse">...</span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              aria-label="Ask Sophea AI anything"
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-dark-input focus:outline-none focus:ring-2 focus:ring-navy-blue"
              disabled={isLoading}
            />
            <button onClick={handleSend} className="bg-navy-blue text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110" disabled={isLoading}>
                <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-16 h-16 bg-navy-blue text-white rounded-full flex items-center justify-center text-2xl shadow-lg transform hover:scale-110 transition-transform"
      >
        <i className="fas fa-robot"></i>
      </button>
       <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
