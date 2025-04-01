const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

exports.addInventory = async (req, res, next) => {
  try {
    const { productId, maxQuantity, currentLeft } = req.body;

   const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newInventory = new Inventory({
      product: product._id,
      maxQuantity,
      currentLeft: currentLeft !== undefined ? currentLeft : 0, 
      restockingRequired: (currentLeft || 0) < maxQuantity * 0.2, 
    });

    await newInventory.save();

    res.status(201).json({
      message: "Inventory added successfully",
      inventory: newInventory,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllInventory = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate("product", "name productType") 
      .exec();

   res.status(200).json({
      message: "Inventory list fetched successfully",
      inventories: inventories.map((item) => ({
        productName: item.product.name,
        productType: item.product.productType,
        maxQuantity: item.maxQuantity,
        currentLeft: item.currentLeft,
        restockingRequired: item.restockingRequired,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInventoryQuantity = async (req, res, next) => {
    try {
      const { productId, quantity, action } = req.body;
  
      const inventory = await Inventory.findOne({ product: productId });  
      
      if (!inventory) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
  
      if (action === "add") {
        inventory.currentLeft += quantity; 
      } else if (action === "remove") {
        inventory.currentLeft -= quantity; 
      } else {
        return res.status(400).json({ message: "Invalid action. Use 'add' or 'remove'." });
      }
  
     if (inventory.currentLeft > inventory.maxQuantity) {
        inventory.currentLeft = inventory.maxQuantity; 
      }
  
      if (inventory.currentLeft < 0) {
        return res.status(400).json({ message: "Cannot have negative quantity" });
      }
  
      inventory.restockingRequired = inventory.currentLeft < inventory.maxQuantity * 0.2;
  
      await inventory.save();
  
      res.status(200).json({
        message: "Inventory updated successfully",
        inventory: inventory,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  
