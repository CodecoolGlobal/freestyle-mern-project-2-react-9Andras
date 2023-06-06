require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User.js');

const { MONGO_URL, PORT = 5000 } = process.env;

const app = express();
app.use(express.json());


if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

app.get('/api/users/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

// User saving endpoint
app.post('/api/users', async (req, res) => {
  try {
    console.log(req.body);
    const { name, userName, password } = req.body;
    const createdAt = Date.now();
    const updatedAt = Date.now();
    const users = new User({
      name,
      userName,
      password,
      createdAt,
      updatedAt,
    });
    const savedUser = await users.save();
    savedUser.password = undefined;
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User sign in endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password.' });
    }
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// User profile request handling
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.password = undefined;
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

app.get('/api/users/:id/reviewedMovies', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const reviewedMovies = user.reviewedMovies;
    res.json(reviewedMovies);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

//Review adding endpoint
app.patch('/api/users/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { movieTitle, comment } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $push: { reviewedMovies: { movieTitle, comment } },
    }, { new: true });
    user.password = undefined;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

//Edit username endpoint
app.patch('/api/users/:id/username', async (req, res) => {
  try {
    const { id } = req.params;
    const { newUserName } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $set: { userName: newUserName },
    }, { new: true });
    user.password = undefined;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
});

async function startServer() {
  try {
    console.log('Connecting to the database...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to the database successfully!');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
