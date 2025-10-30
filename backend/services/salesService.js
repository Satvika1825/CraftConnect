const Sale = require('../Models/Sale');

function getRegionFromState(state) {
  const regionMap = {
    'North': ['Delhi', 'Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Uttarakhand', 'Chandigarh'],
    'South': ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Puducherry'],
    'East': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
    'West': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa', 'Daman and Diu', 'Dadra and Nagar Haveli'],
    'Central': ['Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh']
  };

  for (const [region, states] of Object.entries(regionMap)) {
    if (states.some(s => state?.toLowerCase().includes(s.toLowerCase()))) {
      return region;
    }
  }
  return 'Central';
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 10) return 'Monsoon';
  if (month === 11) return 'Autumn';
  return 'Winter';
}

async function recordSale(orderData) {
  try {
    const { order, products, shippingAddress } = orderData;

    const salePromises = products.map(async (item) => {
      const saleData = {
        productId: item.product._id,
        artisanId: item.product.artisanId,
        orderId: order._id,
        quantity: item.quantity,
        price: item.product.price,
        totalAmount: item.product.price * item.quantity,
        category: item.product.category,
        region: getRegionFromState(shippingAddress?.state),
        customerLocation: {
          state: shippingAddress?.state,
          city: shippingAddress?.city,
          pincode: shippingAddress?.pincode
        },
        season: getCurrentSeason(),
        saleDate: new Date()
      };

      return await Sale.create(saleData);
    });

    return await Promise.all(salePromises);
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
}

module.exports = {
  recordSale,
  getRegionFromState,
  getCurrentSeason
};