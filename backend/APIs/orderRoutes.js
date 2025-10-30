const { recordSale } = require('../services/salesService');
const Product = require('../Models/ProductModel');

// Update order status endpoint
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('items.productId');

    // Record sale when order is delivered
    if (status === 'Delivered' || status === 'Completed') {
      const products = await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          return {
            product,
            quantity: item.quantity
          };
        })
      );

      await recordSale({
        order,
        products,
        shippingAddress: order.shippingAddress
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});