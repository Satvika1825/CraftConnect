const express = require('express');
const router = express.Router();
const Sale = require('../Models/Sale');
const mongoose = require('mongoose');

// Category-wise sales
router.get('/analytics/category-sales/:artisanId', async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { startDate, endDate } = req.query;

    const matchStage = {
      artisanId: mongoose.Types.ObjectId(artisanId)
    };

    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    const categoryData = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          sales: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          category: '$_id',
          sales: 1,
          revenue: 1,
          _id: 0
        }
      },
      { $sort: { sales: -1 } }
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching category sales:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Regional sales distribution
router.get('/analytics/regional-sales/:artisanId', async (req, res) => {
  try {
    const { artisanId } = req.params;

    const regionalData = await Sale.aggregate([
      { $match: { artisanId: mongoose.Types.ObjectId(artisanId) } },
      {
        $group: {
          _id: '$region',
          sales: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          region: '$_id',
          sales: 1,
          revenue: 1,
          _id: 0
        }
      }
    ]);

    res.json(regionalData);
  } catch (error) {
    console.error('Error fetching regional sales:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seasonal insights
router.get('/analytics/seasonal-insights/:artisanId', async (req, res) => {
  try {
    const { artisanId } = req.params;

    const seasonalData = await Sale.aggregate([
      { $match: { artisanId: mongoose.Types.ObjectId(artisanId) } },
      {
        $group: {
          _id: {
            category: '$category',
            season: '$season'
          },
          totalSales: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          seasons: {
            $push: {
              season: '$_id.season',
              sales: '$totalSales',
              revenue: '$totalRevenue'
            }
          }
        }
      }
    ]);

    const insights = generateInsights(seasonalData);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching seasonal insights:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

function generateInsights(seasonalData) {
  const insights = [];

  seasonalData.forEach(categoryData => {
    const category = categoryData._id;
    const seasons = categoryData.seasons;
    const sortedSeasons = seasons.sort((a, b) => b.sales - a.sales);
    
    if (sortedSeasons.length >= 2) {
      const best = sortedSeasons[0];
      const worst = sortedSeasons[sortedSeasons.length - 1];
      
      if (best.sales > 0 && worst.sales > 0) {
        const percentageIncrease = ((best.sales - worst.sales) / worst.sales * 100).toFixed(0);
        
        insights.push({
          text: `${category} products sell ${percentageIncrease}% more during ${best.season} season`,
          trend: 'up',
          icon: 'TrendingUp',
          color: 'text-accent',
          category: category,
          bestSeason: best.season,
          worstSeason: worst.season
        });
      }
    }
  });

  return insights;
}

module.exports = router;