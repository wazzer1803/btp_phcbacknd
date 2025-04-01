const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const errorHandler = require("./middlewares/errorHandler");
const studentRoutes = require("./routes/studentRoutes");  
const doctorRoutes = require("./routes/doctorRoutes");  
const inventoryRoutes = require("./routes/InventoryRoutes.js");
const userRoutes = require("./routes/userRoutes"); 




const startCronJob = require("./jobs/cronJob"); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect("mongodb+srv://swissaklo:sahilchauksey123@cluster0.8frl54w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { 
    
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/healthRecords", healthRecordRoutes);
app.use("/api/students", studentRoutes);  
app.use("/api/doctors", doctorRoutes);  
app.use("/api/inventory", inventoryRoutes);
app.use("/api/users", userRoutes);





startCronJob();

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
