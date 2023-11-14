const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
const connectionString = 'mongodb+srv://semizerogravity:8r2YJGcUohHE8PlP@cluster0.dlirukz.mongodb.net/?retryWrites=true&w=majority'

app.use(cors());

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


app.get('/', (req, res) => {
    res.send('HI Sachi');
});


// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas');
});

// Define a simple product schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    location: String,
});

const Product = mongoose.model('Product', productSchema);


// API endpoint for searching products
app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;

    try {
        // Escape special characters in the search term
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedSearchTerm, 'i');
        const results = await Product.find({ name: regex });

        if (results.length === 0) {
            throw new Error('No results found');
        }

        res.json(results);
    } catch (error) {
        if (error.message === 'No results found') {
            res.status(404).json({ error: 'No results found' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
