const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller")

/**
 * @description Endpoint to register a new user
 */
router.post("/register", UserController.registerUser);

/**
 * @description Endpoint to login a user and get authentication token
 */
router.post("/login", UserController.loginUser);

module.exports = router;
