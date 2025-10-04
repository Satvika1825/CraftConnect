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
//get products 
productapp.get(
  '/products',
  expressAsyncHandler(async (req, res) => {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = { isApproved: true }; // ✅ only approved products for consumers

    // 1. Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Filter by category
    if (category) {
      filter.category = category;
    }

    // 3. Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 4. Filter by rating
    if (minRating) {
      filter.ratings = { $gte: Number(minRating) };
    }

    // Pagination setup
    const skip = (page - 1) * limit;

    // Fetch products
    const products = await productModel
      .find(filter)
      .populate('artisanId', 'name email') // show artisan info
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // latest first

    // Total count for pagination
    const total = await productModel.countDocuments(filter);

    res.send({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  })
);
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

// DELETE /products/:id
productapp.delete(
  '/products/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // authenticated user
    const role = req.user.role;  // "artisan" or "admin"

    const product = await productModel.findById(id);
    if (!product) return res.status(404).send({ message: 'Product not found' });

    // Only owner artisan or admin can delete
    if (product.artisanId.toString() !== userId.toString() && role !== 'admin') {
      return res.status(403).send({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.send({ message: 'Product deleted successfully' });
  })
);

module.exports = productapp;
