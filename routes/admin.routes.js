const router = require("express").Router();
const verification = require("../middlewares/verification");
const AdminController = require("../controllers/admin.controller");

router.post("/addGroceryItem", verification, AdminController.addGroceryItem);
router.get("/getAllGroceryItems", verification, AdminController.getAllItems);
router.delete("/deleteGroceryItem/:id", verification, AdminController.deleteItem);
router.delete("/deleteInventoryItemDetails/:id", verification, AdminController.deleteInventoryItem);
router.put("/updateGroceryItem/:id", verification, AdminController.updateItem);
router.put("/updateInventoryItemDetails/:id", verification, AdminController.updateInventoryItem);

module.exports = router;
