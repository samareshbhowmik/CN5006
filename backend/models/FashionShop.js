const mongoose = require("mongoose");

const fashionShopSchema = new mongoose.Schema(
  {
    productCategory: { type: String, required: true, trim: true },

    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },

    unitsSold: { type: Number, required: true, min: 0 },
    returns: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 },

    customerRating: { type: Number, required: true, min: 0, max: 5 },
    stockLevel: { type: Number, required: true, min: 0 },

    season: {
      type: String,
      required: true,
      enum: ["Spring", "Summer", "Autumn", "Winter"]
    },

    trendScore: { type: Number, required: true, min: 0, max: 100 }
  },
  {
    timestamps: true,
    collection: "FashionShopData"
  }
);

module.exports = mongoose.model("FashionShopData", fashionShopSchema);
