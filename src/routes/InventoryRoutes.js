const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/InventoryController");

router.post("/add", inventoryController.addInventory);

router.get("/", inventoryController.getAllInventory);

router.put("/update", inventoryController.updateInventoryQuantity);

module.exports = router;
