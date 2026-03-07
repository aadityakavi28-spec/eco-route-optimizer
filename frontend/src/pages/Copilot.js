/**
 * AI Copilot Page
 * Natural language assistant for logistics operations
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, ArrowRight, X, Loader } from 'lucide-react';
import { useCopilotStore } from '../store';

function CopilotPage() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const { 
    messages, 
    suggestions, 
    loading, 
    sendMessage, 
    clearChat 
  } = useCopilotStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userInput = input;
    setInput('');
    await sendMessage(userInput);
  };

  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion);
    await sendMessage(suggestion);
  };

  const defaultSuggestions = [
    "How can I reduce my route costs?",
    "What is the demand forecast for Delhi-Mumbai?",
    "Show me backhaul opportunities",
    "Calculate carbon emissions for my route"
  ];

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-black">AI Logistics Copilot</h1>
                <p className="text-purple-200">Ask me anything about your logistics operations</p>
              </div>
            </div>
            <button 
              onClick={clearChat}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-purple-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Hello! I'm your AI Logistics Assistant
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                I can help you with route optimization, pricing, emissions, demand forecasting, and more.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {defaultSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-left hover:border-purple-500 hover:shadow-md transition"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                
                <div className={`max-w-[70%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="prose dark:prose-invert max-w-none">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  
                  {/* Suggestions from assistant */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about routes, pricing, emissions..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 hidden lg:block">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          <button className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Optimize Route</p>
              <p className="text-xs text-gray-500">Find best path</p>
            </div>
          </button>
          
          <button className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600">₹</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Get Pricing</p>
              <p className="text-xs text-gray-500">Calculate freight cost</p>
            </div>
          </button>
          
          <button className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <span className="text-orange-600">CO₂</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Carbon Impact</p>
              <p className="text-xs text-gray-500">Track emissions</p>
            </div>
          </button>
          
          <button className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Demand Forecast</p>
              <p className="text-xs text-gray-500">Predict demand</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CopilotPage;

