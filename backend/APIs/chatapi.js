// ============================================
// routes/chatRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const { getChatResponse, getFallbackResponse } = require('../services/aiChatService');

// Chat endpoint for artisans
router.post('/chat/artisan', async (req, res) => {
  try {
    const { message, artisanId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await getChatResponse(message, 'artisan', artisanId);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    const fallback = getFallbackResponse(req.body.message, 'artisan');
    res.json(fallback);
  }
});

// Chat endpoint for customers
router.post('/chat/customer', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await getChatResponse(message, 'customer', userId);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    const fallback = getFallbackResponse(req.body.message, 'customer');
    res.json(fallback);
  }
});

module.exports = router;