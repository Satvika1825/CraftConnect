// Backend: routes/chat.js or similar
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hugging Face API configuration
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'; // or your chosen model

// Customer chat endpoint
router.post('/chat/customer', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Customer chat request:', { message, userId });

    // Create context-aware prompt for customer
    const systemPrompt = `You are a helpful shopping assistant for CraftConnect, a marketplace for authentic Indian handicrafts. 
Help customers find products, suggest gift ideas, explain craft traditions, and provide shopping advice. 
Be friendly, knowledgeable about Indian crafts, and helpful.`;

    const fullPrompt = `${systemPrompt}\n\nCustomer: ${message}\n\nAssistant:`;

    // Call Hugging Face API
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL}`,
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    console.log('Hugging Face response:', response.data);

    let aiMessage = '';
    
    // Parse response based on model output format
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      aiMessage = response.data[0].generated_text.trim();
    } else if (response.data?.generated_text) {
      aiMessage = response.data.generated_text.trim();
    } else if (typeof response.data === 'string') {
      aiMessage = response.data.trim();
    } else {
      aiMessage = 'I apologize, but I received an unexpected response. Could you rephrase your question?';
    }

    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Customer chat error:', error.response?.data || error.message);
    
    if (error.response?.status === 503) {
      res.status(503).json({ 
        error: 'AI model is loading. Please try again in a moment.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get AI response. Please try again.' 
      });
    }
  }
});

// Artisan chat endpoint
router.post('/chat/artisan', async (req, res) => {
  try {
    const { message, artisanId, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Artisan chat request:', { message, artisanId, userId });

    // Create context-aware prompt for artisan
    const systemPrompt = `You are a business mentor for Indian artisans on CraftConnect marketplace. 
Help with pricing strategies, product photography, marketing, material sourcing, and growing their craft business. 
Be supportive, practical, and knowledgeable about running a handmade business.`;

    const fullPrompt = `${systemPrompt}\n\nArtisan: ${message}\n\nMentor:`;

    // Call Hugging Face API
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL}`,
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    console.log('Hugging Face response:', response.data);

    let aiMessage = '';
    
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      aiMessage = response.data[0].generated_text.trim();
    } else if (response.data?.generated_text) {
      aiMessage = response.data.generated_text.trim();
    } else if (typeof response.data === 'string') {
      aiMessage = response.data.trim();
    } else {
      aiMessage = 'I apologize, but I received an unexpected response. Could you rephrase your question?';
    }

    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Artisan chat error:', error.response?.data || error.message);
    
    if (error.response?.status === 503) {
      res.status(503).json({ 
        error: 'AI model is loading. Please try again in a moment.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to get AI response. Please try again.' 
      });
    }
  }
});

module.exports = router;