const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const URL = require('./models/urlModel'); // Import the URL schema

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://hunterboy:6byCc5T505X19m0z@cluster0.k6pjy.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API route to shorten the URL
app.post('/api/url', async (req, res) => {
    const { longURL } = req.body;
    const shortID = shortid.generate();

    try {
        const newUrl = await URL.create({
            shortURL: shortID,
            redirectedURL: longURL,
        });

        res.json({
            success: true,
            shortURL: `https://url-shortner-lime-six.vercel.app/location/${newUrl.shortURL}`,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error shortening URL' });
    }
});

// API route to redirect to original URL
app.get('/api/location/:shortURL', async (req, res) => {
    const shortURL = req.params.shortURL;

    try {
        const url = await URL.findOne({ shortURL });

        if (url) {
            return res.redirect(url.redirectedURL);
        } else {
            return res.status(404).json({ success: false, message: 'URL not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error processing request' });
    }
});

// Expose the app as a module for Vercel
module.exports = app;
