const express = require("express");

const { getAllUsers, getUserProfile } = require("../controllers/userController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.get("/users", authJwt, getAllUsers);
router.get("/profile", authJwt, getUserProfile);

module.exports = router;