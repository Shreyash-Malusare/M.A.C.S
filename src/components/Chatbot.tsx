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
      product:"You can see multiple products with multiple categories in our webapp.",
      default: "I'm here to help with fashion-related questions! Ask me about orders, sizing, or our products.",
      "promo code": "You can apply promo codes at checkout. If having trouble, ensure it's entered correctly and hasn't expired.",
      "gift card": "Gift cards can be redeemed at checkout. Check your balance in 'My Account' > 'Gift Cards'.",
      "price match": "We offer price matching within 7 days of purchase. Contact support with the competitor's offer details.",
      "wishlist": "You can save items to your wishlist by clicking the heart icon. Access it from your account profile.",
      "loyalty program": "Our loyalty program offers points on every purchase. Redeem them for discounts - details in 'My Account'.",
      "international shipping": "We ship to 50+ countries! Shipping costs and times vary - check during checkout.",
      "customize product": "Some items offer customization options. Look for 'Customize' button on product pages.",
      "newsletter": "Sign up for our newsletter in the website footer for exclusive offers and style tips!",
      "social media": "Connect with us on Instagram @MACS_Fashion for style inspiration and new arrivals!",
      "sustainability": "We're committed to sustainable fashion. Look for the leaf icon on eco-friendly products.",
      "clearance": "Find discounted items in our 'Last Chance' section. All sales final on clearance items.",
      "pre-order": "Pre-ordered items ship on release date. You'll receive email confirmation when shipped.",
      "out of stock": "Sign up for restock notifications on product pages. We restock popular items frequently!",
      "payment security": "We use SSL encryption for all transactions. Your payment details are never stored.",
      "password reset": "Reset your password via 'Forgot Password' on login page. Check your email for instructions.",
      "account deletion": "Request account deletion in 'Profile Settings'. All data will be permanently removed.",
      "product suggestions": "Get personalized recommendations based on your browsing history in 'For You' section.",
      "measurements": "Detailed garment measurements available in 'Product Details'. Compare with your favorite items!",
      "gift wrap": "Select gift wrapping at checkout. Includes premium packaging and handwritten note option.",
      "bulk order": "For orders over 50 items, contact our wholesale team through the Contact page.",
      "blog": "Check our style blog for fashion tips and trend guides. Link in website footer!",
      "affiliate program": "Join our affiliate program through 'Partner With Us' page. Earn commission on referrals.",
      "careers": "View current job openings in the 'Careers' section. We're always looking for talented individuals!",
      "product authenticity": "All items are 100% authentic with quality guarantees. Report concerns via Contact page.",
      "holiday hours": "Special holiday hours will be announced on our homepage and social media channels.",
      "price adjustment": "Request price adjustments within 14 days of purchase if item goes on sale. Contact support.",
      "style advice": "Our virtual stylist can suggest outfits - try it in the 'Style Studio' section!",
      "student discount": "Get 15% off with valid student ID. Verify through UNiDAYS in 'My Account'.",
      "military discount": "Active military personnel receive 20% off. Verify status through ID.me at checkout.",
      "return label": "Print return label from 'My Orders' section. Free returns within India!",
      "damaged item": "Immediately contact support with photos of damaged items. We'll send replacement ASAP.",
      "wrong item": "Keep the incorrect item and contact support. We'll ship correct item immediately!",
      "order history": "View all past purchases in 'My Orders'. Download invoices for accounting purposes.",
      "product comparison": "Use our comparison tool (up to 3 items) in the 'Discover' section.",
      "size recommendation": "Our AI Size Assistant analyzes your measurements - find it on product pages!",
      "payment plans": "Split payments into 3 installments with our partner services at checkout.",
      "curated box": "Try our Style Box subscription - get curated looks monthly. Cancel anytime!",
      "event outfits": "Check our 'Occasion Wear' collection for weddings, parties, and special events!",
      "petite/tall": "Filter by 'Petite' or 'Tall' sizes in category filters. New sizes added weekly!",
      "vacation hold": "Pause deliveries temporarily through 'Shipping Preferences' in your profile.",
      "influencer collab": "Email collab@macs.com with your media kit and style ideas!",
      "product request": "Suggest new products through our wishlist feature. We monitor popular requests!",
      "vip program": "Our VIP members get early access to sales and exclusive collections. Upgrade in 'My Account'."
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
          className={`fixed bottom-4 right-4 md:bottom-4 md:right-4 p-3 md:p-4 rounded-full shadow-lg transition-colors z-50 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-black text-white hover:bg-gray-800'
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
          className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100%-2rem)] md:w-[400px] rounded-lg shadow-xl z-50 flex flex-col max-h-[600px] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
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
