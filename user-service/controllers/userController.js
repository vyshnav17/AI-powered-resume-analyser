import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        // Assuming middleware puts user info in req.user
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ id: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    // JWT is stateless so we just acknowledge the logout and let the client clear its token
    res.json({ message: 'Logged out successfully' });
};
