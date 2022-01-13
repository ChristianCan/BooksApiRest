const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
