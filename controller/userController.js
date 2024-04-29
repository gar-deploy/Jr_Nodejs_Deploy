
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/tokenAndCookie.js";
import userModel from "../model/userModel.js";

export const signup = async (req, res) => {
  try {
    let { firstName, lastName, email, phoneNumber, username, password, confirmPassword, } = req.body;

    if (!firstName) {
      return res.send({ message: "Please enter firstName" })
    }

    if (!lastName) {
      return res.send({ message: "Please enter lastName" })
    }

    if (!email) {
      return res.send({ message: "Please enter email" })
    }

    if (!phoneNumber) {
      return res.send({ message: "Please enter phoneNumber" })
    }

    if (!username) {
      return res.send({ message: "Please enter username" })
    }

    if (!password) {
      return res.send({ message: "Please enter password" })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    username = username.toLowerCase()

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

    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({ message: 'Email address already exists' });
    } else if (error.code === 11000 && error.keyPattern.phoneNumber) {
      res.status(400).json({ message: 'Phone number already exists' });
    } else if (error.code === 11000 && error.keyPattern.username) {
      res.status(400).json({ message: 'Username already exists' });
    }
    else {
      console.log("Error in Signup controller", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || " "
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).send({ error: "Invalid Username or Password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logged Out Successfully." });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};