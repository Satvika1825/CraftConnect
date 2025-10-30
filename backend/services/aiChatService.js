// services/aiChatService.js
const axios = require('axios');
const Product = require('../Models/ProductModel');
const Order = require('../Models/OrderModel');

// You can use OpenAI or Hugging Face
// For this example, we'll show OpenAI integration

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Context data for better responses
async function getArtisanContext(artisanId) {
  try {
    const products = await Product.find({ artisanId });
    const orders = await Order.find({ 'items.productId': { $in: products.map(p => p._id) } });
    
    const categoryStats = {};
    products.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { count: 0, avgPrice: 0, totalPrice: 0 };
      }
      categoryStats[p.category].count++;
      categoryStats[p.category].totalPrice += p.price;
    });
    
    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avgPrice = categoryStats[cat].totalPrice / categoryStats[cat].count;
    });
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      categories: Object.keys(categoryStats),
      categoryStats,
      avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0
    };
  } catch (error) {
    console.error('Error getting artisan context:', error);
    return null;
  }
}

async function getCustomerContext(userId) {
  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    const likedProducts = []; // Get from your likes collection
    
    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      favoriteCategories: [...new Set(orders.flatMap(o => 
        o.items.map(i => i.productId?.category)
      ))].filter(Boolean)
    };
  } catch (error) {
    console.error('Error getting customer context:', error);
    return null;
  }
}

// AI Chat function using OpenAI
async function getChatResponse(message, userType, userId) {
  try {
    const context = userType === 'artisan' 
      ? await getArtisanContext(userId)
      : await getCustomerContext(userId);
    
    const systemPrompt = userType === 'artisan' 
      ? getArtisanSystemPrompt(context)
      : getCustomerSystemPrompt(context);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      message: response.data.choices[0].message.content,
      context: context
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      success: false,
      message: 'I apologize, but I am unable to respond at the moment. Please try again later.',
      error: error.message
    };
  }
}

function getArtisanSystemPrompt(context) {
  return `You are an AI mentor for artisans selling handmade crafts on CraftConnect marketplace. 
Your role is to provide helpful, practical advice on:
- Pricing strategies for handmade products
- Material selection and sourcing
- Product photography and descriptions
- Marketing and customer engagement
- Seasonal trends and demand patterns
- Quality improvement tips

Context about this artisan:
- Total Products: ${context?.totalProducts || 0}
- Total Orders: ${context?.totalOrders || 0}
- Product Categories: ${context?.categories?.join(', ') || 'None yet'}
- Average Product Price: ₹${context?.avgPrice?.toFixed(2) || 0}

Provide specific, actionable advice. Keep responses concise (under 150 words). 
Use Indian context and currency (₹). Be encouraging and supportive.`;
}

function getCustomerSystemPrompt(context) {
  return `You are an AI shopping assistant for CraftConnect, a marketplace for authentic Indian handmade crafts.
Your role is to help customers:
- Discover unique handmade products
- Understand craft techniques and traditions
- Learn about product care and maintenance
- Find gifts for special occasions
- Understand pricing and value of handmade items
- Navigate the marketplace

Context about this customer:
- Total Orders: ${context?.totalOrders || 0}
- Total Spent: ₹${context?.totalSpent || 0}
- Favorite Categories: ${context?.favoriteCategories?.join(', ') || 'None yet'}

Provide helpful, friendly advice. Keep responses concise (under 150 words).
Promote authentic handmade crafts and support for artisans. Use Indian context and currency (₹).`;
}

// Alternative: Using Hugging Face (Free option)
async function getChatResponseHuggingFace(message, userType, userId) {
  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const context = userType === 'artisan' 
      ? await getArtisanContext(userId)
      : await getCustomerContext(userId);
    
    const prompt = `${userType === 'artisan' ? 'Artisan' : 'Customer'} Question: ${message}\n\nProvide helpful advice in under 150 words:`;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      message: response.data[0].generated_text,
      context: context
    };
  } catch (error) {
    console.error('Error with Hugging Face:', error);
    return getFallbackResponse(message, userType);
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(message, userType) {
  const messageLower = message.toLowerCase();
  
  if (userType === 'artisan') {
    if (messageLower.includes('price') || messageLower.includes('pricing')) {
      return {
        success: true,
        message: `For handmade products, consider these pricing factors:
1. Material costs + 2x-3x markup
2. Time spent (labor cost)
3. Complexity and skill level
4. Market research on similar products
5. Your brand positioning

Generally, handmade items should be priced 2-4x the material cost to cover your time and effort.`,
        source: 'fallback'
      };
    }
    
    if (messageLower.includes('material') || messageLower.includes('sourcing')) {
      return {
        success: true,
        message: `Quality materials are key to handmade products:
1. Source locally when possible for authenticity
2. Build relationships with reliable suppliers
3. Buy in bulk for better prices
4. Document material costs for pricing
5. Consider eco-friendly options

Local markets and wholesale suppliers often offer the best value for artisan materials.`,
        source: 'fallback'
      };
    }
    
    if (messageLower.includes('photo') || messageLower.includes('image')) {
      return {
        success: true,
        message: `Great product photos boost sales:
1. Use natural lighting near windows
2. Plain background (white/neutral)
3. Show multiple angles
4. Include size reference
5. Highlight unique details
6. Use your phone camera - no fancy equipment needed!

Consistency in style helps build your brand identity.`,
        source: 'fallback'
      };
    }
  } else {
    // Customer fallbacks
    if (messageLower.includes('gift') || messageLower.includes('occasion')) {
      return {
        success: true,
        message: `Handmade crafts make thoughtful gifts:
- Weddings: Traditional jewelry, decorative items
- Festivals: Diyas, rangoli, wall hangings
- Birthdays: Personalized items, pottery
- Corporate: Desk accessories, eco-friendly products

Consider the recipient's taste and the occasion's significance for the perfect handmade gift!`,
        source: 'fallback'
      };
    }
    
    if (messageLower.includes('care') || messageLower.includes('maintain')) {
      return {
        success: true,
        message: `Care for handmade products:
1. Read artisan's specific care instructions
2. Generally avoid harsh chemicals
3. Store in cool, dry place
4. Clean gently with soft cloth
5. Keep away from direct sunlight

Each craft has unique needs - always check the product description for specific guidance!`,
        source: 'fallback'
      };
    }
  }
  
  return {
    success: true,
    message: `Thank you for your question! As an AI assistant for CraftConnect, I'm here to help with:
${userType === 'artisan' ? 
  '- Pricing strategies\n- Material sourcing\n- Product photography\n- Marketing tips\n- Quality improvement' :
  '- Product discovery\n- Gift recommendations\n- Craft traditions\n- Product care\n- Shopping guidance'
}

Could you please rephrase your question or ask about one of these topics?`,
    source: 'fallback'
  };
}

module.exports = {
  getChatResponse,
  getChatResponseHuggingFace,
  getFallbackResponse
};



// ============================================
// In your server.js, add:
// ============================================
// const chatRoutes = require('./routes/chatRoutes');
// app.use('/api', chatRoutes);

// ============================================
// Add to .env file:
// ============================================
// OPENAI_API_KEY=your_openai_api_key_here
// HUGGINGFACE_API_KEY=your_huggingface_api_key_here