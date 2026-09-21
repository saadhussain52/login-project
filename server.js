const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://saadhussain3536_db_user:93UbqjG4EsbsaPt0@cluster0.wacratk.mongodb.net/schoolProject?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Atlas Connected Successfully!'))
.catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Signup Route (Register without hashing - Plain text password)
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Save user directly with plain text password
        user = new User({ email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route (Direct password comparison)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Compare password directly
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful!', email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));