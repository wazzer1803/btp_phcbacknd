const express = require("express");
const {
  addProduct,
  removeProduct,
  updateProduct,
  getProductByPID,
  getAllProducts, 
} = require("../controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.delete("/remove/:PID", removeProduct);
router.put("/update/:PID", updateProduct);
router.get("/:PID", getProductByPID);
router.get("/all", getAllProducts);

module.exports = router;
