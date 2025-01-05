const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const image = req.file;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Save the image locally
        let imagePath = null;
        if(image) {
            const uploadDir = path.join(__dirname, "../uploads");

            // Create the "uploads" directory if it doesn't exist
            if(!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate a unique filename to avoid conflicts
            const uniqueFilename = Date.now() + "-" + image.originalname;
            imagePath = path.join(uploadDir, uniqueFilename);

            // Save the file to the "uploads" directory
            fs.writeFileSync(imagePath, image.buffer);

            // Store the relative path in the database
            imagePath = `/uploads/${uniqueFilename}`;
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            image: imagePath,
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            },
        });
    } catch(error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password is valid
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", {
            expiresIn: "1h",
        });

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            },
        });
    } catch(error) {
        res.status(500).json({ message: "Error logging in" });
    }
};