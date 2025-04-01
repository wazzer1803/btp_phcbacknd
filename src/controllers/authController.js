const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const JWT_SECRET = "your_secret_key"; 

exports.signupUser = async (req, res, next) => {
  try {
    const { email, password, userType, name, age, specialization, experience,branch,batch } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

   const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, userType });
    await newUser.save();

    let userProfile;
    if (userType === "doctor") {
      userProfile = new Doctor({
        user: newUser._id,
        name,
        age,
        specialization: specialization || null,
        experience: experience || null,
      });
    } else if (userType === "student") {
      userProfile = new Student({
        user: newUser._id,
        name,
        age,
        branch,
        batch
      });
    } else if (userType === "admin") {
      userProfile = new Admin({
        user: newUser._id,
        name,
      });
    }

    if (userProfile) {
      await userProfile.save();
    }

    const token = jwt.sign(
      { userId: newUser._id, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Signup successful", token, userType: newUser.userType });
  } catch (error) {
    next(error);
  }
};




exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    res.status(200).json({ message: "Login successful", token, userType: user.userType });
  } catch (error) {
    next(error);
  }
};


exports.bulkSignupUsers = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const usersData = req.body; 
    const createdUsers = [];

    for (let userData of usersData) {
      const { email, password, userType, name, age, specialization, experience, branch, batch } = userData;

      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        throw new Error(`User with email ${email} already exists.`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ email, password: hashedPassword, userType });
      await newUser.save({ session });

      let userProfile;
      let userToken;

      if (userType === "doctor") {
       
        const lastDoctor = await Doctor.findOne({}, {}, { sort: { DID: -1 } }).session(session);
        let newDID = "DOC001";
        if (lastDoctor && lastDoctor.DID) {
          const lastNumber = parseInt(lastDoctor.DID.replace("DOC", ""), 10);
          newDID = `DOC${String(lastNumber + 1).padStart(3, "0")}`;
        }

        userProfile = new Doctor({
          user: newUser._id,
          name,
          age,
          specialization: specialization || null,
          experience: experience || null,
          DID: newDID,  
        });
      } else if (userType === "student") {
        
        const lastStudent = await Student.findOne({}, {}, { sort: { SID: -1 } }).session(session);
        let newSID = "STU0001";
        if (lastStudent && lastStudent.SID) {
          const lastNumber = parseInt(lastStudent.SID.replace("STU", ""), 10);
          if (lastNumber >= 9999) {
            throw new Error("Maximum student limit reached (9999)");
          }
          newSID = `STU${String(lastNumber + 1).padStart(4, "0")}`;
        }

        userProfile = new Student({
          user: newUser._id,
          name,
          age,
          branch,
          batch,
          SID: newSID,  
        });
      } else if (userType === "admin") {
        userProfile = new Admin({
          user: newUser._id,
          name,
        });
      }

      if (userProfile) {
        await userProfile.save({ session }); 
      }

      userToken = jwt.sign(
        { userId: newUser._id, userType: newUser.userType },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      createdUsers.push({
        email,
        userType,
        token: userToken,  
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Bulk signup successful",
      users: createdUsers,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
};