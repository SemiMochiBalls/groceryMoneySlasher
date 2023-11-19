const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const connectionString = 'mongodb+srv://semizerogravity:8r2YJGcUohHE8PlP@cluster0.dlirukz.mongodb.net/price_slasher?retryWrites=true&w=majority'

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log(`Search term is: ${searchTerm}`); // Log the search term

    try {
        const regex = new RegExp(searchTerm, 'i');
        console.log(`Regex is: ${regex}`); // Log the regex

        const results = await Product.find({ name: regex });
        console.log(`Results are: ${JSON.stringify(results)}`); // Log the results

        if (results.length === 0) {
            throw new Error('No results found');
        }
        
        res.json(results);
    } catch (error) {
        console.error(`Error occurred: ${error}`); // Log the error
        if (error.message === 'No results found') {
            res.status(404).json({ error: 'No results found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Define a User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
  });
  const User = mongoose.model('User', userSchema);
//Api endpoint for user registration
app.post('/signup', (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
  
    newUser.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.send('User registered successfully!');
      }
    });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
