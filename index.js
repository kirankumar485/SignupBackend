const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});