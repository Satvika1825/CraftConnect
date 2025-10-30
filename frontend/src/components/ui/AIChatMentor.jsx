import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export default function AIChatMentor({ 
  userType = 'customer', 
  artisanId = null, 
  isEmbedded = false 
}) {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: userType === 'artisan' 
        ? 'Hello! I\'m your AI mentor. Ask me about pricing, materials, marketing, or any business questions!'
        : 'Hi! I\'m here to help you discover amazing handmade crafts. Ask me about products, gifts, or anything!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useBackend, setUseBackend] = useState(true); // Track if we should try backend
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fallback responses when API is not available
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (userType === 'artisan') {
      if (lowerMessage.includes('price') || lowerMessage.includes('pricing')) {
        return 'For pricing handmade items, consider: 1) Material costs 2) Time invested (usually ₹200-500/hour) 3) Overhead costs 4) Market research of similar items 5) Your skill level and uniqueness. A good formula is: (Materials + Labor + Overhead) × 2 for retail pricing.';
      }
      if (lowerMessage.includes('photo') || lowerMessage.includes('image')) {
        return 'Great product photos are crucial! Tips: 1) Use natural lighting 2) Clean, simple background 3) Show multiple angles 4) Include size reference 5) Capture fine details 6) Keep consistent style across products 7) Show the product in use if possible.';
      }
      if (lowerMessage.includes('market') || lowerMessage.includes('sell') || lowerMessage.includes('sales')) {
        return 'To market your crafts: 1) Share your creation process on social media 2) Tell the story behind your craft 3) Engage with customers personally 4) Use relevant hashtags 5) Collaborate with other artisans 6) Offer seasonal products 7) Maintain consistent quality and branding.';
      }
      if (lowerMessage.includes('material')) {
        return 'Choosing quality materials is important. Research local suppliers, buy in bulk for better prices, and always test materials before large projects. Consider sustainable and eco-friendly options as they\'re increasingly popular with customers.';
      }
      if (lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
        return 'For order management: 1) Respond promptly to customers 2) Package items securely 3) Use reliable shipping partners 4) Provide tracking information 5) Include care instructions 6) Follow up after delivery. Good communication builds trust!';
      }
      if (lowerMessage.includes('increase') || lowerMessage.includes('grow') || lowerMessage.includes('more')) {
        return 'To increase sales: 1) Add high-quality photos 2) Write detailed descriptions 3) Price competitively 4) Respond quickly to inquiries 5) Offer bundle deals 6) Update inventory regularly 7) Build a consistent brand. Customer reviews also boost visibility!';
      }
      return 'I\'m here to help with your craft business! You can ask me about pricing strategies, product photography, marketing tips, material sourcing, managing orders, or growing your sales. What specific area would you like guidance on?';
    } else {
      // Customer responses
      if (lowerMessage.includes('gift') || lowerMessage.includes('wedding')) {
        return 'For wedding gifts, consider handmade items like embroidered textiles, pottery sets, wooden decorative pieces, or traditional jewelry. These unique pieces carry cultural significance and personal touch. Browse our categories: Pottery, Weaving, Embroidery, Woodwork, and Jewelry for perfect wedding gift ideas!';
      }
      if (lowerMessage.includes('care') || lowerMessage.includes('maintain') || lowerMessage.includes('clean')) {
        return 'Caring for handmade items: 1) Pottery - Handle gently, hand wash recommended 2) Textiles - Dry clean or gentle hand wash 3) Wood - Keep away from moisture, occasional oiling 4) Jewelry - Store separately, clean with soft cloth 5) Always check product description for specific care instructions.';
      }
      if (lowerMessage.includes('special') || lowerMessage.includes('why handmade') || lowerMessage.includes('unique')) {
        return 'Handmade items are special because: 1) Each piece is unique 2) Made with care and skill by artisans 3) Supports traditional crafts and livelihoods 4) Sustainable and eco-friendly 5) Carries cultural heritage 6) Higher quality than mass-produced items. Every purchase supports an artisan\'s livelihood!';
      }
      if (lowerMessage.includes('traditional') || lowerMessage.includes('craft') || lowerMessage.includes('category')) {
        return 'India has rich craft traditions! Explore: Pottery (terracotta, ceramic), Weaving (handloom textiles), Embroidery (regional styles), Woodwork (carved furniture), Jewelry (traditional designs), and Painting (folk art). Each region has unique specialties. What interests you most?';
      }
      if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for')) {
        return 'I can help you find the perfect item! Browse by category: Pottery, Weaving, Embroidery, Woodwork, Jewelry, or Painting. Use filters for price range and artisan. Each product page shows detailed information and artisan stories. What type of craft interests you?';
      }
      if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('order')) {
        return 'Orders are shipped directly by artisans. Delivery times vary by location, typically 5-10 business days. You\'ll receive tracking information once shipped. Check product pages for specific shipping details. Your orders support artisans directly!';
      }
      return 'I can help you find the perfect handmade item! Ask me about gift ideas, product care, craft traditions, shipping, or browse by category. What are you looking for today?';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Try backend API only if it hasn't failed before
    if (useBackend) {
      try {
        const endpoint = userType === 'artisan' ? '/chat/artisan' : '/chat/customer';
        
        const response = await axios.post(
          `https://craftconnect-bbdp.onrender.com/api${endpoint}`, 
          {
            message: currentInput,
            artisanId: artisanId,
            userId: user?.id
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000, // 5 second timeout - fail fast
            validateStatus: (status) => status < 500 // Don't throw on 4xx errors
          }
        );

        if (response.data?.message || response.data?.response) {
          const assistantMessage = {
            role: 'assistant',
            content: response.data.message || response.data.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return; // Success, exit early
        }
      } catch (error) {
        // Silently disable backend for future requests
        console.log('Using local AI responses (backend unavailable)');
        setUseBackend(false);
      }
    }

    // Use fallback response
    const assistantMessage = {
      role: 'assistant',
      content: getFallbackResponse(currentInput),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const quickQuestions = userType === 'artisan' ? [
    'How to price a handmade saree?',
    'Best materials for pottery?',
    'Tips for product photography',
    'How to increase sales?'
  ] : [
    'Gift ideas for weddings',
    'How to care for handmade items?',
    'What makes handmade special?',
    'Traditional craft recommendations'
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  // If embedded, just return the chat interface without the floating button and card wrapper
  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-background border rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-3 border-t bg-background">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}