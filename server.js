const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DatabaseName', {
  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Failed to connect to MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname)));

// Root Route to serve the Sign-In page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submissions
app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Create a new user instance
    const newUser = new User({ username, password });
    // Save user to MongoDB
    await newUser.save();
    console.log('User saved:', newUser);
    // Redirect to the Language Setting page
    res.redirect('/lan.html');
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Error saving user to MongoDB.');
  }
});

// Define a user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Serve the Language Setting page
app.get('/lan.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'lan.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
