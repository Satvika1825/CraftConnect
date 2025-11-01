
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Helper function to convert file to base64
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType
    },
  };
}

// Test endpoint to verify API connection
router.get('/test-ai-connection', async (req, res) => {
  try {
    console.log('Testing Google AI connection...');
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Google AI API key not configured in environment variables'
      });
    }

    // Test with a simple prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "API is working!"');
    const response = await result.response;
    const text = response.text();

    console.log('✅ API test successful');

    res.json({
      success: true,
      message: 'Google AI API is working correctly',
      testResponse: text,
      modelUsed: 'gemini-1.5-flash',
      apiKeyConfigured: true
    });
  } catch (error) {
    console.error('❌ AI API Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to Google AI API',
      error: error.message,
      details: error.toString()
    });
  }
});

// Main image analysis endpoint
router.post('/analyze-craft-image', upload.single('image'), async (req, res) => {
  let filePath = null;

  try {
    console.log('📸 Received image analysis request');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    filePath = req.file.path;
    console.log('📁 File saved at:', filePath);
    console.log('📊 File details:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    // Check API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured');
    }

    // Initialize model for vision
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert image to format Google AI can process
    const imagePart = fileToGenerativePart(filePath, req.file.mimetype);

    // Craft analysis prompt
    const prompt = `Analyze this handicraft/artisan product image and provide the following information in JSON format:

{
  "title": "A catchy, descriptive product name (max 60 characters)",
  "description": "A detailed, engaging product description highlighting craftsmanship, materials, and unique features (100-200 words)",
  "category": "Select ONE from: Pottery, Weaving, Embroidery, Woodwork, Jewelry, Painting, Basket Weaving, Wood Carving, Textile Craft, Metalwork",
  "material": "Primary material used (e.g., clay, wood, fabric, metal, etc.)",
  "method": "Crafting technique/method if identifiable (e.g., hand-woven, carved, molded)",
  "confidence": "high, medium, or low - your confidence in this analysis"
}

Important:
- Be specific and accurate about the craft type
- Use professional, marketing-friendly language
- Focus on what makes this handmade item special
- If you're unsure about any field, indicate lower confidence
- Return ONLY valid JSON, no additional text`;

    console.log('🤖 Sending to Google AI...');
    const startTime = Date.now();

    // Generate content with image and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const endTime = Date.now();
    console.log(`✅ Analysis completed in ${(endTime - startTime) / 1000}s`);
    console.log('📝 Raw AI Response:', text);

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from response (sometimes AI adds markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a structured response even if parsing fails
      analysis = {
        title: 'Handcrafted Artisan Product',
        description: text.substring(0, 500), // Use raw text
        category: 'Textile Craft',
        material: 'Mixed materials',
        method: 'Handmade',
        confidence: 'low'
      };
    }

    console.log('✨ Parsed Analysis:', analysis);

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Temporary file deleted');
    }

    res.json({
      success: true,
      analysis: analysis,
      processingTime: `${(endTime - startTime) / 1000}s`
    });

  } catch (error) {
    console.error('❌ Error analyzing image:', error);

    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze image',
      error: error.message,
      details: error.toString()
    });
  }
});

// Alternative: Analyze image from URL
router.post('/analyze-craft-url', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    console.log('🔗 Analyzing image from URL:', imageUrl);

    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this handicraft/artisan product image and provide the following information in JSON format:

{
  "title": "A catchy, descriptive product name (max 60 characters)",
  "description": "A detailed, engaging product description highlighting craftsmanship, materials, and unique features (100-200 words)",
  "category": "Select ONE from: Pottery, Weaving, Embroidery, Woodwork, Jewelry, Painting, Basket Weaving, Wood Carving, Textile Craft, Metalwork",
  "material": "Primary material used",
  "method": "Crafting technique/method if identifiable",
  "confidence": "high, medium, or low"
}

Return ONLY valid JSON.`;

    const imagePart = {
      inlineData: {
        data: imageUrl,
        mimeType: 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('❌ Error analyzing image from URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze image from URL',
      error: error.message
    });
  }
});

module.exports = router;