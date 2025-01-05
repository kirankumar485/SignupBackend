const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        if(req.user.role === "admin") {
            // Admin: Return all users
            const users = await User.find({}, { password: 0 });
            return res.json(users);
        } else {
            // Regular user: Return only their profile
            console.log(req)
            const user = await User.findById(req.user.id, { password: 0 });
            return res.json([user]);
        }
    } catch(error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });
        res.json(user);
    } catch(error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
};