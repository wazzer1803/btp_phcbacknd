const cron = require("node-cron");
const Inventory = require("../models/Inventory");

const checkInventoryLevels = async () => {
  try {
    const inventories = await Inventory.find();

    for (let item of inventories) {
      const percentageLeft = (item.currentLeft / item.maxQuantity) * 100;

      if (percentageLeft <= 20) {
        item.restockRequired = true;
      } else {
        item.restockRequired = false;
      }

      await item.save();
    }

    console.log("✅ Inventory restock check completed.");
  } catch (error) {
    console.error("❌ Error checking inventory levels:", error);
  }
};

const startCronJob = () => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("🔄 Running inventory check...");
    await checkInventoryLevels();
  });
};

module.exports = startCronJob;
