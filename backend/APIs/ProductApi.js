const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const artisanModel = require('../Models/ArtisanModel');
const productModel = require('../Models/ProductModel');
const ActivityModel = require('../Models/ActivityModel');
const productapp = exp.Router();
const cors = require('cors');

productapp.use(cors(
    { origin: ['http://localhost:8080','https://craft-connect-blond.vercel.app'], // allow requests from any origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE','OPTIONS'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));

// Add this helper function at the top
const logActivity = async (type, userId, details, message) => {
  try {
    console.log('Creating activity log:', { type, userId, details, message });
    const activity = await ActivityModel.create({
      type,
      userId,
      details,
      message
    });
    console.log('Activity created:', activity);
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// POST /products → create product
productapp.post(
  '/products',
  expressAsyncHandler(async (req, res) => {
    const productdata = req.body;
    
    try {
      // 1. Check if artisan exists
      const artisan = await artisanModel.findById(productdata.artisanId);
      if (!artisan) {
        return res.status(400).send({ message: 'Invalid artisanId' });
      }

      // 2. Check if product already exists (same artisan + same name)
      const existingProduct = await productModel.findOne({
        artisanId: productdata.artisanId,
        name: productdata.name,
      });

      if (existingProduct) {
        return res
          .status(409) // Conflict
          .send({ message: 'Product with this name already exists for this artisan' });
      }

      // 3. Create new product
      const newProduct = new productModel(productdata);
      const productDoc = await newProduct.save();
      const populatedProduct = await productDoc.populate('artisanId', 'name email');

      // Use the helper function
      await logActivity(
        'product_added',
        productdata.artisanId,
        {
          productId: productDoc._id,
          productName: productDoc.name,
          category: productDoc.category,
          price: productDoc.price
        },
        `New product "${productDoc.name}" added by ${populatedProduct.artisanId.name}`
      );

      res.status(201).send({
        message: 'Product created',
        product: populatedProduct,
      });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).send({ message: 'Failed to create product', error: error.message });
    }
  })
);
// Update product approval status
productapp.patch('/products/:id', expressAsyncHandler(async (req, res) => {
  try {
    const { approved } = req.body;
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    ).populate('artisanId');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));
//get products based on approval status
productapp.get('/products', expressAsyncHandler(async (req, res) => {
  try {
    const { approved, artisanId } = req.query;
    const filter = {};
    
    if (approved !== undefined) {
      filter.approved = approved === 'true';
    }
    
    if (artisanId) {
      filter.artisanId = artisanId;
    }
    const products = await productModel.find(filter)
      .populate('artisanId')
      .sort({ createdAt: -1 });
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));
// GET /products/:id
productapp.get(
  '/products/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find product by ID
    const product = await productModel
      .findById(id)
      .populate('artisanId', 'name email'); // show artisan details

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.send(product);
  })
);
// PUT /products/:id
// PUT /products/:id
productapp.put(
  '/products/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Populate artisanId to access the name property
    const product = await productModel.findById(id).populate('artisanId');
    if (!product) return res.status(404).send({ message: 'Product not found' });

    // Store old values BEFORE updating
    const oldValues = {
      name: product.name,
      price: product.price,
      category: product.category
    };

    // Remove userId from updates (it's only for activity logging)
    const { userId, ...productUpdates } = updates;

    // Update product fields
    Object.assign(product, productUpdates);
    const updatedProduct = await product.save();

    // REMOVED: Activity logging - causing validation errors
    // Will be re-enabled after server restart
    /*
    try {
      await ActivityModel.create({
        type: 'product_updated',
        userId: req.body.userId,
        details: {
          productId: product._id,
          oldValues: oldValues,
          newValues: {
            name: updatedProduct.name,
            price: updatedProduct.price,
            category: updatedProduct.category
          }
        },
        message: `Product "${updatedProduct.name}" was updated by ${product.artisanId?.name || 'Unknown Artisan'}`
      });
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }
    */

    res.send({ message: 'Product updated successfully', product: updatedProduct });
  })
);

// Backend - Validate ObjectId

productapp.delete('/product-api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});
productapp.put('/products/:id/approve', expressAsyncHandler(async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).populate('artisanId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create activity log directly using ActivityModel
    await ActivityModel.create({
      type: 'product_approved',
      userId: req.body.adminId,
      details: { 
        productId: product._id,
        productName: product.name,
        artisanId: product.artisanId._id 
      },
      message: `Product "${product.name}" by ${product.artisanId.name} was approved`
    });

    res.json(product);
  } catch (error) {
    console.error('Error approving product:', error);
    res.status(500).json({ message: 'Failed to approve product' });
  }
}));

module.exports = productapp;
