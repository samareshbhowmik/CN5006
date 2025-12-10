const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const FashionShopData = require("./models/FashionShop");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connect
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("✅ Fashion Shop API running");
});


// ===============================
// 1.5 ADD product
// ===============================
app.post("/api/products/add", async (req, res) => {
  try {
    const {
      productCategory,
      productName,
      unitsSold,
      returns,
      revenue,
      customerRating,
      stockLevel,
      season,
      trendScore
    } = req.body;

    // Basic required field check
    if (
      !productCategory ||
      !productName ||
      unitsSold == null ||
      returns == null ||
      revenue == null ||
      customerRating == null ||
      stockLevel == null ||
      !season ||
      trendScore == null
    ) {
      return res.status(400).json({
        message: "All 9 fields are required."
      });
    }

    const exists = await FashionShopData.findOne({ productName });
    if (exists) {
      return res.status(409).json({
        message: "Product Name already exists."
      });
    }

    const product = await FashionShopData.create(req.body);

    res.status(201).json({
      message: "Product added",
      product
    });
  } catch (err) {
    res.status(400).json({
      message: "Add failed",
      error: err.message
    });
  }
});


// ===============================
// 1.6 UPDATE by productName
// ===============================
app.post("/api/products/update", async (req, res) => {
  try {
    const { productName, ...updates } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    const updated = await FashionShopData.findOneAndUpdate(
      { productName },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", updated });
  } catch (err) {
    res.status(500).json({
      message: "Update failed",
      error: err.message
    });
  }
});


// ===============================
// 1.7 DELETE by productName
// ===============================
app.post("/api/products/delete", async (req, res) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "productName is required" });
    }

    const deleted = await FashionShopData.findOneAndDelete({ productName });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted", deleted });
  } catch (err) {
    res.status(500).json({
      message: "Delete failed",
      error: err.message
    });
  }
});


// ===============================
// 1.8 Totals for a given season
// GET /api/season/totals?season=Summer
// ===============================
app.get("/api/season/totals", async (req, res) => {
  try {
    const { season } = req.query;

    if (!season) {
      return res.status(400).json({ message: "season is required" });
    }

    
    const seasonNorm = season.trim();

    const result = await FashionShopData.aggregate([
        { $match: { season: seasonNorm } },    
      {
        $group: {
          _id: "$season",
          totalUnitsSold: { $sum: "$unitsSold" },
          totalReturns: { $sum: "$returns" },
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json(
      result[0] || {
        season,
        totalUnitsSold: 0,
        totalReturns: 0,
        totalRevenue: 0
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Totals failed",
      error: err.message
    });
  }
});


// ===============================
// 1.9 First 10 records
// Units Sold > value for given season
// GET /api/products/top10?season=Summer&minUnits=50
// ===============================
app.get("/api/products/top10", async (req, res) => {
  try {
    const { season, minUnits } = req.query;
    const min = Number(minUnits);

    if (!season || Number.isNaN(min)) {
      return res
        .status(400)
        .json({ message: "season and minUnits are required" });
    }

    const products = await FashionShopData.find({
      season,
      unitsSold: { $gt: min }
    })
      .sort({ unitsSold: -1 })
      .limit(10);

    res.json({
      season,
      minUnits: min,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      message: "Top10 failed",
      error: err.message
    });
  }
});


// ===============================
// 1.10 Products where AVG rating meets condition
// GET /api/products/avg-rating?season=Summer&minRating=4
// ===============================
app.get("/api/products/avg-rating", async (req, res) => {
  try {
    const { season, minRating } = req.query;
    const min = Number(minRating);

    if (!season || Number.isNaN(min)) {
      return res
        .status(400)
        .json({ message: "season and minRating are required" });
    }

    const result = await FashionShopData.aggregate([
      { $match: { season } },
      {
        $group: {
          _id: "$productName",
          productCategory: { $first: "$productCategory" },
          productName: { $first: "$productName" },
          unitsSold: { $first: "$unitsSold" },
          returns: { $first: "$returns" },
          revenue: { $first: "$revenue" },
          customerRatingAvg: { $avg: "$customerRating" },
          stockLevel: { $first: "$stockLevel" },
          season: { $first: "$season" },
          trendScore: { $first: "$trendScore" }
        }
      },
      { $match: { customerRatingAvg: { $gte: min } } },
      { $sort: { customerRatingAvg: -1 } }
    ]);

    res.json({
      season,
      minRating: min,
      count: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: "Avg rating failed",
      error: err.message
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
