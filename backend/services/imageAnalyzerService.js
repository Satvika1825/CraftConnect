// services/imageAnalyzerService.js
const axios = require('axios');
const sharp = require('sharp');

// Option 1: Using Google Gemini API (100% FREE - No credit card needed!)
async function analyzeImageGemini(imageBuffer) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.log('No Gemini API key, trying next method...');
      return null;
    }
    
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: `You are an expert in Indian handmade crafts. Analyze this craft product image and provide:
1. Material used (e.g., clay, wood, bamboo, textile, metal, stone, glass, paper, jute, ceramic)
2. Craft type/category (e.g., pottery, weaving, embroidery, carving, painting, jewelry, basket weaving)
3. A catchy product title (under 60 characters)
4. A detailed product description (100-150 words)

Respond in JSON format only:
{
  "material": "detected material",
  "category": "craft type",
  "title": "product title",
  "description": "detailed description",
  "confidence": "high/medium/low"
}`
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }]
      },
      {
        timeout: 10000
      }
    );
    
    const text = response.data.candidates[0].content.parts[0].text;
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      result.method = 'gemini-api';
      return result;
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return null;
  }
}

// Option 2: Using Hugging Face Inference API (100% FREE)
async function analyzeImageHuggingFace(imageBuffer) {
  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (!HF_API_KEY) {
      console.log('No Hugging Face API key, trying next method...');
      return null;
    }
    
    // Step 1: Image Classification
    const classificationResponse = await axios.post(
      'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
      imageBuffer,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 10000
      }
    );
    
    const topPredictions = classificationResponse.data.slice(0, 3);
    
    // Step 2: Generate description using text model
    const craftInfo = detectCraftFromPredictions(topPredictions);
    const description = generateDescriptionSync(craftInfo.material, craftInfo.category);
    
    return {
      material: craftInfo.material,
      category: craftInfo.category,
      title: craftInfo.title,
      description: description,
      confidence: 'medium',
      method: 'huggingface-api',
      predictions: topPredictions
    };
  } catch (error) {
    console.error('Hugging Face error:', error.message);
    return null;
  }
}

// Option 3: Rule-Based Analysis (NO API KEY NEEDED - Always works!)
async function analyzeImageRuleBased(imageBuffer, filename = '') {
  try {
    // Process image to extract features
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const stats = await image.stats();
    
    // Analyze colors
    const dominantColors = analyzeDominantColors(stats);
    
    // Detect patterns and textures
    const patterns = await detectPatterns(image);
    
    // Guess material and category based on colors, patterns, filename
    const analysis = inferCraftType(dominantColors, patterns, filename, metadata);
    
    return {
      material: analysis.material,
      category: analysis.category,
      title: analysis.title,
      description: analysis.description,
      confidence: 'medium',
      method: 'rule-based',
      details: {
        dominantColors: dominantColors,
        patterns: patterns
      }
    };
  } catch (error) {
    console.error('Rule-based analysis error:', error);
    return getFallbackAnalysis(filename);
  }
}

// Helper: Detect craft from ML predictions
function detectCraftFromPredictions(predictions) {
  const labels = predictions.map(p => p.label.toLowerCase());
  
  // Material detection
  let material = 'mixed media';
  let category = 'handmade craft';
  
  if (labels.some(l => l.includes('pot') || l.includes('vase') || l.includes('jar'))) {
    material = 'clay';
    category = 'pottery';
  } else if (labels.some(l => l.includes('basket') || l.includes('woven'))) {
    material = 'bamboo';
    category = 'basket weaving';
  } else if (labels.some(l => l.includes('wood') || l.includes('carv'))) {
    material = 'wood';
    category = 'wood carving';
  } else if (labels.some(l => l.includes('textile') || l.includes('fabric') || l.includes('cloth'))) {
    material = 'textile';
    category = 'textile craft';
  } else if (labels.some(l => l.includes('metal') || l.includes('brass') || l.includes('copper'))) {
    material = 'metal';
    category = 'metalwork';
  } else if (labels.some(l => l.includes('jewelry') || l.includes('bead'))) {
    material = 'mixed';
    category = 'jewelry';
  } else if (labels.some(l => l.includes('paint') || l.includes('art'))) {
    material = 'canvas';
    category = 'painting';
  }
  
  const title = generateTitle(material, category);
  
  return { material, category, title };
}

