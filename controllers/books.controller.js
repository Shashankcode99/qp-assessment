const Books = require("../models/books.model");
const payloadValidator = require("../utils/validator");
module.exports = class BooksController {
  /**
   * @description Controller To Create A New Book
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addBook(req, res) {
    const inValidPayload = await payloadValidator(req.body, { books: true });
    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      req.body["createdBy"] = req.user.id;
      const newBook = new Books(req.body);
      try {
        const bookObject = await newBook.save();
        res
          .status(200)
          .json({ message: "Book Added Successfully", data: bookObject });
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }

  /**
   * @description Controller To Get List Of All Books (includes pagination)
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async getAllBooks(req, res) {
    const totalBooks = await Books.countDocuments({});
    const page = req?.query?.page || 1;
    const limit = req?.query?.per_page || 10;
    const offset = (page - 1) * limit;
    {
      try {
        const allBooks = await Books.find()
          .limit(limit)
          .skip(offset)
          .sort({ _id: -1 });
        res.status(200).json({ totalBooks: totalBooks, data: allBooks });
      } catch (error) {
        res.status(403).json("You are not authorized");
      }
    }
  }
  /**
   * @description Controller To Get A Single Book
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async getBook(req, res) {
    try {
      const book = await Books.findById(req.params.id);
      if (book) {
        res
          .status(200)
          .json({ message: "Book Fetched Successfully!", data: book });
      } else {
        res.status(400).json({ message: "Book Not Found!" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  /**
   * @description Controller To Delete A Single Book
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async deleteBook(req, res) {
    if (req.user.isAdmin) {
      try {
        await Books.findByIdAndDelete(req.params.id);
        res.status(200).json("Book has been deleted!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You are not allowed to delete book!");
    }
  }
  /**
   * @description Controller To Update A Single Book
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updateBook(req, res) {
    const { createdBy } = await Books.findById(req.params.id);
    try {
      if (req.user.isAdmin || createdBy === req.user.id) {
        const updatedUser = await Books.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          {
            new: true,
          }
        );
        res.status(200).json(updatedUser);
      } else {
        res.status(403).json({ message: "You cannot update this book!" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
