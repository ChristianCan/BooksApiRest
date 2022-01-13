// Models
const Book = require("../models/Book");

// Get all books
const getAllBooks = async (req, res) => {
  const books = await Book.find({});

  try {
    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ Error: "There are no Books right now!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get book by id
const getBookById = async (req, res) => {
  const { params } = req;
  try {
    const book = await Book.findOne({ id: params.id });
    if (book !== null) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ Error: "Book not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add new book
const createBook = async (req, res) => {
  const { body } = req;

  const books = await Book.find({});
  let newBook;

  if (books.length === 0) {
    newBook = new Book({
      id: 1,
      title: body.title,
      author: body.author,
      summary: body.summary,
      genre: body.genre,
      year: body.year,
      publisher: body.publisher,
    });
  } else {
    newBook = new Book({
      id: parseInt(books[books.length - 1].id, 10) + 1,
      title: body.title,
      author: body.author,
      summary: body.summary,
      genre: body.genre,
      year: body.year,
      publisher: body.publisher,
    });
  }

  try {
    const book = await Book.findOne({ id: body.id });
    if (!book) {
      await newBook.save().then(
        () => res.status(201).json(newBook),
        () => {
          res.status(400).json({
            Error: "A Book with the same characteristics already exists",
          });
        }
      );
    } else {
      res.status(400).json({
        Error: "A Book with the same id already exists",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update book
const updateBook = async (req, res) => {
  const { body } = req;
  const { params } = req;

  try {
    const book = await Book.findOne({ id: params.id });
    if (!book) {
      res.status(404).json({ Error: "Book not found" });
    } else {
      const checkBook = await Book.findOne({
        title: body.title,
        author: body.author,
        summary: body.summary,
        genre: body.genre,
        year: body.year,
        publisher: body.publisher,
      });
      //Si existe un libro con lo que esta en el request body y ese libro no tiene el mismo id que el libro que estoy actualizando
      if (checkBook !== null && checkBook.id !== book.id) {
        res.status(400).json({
          Error: "A Book with the same characteristics already exists",
        });
      } else {
        await Book.findOneAndUpdate(
          { id: book.id },
          {
            title: body.title,
            author: body.author,
            summary: body.summary,
            genre: body.genre,
            year: body.year,
            publisher: body.publisher,
          }
        ).then(
          () => res.status(200).json({ Message: "Book sucessfully updated" }),
          () => {
            res.status(400).json({
              Error: "Error",
            });
          }
        );
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete book
const deleteBook = async (req, res) => {
  const { params } = req;

  try {
    const book = await Book.findOne({ id: params.id });

    if (!book) {
      res.status(404).json({ Error: "Book not found" });
    } else {
      await Book.findByIdAndDelete({ _id: book._id });
      res.status(200).json({ Message: "Book sucessfully deleted!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