// Helper: Generate title
function generateTitle(material, category) {
  const adjectives = ['Handcrafted', 'Artisan', 'Traditional', 'Authentic', 'Elegant', 'Exquisite', 'Beautiful', 'Unique', 'Classic', 'Vintage'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  const materialCap = material.charAt(0).toUpperCase() + material.slice(1);
  const categoryCap = category.charAt(0).toUpperCase() + category.slice(1);
  
  return `${adj} ${materialCap} ${categoryCap}`;
}

// Helper: Analyze colors
function analyzeDominantColors(stats) {
  const channels = stats.channels;
  const colors = {
    red: channels[0].mean,
    green: channels[1].mean,
    blue: channels[2].mean
  };
  
  // Determine dominant color family
  const max = Math.max(colors.red, colors.green, colors.blue);
  let dominantColor = 'brown';
  
  if (max === colors.red) {
    dominantColor = colors.red > 150 ? 'red' : 'brown';
  } else if (max === colors.green) {
    dominantColor = 'green';
  } else if (max === colors.blue) {
    dominantColor = 'blue';
  }
  
  // Check if colors are muted (earthy tones)
  const avg = (colors.red + colors.green + colors.blue) / 3;
  const isEarthy = avg > 80 && avg < 150;
  
  return {
    dominant: dominantColor,
    isEarthy: isEarthy,
    brightness: avg
  };
}

// Helper: Detect patterns
async function detectPatterns(image) {
  try {
    // Get image data
    const { data, info } = await image
      .resize(224, 224)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Simple edge detection to find patterns
    let edgeCount = 0;
    for (let i = 0; i < data.length - 3; i += 3) {
      const diff = Math.abs(data[i] - data[i + 3]);
      if (diff > 30) edgeCount++;
    }
    
    const hasPatterns = edgeCount > 5000;
    const isSmooth = edgeCount < 2000;
    
    return {
      hasPatterns,
      isSmooth,
      edgeCount
    };
  } catch (error) {
    return { hasPatterns: false, isSmooth: true, edgeCount: 0 };
  }
}

// Helper: Infer craft type from analysis
function inferCraftType(colors, patterns, filename, metadata) {
  let material = 'mixed media';
  let category = 'handmade craft';
  
  const filenameLower = filename.toLowerCase();
  
  // Check filename hints
  if (filenameLower.includes('pot') || filenameLower.includes('clay') || filenameLower.includes('ceramic')) {
    material = 'clay';
    category = 'pottery';
  } else if (filenameLower.includes('basket') || filenameLower.includes('bamboo') || filenameLower.includes('woven')) {
    material = 'bamboo';
    category = 'basket weaving';
  } else if (filenameLower.includes('wood') || filenameLower.includes('carv')) {
    material = 'wood';
    category = 'wood carving';
  } else if (filenameLower.includes('textile') || filenameLower.includes('fabric') || filenameLower.includes('saree')) {
    material = 'textile';
    category = 'textile craft';
  } else if (filenameLower.includes('metal') || filenameLower.includes('brass')) {
    material = 'metal';
    category = 'metalwork';
  } else if (filenameLower.includes('jewel') || filenameLower.includes('bead')) {
    material = 'mixed';
    category = 'jewelry';
  } else if (filenameLower.includes('paint') || filenameLower.includes('art')) {
    material = 'canvas';
    category = 'painting';
  } else {
    // Use color and pattern analysis
    if (colors.isEarthy && colors.dominant === 'brown') {
      if (patterns.isSmooth) {
        material = 'clay';
        category = 'pottery';
      } else {
        material = 'wood';
        category = 'wood carving';
      }
    } else if (patterns.hasPatterns) {
      if (colors.dominant === 'green' || colors.dominant === 'brown') {
        material = 'bamboo';
        category = 'basket weaving';
      } else {
        material = 'textile';
        category = 'textile craft';
      }
    } else if (colors.brightness > 150) {
      material = 'metal';
      category = 'metalwork';
    }
  }
  
  const title = generateTitle(material, category);
  const description = generateDescriptionSync(material, category);
  
  return { material, category, title, description };
}

// Synchronous description generation
function generateDescriptionSync(material, category) {
  const descriptions = {
    'pottery-clay': 'Beautifully handcrafted clay pottery showcasing traditional Indian craftsmanship. This unique piece features authentic techniques passed down through generations. The natural terracotta finish and smooth texture make it perfect for home decor. Each item is one-of-a-kind, reflecting the artisan\'s dedication to preserving traditional pottery methods.',
    'basket-bamboo': 'Intricately woven bamboo basket demonstrating exceptional craftsmanship and eco-friendly design. This piece showcases traditional weaving techniques perfected over centuries. Functional and decorative, it serves as both practical storage and an artistic statement. The natural bamboo ensures durability while maintaining an authentic rustic charm.',
    'wood-wood carving': 'Masterfully carved wooden piece showcasing intricate detailing and artistic excellence. This handcrafted creation reflects traditional wood carving techniques passed through generations of skilled artisans. The natural grain and hand-finished surface highlight the craftsman\'s expertise. Perfect for collectors or as a statement piece in home decor.',
    'textile-textile craft': 'Beautiful handwoven textile displaying vibrant colors and intricate traditional patterns. This piece showcases centuries-old weaving or embroidery techniques unique to Indian textile craftsmanship. The quality of fabric and meticulous attention to detail make it both functional and decorative. Perfect for home textiles or as a valuable collector\'s item.',
    'metal-metalwork': 'Finely crafted metal piece showcasing traditional metalworking techniques and lustrous finish. This handmade creation features intricate designs achieved through skilled craftsmanship and dedication. Perfect for decorative purposes or ceremonial use. Each detail reflects the artisan\'s expertise in traditional metal craft.',
    'mixed-jewelry': 'Stunning handcrafted jewelry piece featuring intricate detailing and traditional design elements. This unique creation combines time-honored techniques with timeless appeal. Perfect for special occasions or adding elegance to everyday wear. Each element is carefully crafted, making it a one-of-a-kind accessory that tells a story.',
    'canvas-painting': 'Captivating hand-painted artwork featuring traditional Indian art forms and vibrant colors. This piece showcases meticulous brushwork that brings the composition to life. Perfect for art collectors and home decor enthusiasts seeking authentic cultural pieces. Each stroke reflects the artist\'s vision and rich cultural heritage.',
    'default': 'Beautifully handcrafted piece showcasing traditional Indian craftsmanship with meticulous attention to detail. This authentic creation embodies the rich heritage of handmade crafts. Perfect for home decor, gifting, or personal collection. Each piece is unique, reflecting the artisan\'s skill, creativity, and dedication to preserving cultural traditions.'
  };
  
  const key = `${category}-${material}`;
  const reverseKey = `${material}-${category}`;
  return descriptions[key] || descriptions[reverseKey] || descriptions.default;
}

// Fallback analysis
function getFallbackAnalysis(filename = '') {
  return {
    material: 'mixed media',
    category: 'handmade craft',
    title: 'Handcrafted Artisan Product',
    description: 'Beautiful handcrafted item showcasing traditional Indian craftsmanship. This unique piece is made with care and attention to detail, perfect for home decor or as a thoughtful gift. Each item reflects the artisan\'s skill and dedication to preserving cultural heritage through handmade crafts.',
    confidence: 'low',
    method: 'fallback'
  };
}

// Main analysis function
async function analyzeCraftImage(imageBuffer, filename = '') {
  console.log('Starting image analysis for:', filename);
  
  // Try Gemini first (FREE and best quality)
  console.log('Trying Gemini API...');
  const geminiResult = await analyzeImageGemini(imageBuffer);
  if (geminiResult && geminiResult.confidence !== 'low') {
    console.log('✓ Analysis complete: Gemini API');
    return geminiResult;
  }
  
  // Try Hugging Face
  console.log('Trying Hugging Face API...');
  const hfResult = await analyzeImageHuggingFace(imageBuffer);
  if (hfResult && hfResult.confidence !== 'low') {
    console.log('✓ Analysis complete: Hugging Face');
    return hfResult;
  }
  
  // Use rule-based analysis
  console.log('Using rule-based analysis...');
  const ruleResult = await analyzeImageRuleBased(imageBuffer, filename);
  console.log('✓ Analysis complete: Rule-based');
  return ruleResult;
}

module.exports = {
  analyzeCraftImage,
  analyzeImageGemini,
  analyzeImageHuggingFace,
  analyzeImageRuleBased
};