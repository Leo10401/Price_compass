const express = require("express");
const PriceHistory = require("../models/PriceHistory");
const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const { productName, currentSite, currentPrice, comparisons } = req.body;
  try {
    const newEntry = new PriceHistory({
      user: req.user.id,
      productName,
      currentSite,
      currentPrice,
      comparisons
    });

    await newEntry.save();
    res.status(201).json({ message: "Price history saved", entry: newEntry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const history = await PriceHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
