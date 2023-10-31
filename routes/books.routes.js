const router = require("express").Router();
const verification = require("../middlewares/verification");
const BooksController = require("../controllers/books.controller");

router.get("/book/:id", BooksController.getBook);
router.get("/books", verification, BooksController.getAllBooks);
router.post("/book", verification, BooksController.addBook);
router.put("/book/:id", verification, BooksController.updateBook);
router.delete("/book/:id", verification, BooksController.deleteBook);

module.exports = router;
