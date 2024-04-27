
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/tokenAndCookie.js";

export const signup = async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, username, password, confirmPassword, } = req.body;
  
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }
  
      const user = await userModel.findOne({ username });
  
      if (user) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
      //HASH PASSWORD HERE
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password: hashedPassword,

      });
  
      if (newUser) {
        // JWT Token
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          username: newUser.username,
        });
      } else {
        res.status(400).json({ Error: "Invalid user details" });
      }
    } catch (error) {
      console.log("Error in Signup controller", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

