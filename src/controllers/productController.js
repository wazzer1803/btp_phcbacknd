
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

exports.addProduct = async (req, res, next) => {
  try {
    const { name, productType, recommendedBy, maxQuantity, currentLeft } = req.body;

    const newProduct = new Product({
      name,
      productType,
      recommendedBy: recommendedBy || null,
    });

    await newProduct.save();

    const newInventory = new Inventory({
      product: newProduct._id,
      maxQuantity: maxQuantity || 100, 
      currentLeft: currentLeft !== undefined ? currentLeft : 0, 
      restockingRequired: (currentLeft !== undefined ? currentLeft : 0) < (maxQuantity || 100) * 0.2, 
    });

    await newInventory.save();

    res.status(201).json({
      message: "Product and Inventory added successfully",
      product: newProduct,
      inventory: newInventory,
    });
  } catch (error) {
    next(error);
  }
};


exports.removeProduct = async (req, res, next) => {
  try {
    const { PID } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ PID });
    if (!deletedProduct) {
      return next({ status: 404, message: "Product not found" });
    }

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { PID } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findOneAndUpdate({ PID }, updates, { new: true });
    if (!updatedProduct) {
      return next({ status: 404, message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProductByPID = async (req, res, next) => {
  try {
    const { PID } = req.params;

    const product = await Product.findOne({ PID }).populate("recommendedBy");
    if (!product) {
      return next({ status: 404, message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate({
      path: "recommendedBy",
      select: "email", 
      match: { _id: { $ne: null } }, 
    });

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

