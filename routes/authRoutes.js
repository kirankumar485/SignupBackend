const express = require("express");
const multer = require("multer");

const { register, login } = require("../controllers/authController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.single("image"), register);
router.post("/login", login);

module.exports = router;