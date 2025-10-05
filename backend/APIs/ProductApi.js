const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const artisanModel = require('../Models/ArtisanModel');
const productModel = require('../Models/ProductModel');
const productapp = exp.Router();
const cors = require('cors');

productapp.use(cors(
    { origin: 'http://localhost:8080', // allow requests from any origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // allow these HTTP methods
    credentials: true } // allow credentials (cookies, authorization headers, etc.)
));
// POST /products → create product
productapp.post(
  '/products',
  expressAsyncHandler(async (req, res) => {
    const productdata = req.body;

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

    // 4. Populate artisan details
    const populatedProduct = await productDoc.populate('artisanId', 'name email');

    res.status(201).send({
      message: 'Product created',
      product: populatedProduct,
    });
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
productapp.put(
  '/products/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const product = await productModel.findById(id);
    if (!product) return res.status(404).send({ message: 'Product not found' });

    // Update product fields directly
    Object.assign(product, updates);
    const updatedProduct = await product.save();

    res.send({ message: 'Product updated successfully', product: updatedProduct });
  })
);

// Delete product
productapp.delete('/products/:id', expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await productModel.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}));

module.exports = productapp;
