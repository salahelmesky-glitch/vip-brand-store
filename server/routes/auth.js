const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check against environment variables
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (username !== adminUsername) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Secure password check using bcrypt
        // If no hash is set, fall back to plain text for local dev (NOT for production!)
        let passwordValid = false;
        if (adminPasswordHash) {
            passwordValid = await bcrypt.compare(password, adminPasswordHash);
        } else {
            // Fallback for local development only
            passwordValid = password === (process.env.ADMIN_PASSWORD || 'VIP2026');
        }

        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: adminUsername, role: 'admin' },
            process.env.JWT_SECRET || 'vip_brand_super_secret_key_2024',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { username: adminUsername, role: 'admin' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'vip_brand_super_secret_key_2024'
        );
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
