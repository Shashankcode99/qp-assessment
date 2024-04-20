const Items = require("../models/items.model");
const Inventory = require("../models/inventory.model");
const payloadValidator = require("../utils/validator");
module.exports = class BooksController {
  /**
   * @description Controller To Add New Grocery Items
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addGroceryItem(req, res) {
    const inValidPayload = await payloadValidator(req.body, { item: true });
    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      const newItem = new Items(req.body);
      try {
        const itemObject = await newItem.save();
        if(itemObject) {
          const updateObject = {
            itemId : itemObject._id,
            quantity : req.body.quantity,
            minimumStockLevel : req.body.minimumStockLevel,
            status: 'In Stock',
            updatedBy: req.user.id
          }
          const updateInventory = new Inventory(updateObject);
          await updateInventory.save();
        }
        res
          .status(200)
          .json({ message: "Grocery Item Added Successfully", data: itemObject });
      } catch (error) {
        res.status(500).json(error);
      }
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
        const allItems = await Items.aggregate([
          {
              $lookup: {
                  from: 'inventories', // name of the inventory collection
                  let: { itemIdStr: { $toString: "$_id" } }, // convert _id to string
                  pipeline: [
                      {
                          $match: {
                              $expr: { $eq: [ "$itemId", "$$itemIdStr" ] } // match itemId with converted _id string
                          }
                      }
                  ],
                  as: 'inventoryDetails' // field name to store inventory details
              }
          }
      ])  .limit(limit)
          .skip(offset)
          .sort({ _id: -1 });
        res.status(200).json({ totalItems: totalItems, data: allItems });
      } catch (error) {
        res.status(403).json("You are not authorized");
      }
    }
  }


  /**
   * @description Controller To Delete A Single Item
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async deleteItem(req, res) {
    if (req.user.isAdmin) {
      try {
        await Items.findByIdAndDelete(req.params.id);
        res.status(200).json("Grocery Item has been deleted!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You are not allowed to delete item!");
    }
  }


  /**
   * @description Controller To Update A Single Item
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updateItem(req, res) {
    const { updatedBy } = await Items.findById(req.params.id);
    try {
      if (req.user.isAdmin || updatedBy === req.user.id) {
        const updatedUser = await Items.findByIdAndUpdate(
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


  
  /**
   * @description Controller To Update Inventory Details Of An Item
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updateInventoryItem(req, res) {
    const oldData = await Inventory.findById(req.params.id).select({
      itemId : 1,
      quantity: 1,
      minimumStockLevel : 1,
      status: 1,
      updatedBy: 1
    });
    try {
      if (req.user.isAdmin || oldData.updatedBy === req.user.id) {
        if(req.body.quantity == 0) {
          req.body.status = 'Out of Stock';
        }
          const updateObject = {
            ...req.body,
            oldData : oldData,
            newData : req.body
          }

        const updatedUser = await Inventory.findByIdAndUpdate(
          oldData._id,
          {
            $set: updateObject,
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


  /**
   * @description Controller To Delete A Single Item Form Inventory
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async deleteInventoryItem(req, res) {
    if (req.user.isAdmin) {
      try {
        const itemToBeDeleted = await Inventory.findById(req.params.id);
        await Inventory.findByIdAndDelete(req.params.id)
        await Items.findByIdAndDelete(itemToBeDeleted.itemId);
        res.status(200).json("Item has been deleted from inventory!");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You are not allowed to delete inventory item!");
    }
  }

};
