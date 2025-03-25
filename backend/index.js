require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./Routes/authRoutes");
const priceRoutes = require("./Routes/priceRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: [process.env.WEBSITE,"chrome-extension://fbiglbpighkkbgdgdjbmdgioihgaoemj"], credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
