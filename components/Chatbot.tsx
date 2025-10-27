import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon, SpinnerIcon, LocationMarkerIcon, MapIcon } from './icons';
import type { Chat } from '@google/genai';
import { User, Message } from '../types';

type Geolocation = {
  latitude: number;
  longitude: number;
};

type LocationStatus = 'idle' | 'pending' | 'success' | 'error';

export const Chatbot: React.FC<ChatbotProps> = ({ user, proactiveMessageTrigger, onProactiveMessageSent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  useEffect(() => {
    chatSessionRef.current = createChatSession();
    const initialGreeting = user 
      ? `Hi ${user.email}! I'm your AI assistant. How can I help you grow your business today?`
      : "Hi! I'm an AI assistant. How can I help you with your e-commerce business today?";
    setMessages([{ role: 'model', text: initialGreeting }]);
  }, [user]);
  
  useEffect(() => {
    if (proactiveMessageTrigger) {
      const proactiveMessage: Message = { role: 'model', text: proactiveMessageTrigger };
      setMessages(prev => [...prev, proactiveMessage]);
      setIsOpen(true);
      onProactiveMessageSent();
    }
  }, [proactiveMessageTrigger, onProactiveMessageSent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('pending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
      }
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatSessionRef.current) return;

    let messageToSend = userInput;
    if (location) {
      messageToSend += ` (For context, my current location is latitude: ${location.latitude}, longitude: ${location.longitude})`;
    }

    const userMessage: Message = { role: 'user', text: userInput }; // Show original text in UI
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // FIX: Corrected the argument for sendMessage to be a string, not an object. The SDK expects the content directly.
      const response = await chatSessionRef.current.sendMessage(messageToSend);
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk) || [];

      const modelMessage: Message = { 
        role: 'model', 
        text: response.text,
        groundingChunks: groundingChunks.filter(c => c.maps) // Only keep map chunks
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationButtonClass = () => {
    switch(locationStatus) {
      case 'success': return 'text-green-500 hover:bg-green-500/10';
      case 'pending': return 'text-yellow-500 animate-pulse';
      case 'error': return 'text-red-500 hover:bg-red-500/10';
      default: return 'text-plasma-text-subtle hover:bg-plasma-border';
    }
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70%] max-h-[500px] bg-plasma-surface rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out border border-plasma-border ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 bg-plasma-accent text-white rounded-t-xl">
          <h3 className="font-bold text-lg">AI Business Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
            <div className="w-6 h-6"><CloseIcon /></div>
          </button>
        </header>
        
        <div className="flex-grow p-4 overflow-y-auto bg-plasma-bg">
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-plasma-accent text-white rounded-br-none' : 'bg-plasma-surface text-plasma-text rounded-bl-none'}`}>
                  {msg.text}
                </div>
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-2 p-2 bg-plasma-surface rounded-lg border border-plasma-border max-w-[80%]">
                    <p className="text-xs font-bold text-plasma-text-subtle mb-1">Sources:</p>
                    <div className="flex flex-col gap-1">
                      {msg.groundingChunks.map((chunk, i) => (
                        <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" key={i} className="flex items-center gap-2 text-xs text-plasma-accent hover:underline">
                          <div className="w-4 h-4 flex-shrink-0"><MapIcon /></div>
                          <span>{chunk.maps.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-plasma-surface text-plasma-text rounded-bl-none">
                    <div className="w-6 h-6 text-plasma-accent"><SpinnerIcon /></div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-plasma-border bg-plasma-surface rounded-b-xl">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-4 pr-12 py-2 bg-plasma-bg border border-plasma-border rounded-full focus:ring-2 focus:ring-plasma-accent focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleLocationRequest}
              className={`p-2 rounded-full transition-colors ${getLocationButtonClass()}`}
              aria-label="Share location"
            >
              <div className="w-5 h-5"><LocationMarkerIcon /></div>
            </button>
            <button
              type="submit"
              className="p-2 bg-plasma-accent text-white rounded-full hover:bg-plasma-accent-hover disabled:opacity-50"
              disabled={!userInput.trim() || isLoading}
            >
              <div className="w-5 h-5"><SendIcon /></div>
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-8 w-16 h-16 bg-plasma-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-plasma-accent-hover transition-transform hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <div className="w-8 h-8"><ChatIcon /></div>
      </button>
    </>
  );
};

interface ChatbotProps {
  user: User | null;
  proactiveMessageTrigger: string | null;
  onProactiveMessageSent: () => void;
}