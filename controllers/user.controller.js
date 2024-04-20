const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Users = require("../models/user.model");
const Items = require("../models/items.model");
const Orders = require("../models/order.model");
const Inventory = require("../models/inventory.model");
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
          password: (CryptoJS.AES.encrypt(
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




  /**
     * @description Controller For Placing Order
     * @param {*} req 
     * @param {*} res 
     * @returns {*} token
     */
  static async placeOrder(req, res) {
     
    let updatePromises = [];
    const {orderDetails, modeOfPayment} = req?.body;
    const totalAmount  = orderDetails.reduce((acc, curr) => acc + (curr.quantity * curr.price),0);

    const orderDetailsObject = {
      orderItems: orderDetails,
      totalAmount:totalAmount,
      paymentMode: modeOfPayment,
      orderBy: req?.user?.id

    }
      const newOrder = new Orders(orderDetailsObject);
      try {
        const orderPlaced = await newOrder.save();
        if(orderPlaced) {            
          for (const itemUpdate of orderDetails) {
            // Specify the condition for updating (based on _id)
            const filter = { itemId: itemUpdate.itemId };
            const oldData = await Inventory.findOne({ itemId: itemUpdate.itemId }).select({
              itemId : 1,
              quantity: 1,
              minimumStockLevel : 1,
              status: 1,
              updatedBy: 1
            });
            const updateFields = {
              quantity: (oldData.quantity - itemUpdate.quantity < 0) ? 0 : oldData.quantity - itemUpdate.quantity,
              status: (oldData.quantity - itemUpdate.quantity < 0 ? 'Out Of Stock!' : oldData.status ),
              minimumStockLevel : oldData.minimumStockLevel,
              updatedBy: req.user.id,
              oldData: oldData,
              newData: { quantity: oldData.quantity - itemUpdate.quantity,
                status: (oldData.quantity - itemUpdate.quantity < 0 ? 'Out Of Stock!' : oldData.status ),
                updatedBy: req.user.id}
            }
            // Construct the update operation for this item
            const updateOperation = Inventory.updateOne(filter, updateFields);

            // Push the promise for this update operation to the array
            updatePromises.push(updateOperation);
        };

        // Execute all update operations concurrently
        const results = await Promise.all(updatePromises);
        res
        .status(200)
        .json({ message: "Order Placed Successfully"});
        }
    
      } catch (error) {
        res.status(500).json(error);
      }
  }



  /**
   * @description Controller To Get List Of All Grocery Items (includes pagination) along with inventory details
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async getAllItems(req, res) {
    const totalItems = await Items.countDocuments({});
    const page = req?.query?.page || 1;
    const limit = req?.query?.per_page || 10;
    const offset = (page - 1) * limit;
    {
      try {
        const allItems = await Items.find()  
          .limit(limit)
          .skip(offset)
          .sort({ _id: -1 });
        res.status(200).json({ totalItems: totalItems, data: allItems });
      } catch (error) {
        res.status(403).json("You are not authorized");
      }
    }
  }

};
