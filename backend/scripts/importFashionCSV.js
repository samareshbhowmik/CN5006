const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const connectDB = require("../config/db");
const FashionShopData = require("../models/FashionShop"); // ✅ your file name

const toNumber = (v) => {
  if (v === undefined || v === null) return 0;
  const cleaned = String(v).replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
};

const importCSV = async () => {
  await connectDB();

  const results = [];
  const filePath = path.join(__dirname, "..", "fashion_shop.csv");

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push({
        productCategory: row["Product Category"],
        productName: row["Product Name"],
        unitsSold: toNumber(row["Units Sold"]),
        returns: toNumber(row["Returns"]),
        revenue: toNumber(row["Revenue"]),
        customerRating: toNumber(row["Customer Rating"]),
        stockLevel: toNumber(row["Stock Level"]),
        season: row["Season"],
        trendScore: toNumber(row["Trend Score"])
      });
    })
    .on("end", async () => {
      try {
        await FashionShopData.deleteMany({});
        await FashionShopData.insertMany(results, { ordered: false });

        console.log("✅ CSV Import Completed:", results.length);
        process.exit(0);
      } catch (err) {
        console.error("❌ Import error:", err.message);
        process.exit(1);
      }
    })
    .on("error", (err) => {
      console.error("❌ File read error:", err.message);
      process.exit(1);
    });
};

importCSV();
