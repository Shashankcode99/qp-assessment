const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Users = require("../models/user.model");
const payloadValidator = require("../utils/validator");
module.exports = class UserController {
    /**
     * @description Controller To Regsiter A New User
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
  static async registerUser(req, res) {
    try {
      const inValidPayload = await payloadValidator(req.body, {
        register: true,
      });
      if (inValidPayload.errors.length) {
        return res.status(400).json(inValidPayload);
      } else {
        const newUser = new Users({
          userName: req.body.userName,
          email: req.body.email,
          password: (ciphertext = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
          ).toString()),
          isAdmin: req.body.isAdmin,
        });

        const user = await newUser.save();
        res.status(201).json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
/**
     * @description Controller For User Login 
     * @param {*} req 
     * @param {*} res 
     * @returns {*} token
     */
  static async loginUser(req, res) {
    try {
      const inValidPayload = await payloadValidator(req.body, { login: true });
      if (inValidPayload.errors.length) {
        return res.status(400).json(inValidPayload);
      } else {
        const user = await Users.findOne({
          email: req.body.email,
        });

        !user && res.status(401).json("Invalid username!");

        const bytes = CryptoJS.AES.decrypt(
          user.password,
          process.env.SECRET_KEY
        );
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
          res.status(401).json("Wrong password or username!");

        //create accessToken
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );

        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, accessToken });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
};
