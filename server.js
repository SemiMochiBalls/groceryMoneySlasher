const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB Atlas (replace YOUR_CONNECTION_STRING with your actual connection string)
mongoose.connect('YOUR_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas');
});

// Define a simple product schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    // Add other fields as needed
});

const Product = mongoose.model('Product', productSchema);

// API endpoint for searching products
app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;

    try {
        // Use a regular expression for case-insensitive search
        const regex = new RegExp(searchTerm, 'i');
        const results = await Product.find({ name: regex });

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
