import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import the useTheme hook

interface Message {
  text: string;
  isBot: boolean;
}

export function Chatbot() {
  const { isDarkMode } = useTheme(); // Get the current theme
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your fashion assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple rule-based responses
    const responses: { [key: string]: string } = {
      hello: "Hello! How can I assist you with your fashion needs today?",
      hi: "Hi there! What can I help you with?",
      hey: "Hey there! What can I help you with?",
      return: "Our return policy allows returns within 30 days of purchase. Please visit our Contact page for more details.",
      order: "To check your order status, please visit the 'My Orders' section in your account.",
      size: "Our sizing chart is available on each product page. Need help with a specific item?",
      shipping: "Standard shipping takes 3-5 business days. Express shipping is available at checkout.",
      payment: "We accept all major credit cards and PayPal.",
      contact: "You can reach our support from Contact page.",
      help: "I can help with orders, returns, sizing, and general inquiries. What do you need help with?",
      track: "You can track your order using the tracking number sent to your email. Need help finding it?",
      exchange: "We offer free exchanges within 14 days. Visit our Contact page for details.",
      material: "Our products use high-quality, sustainable materials. Check individual product descriptions for specifics.",
      sale: "Our seasonal sales are announced through email newsletters. Sign up for exclusive offers!",
      refund: "Refunds are processed within 5-7 business days after we receive your returned item.",
      "delivery time": "Standard delivery takes 3-5 business days. Express delivery is available for an additional fee.",
      "product availability": "You can check product availability on the product page. If it's out of stock, you can sign up for restock notifications.",
      "change address": "You can update your shipping address before your order is shipped. Visit your profile to make changes.",
      "cancel order": "You can cancel your order before it is shipped. Visit Contact page to cancel order.",
      "care instructions": "Care instructions are provided on the product label and in the product description online.",
      "store location": "We have ou store in Mumbai. Visit our Contact page for more details.",
      products:"You can see multiple products with multiple categories.",
      default: "I'm here to help with fashion-related questions! Ask me about orders, sizing, or our products.",
    };

    // Find matching response
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) return response;
    }

    return responses['default'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput('');
    setIsBotTyping(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse = getBotResponse(input);
    setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    setIsBotTyping(false);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 left-4 md:bottom-4 md:left-4 p-3 md:p-4 rounded-full shadow-lg transition-colors z-50 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'
            }`}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatbotRef}
          className={`fixed bottom-4 left-4 md:bottom-8 md:left-8 w-[calc(100%-2rem)] md:w-[400px] rounded-lg shadow-xl z-50 flex flex-col max-h-[600px] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
        >
          {/* Header */}
          <div
            className={`p-4 rounded-t-lg flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-black text-white'
              }`}
          >
            <span className="font-semibold">MACS HELP BOT</span>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-800'
                }`}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${msg.isBot
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100'
                    : isDarkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-black text-white'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex justify-start">
                <div
                  className={`max-w-[80%] p-3 rounded-lg flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                >
                  <div
                    className={`typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                      }`}
                  ></div>
                  <div
                    className={`typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                      }`}
                  ></div>
                  <div
                    className={`typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                      }`}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about orders, sizing, or products..."
                className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-gray-500'
                  : 'border-gray-300 focus:ring-black'
                  }`}
                disabled={isBotTyping}
              />
              <button
                type="submit"
                className={`p-2 rounded-md transition-colors ${isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
                disabled={isBotTyping || !input.trim()}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Typing Animation Styles */}
      <style>
        {`
          .typing-dot {
            width: 8px;
            height: 8px;
            margin: 0 2px;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
          }

          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>
    </>
  );
}
