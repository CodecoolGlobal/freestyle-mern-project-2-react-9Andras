require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/user.js');

const { MONGO_URL, PORT = 5000 } = process.env;

if (!MONGO_URL) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1);
}

const app = express();
app.use(express.json());

//Server starter
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

//Controllers
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const saveUser = async (req, res) => {
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
    savedUser.password = null;
    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
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
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.password = null;
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const getReviewedMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const reviewedMovies = user.reviewedMovies;
    res.json(reviewedMovies);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieTitle, movieId, comment } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $push: { reviewedMovies: { movieTitle, movieId, comment } },
    }, { new: true });
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const editUsername = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUserName } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      $set: { userName: newUserName },
    }, { new: true });
    user.password = null;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

//Routes
app.get('/api/users/', getUsers);

app.post('/api/users', saveUser);

app.post('/api/users/login', loginUser);

app.get('/api/users/:id', getUserProfile);

app.get('/api/users/:id/reviewedMovies', getReviewedMovies);

app.patch('/api/users/review/:id', addReview);

app.patch('/api/users/:id/username', editUsername);

app.delete('/api/users/:id', deleteUser);

startServer();
