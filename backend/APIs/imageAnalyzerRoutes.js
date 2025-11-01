// APIs/imageAnalyzerRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeCraftImage } = require('../services/imageAnalyzerService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Analyze image endpoint
router.post('/analyze-craft-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }
    
    console.log('Analyzing image:', req.file.originalname, 'Size:', req.file.size);
    
    const imageBuffer = req.file.buffer;
    const filename = req.file.originalname;
    
    const analysis = await analyzeCraftImage(imageBuffer, filename);
    
    console.log('Analysis result:', analysis);
    
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/analyze-health', (req, res) => {
  res.json({
    success: true,
    message: 'Image analyzer service is running',
    methods: ['gemini-api', 'huggingface-api', 'rule-based']
  });
});

module.exports = router;