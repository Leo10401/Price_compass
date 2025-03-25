const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productName: { type: String, required: true },
  currentSite: { type: String, required: true },
  currentPrice: { type: String, required: true },
  comparisons: [{ site: String, price: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
