const express = require("express");
const router = express.Router();
const verification = require("../middlewares/verification");
const UserController = require("../controllers/user.controller")

/**
 * @description Endpoint to register a new user
 */
router.post("/register", UserController.registerUser);

/**
 * @description Endpoint to login a user and get authentication token
 */
router.post("/login", UserController.loginUser);

/**
 * @description Endpoint to place an order
 */
router.post("/user/addOrder", verification, UserController.placeOrder);

/**
 * @description Endpoint to to show all the items in the list
 */
router.get("/user/getAllItems", UserController.getAllItems);

module.exports = router;
