
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/tokenAndCookie.js";
import userModel from "../model/userModel.js";



// ********************** SIGN UP *********************************************************
export const signup = async (req, res) => {
  try {
    let { firstName, lastName, email, phoneNumber, username, password, confirmPassword, } = req.body;
    //  USER Validation 

    // For Missing details 
    if (!firstName) {
      return res.status(400).json({ status: false, error: "Please enter firstName" })
    }

    if (!lastName) {
      return res.status(400).json({ status: false, error: "Please enter lastName" })
    }

    if (!email) {
      return res.status(400).json({ status: false, error: "Please enter email" });
    }

    if (!phoneNumber) {
      return res.status(400).json({ status: false, error: "Please enter phoneNumber" })
    }


    if (!username) {
      return res.status(400).json({ status: false, error: "Please enter username" })
    }

    if (username.length < 3) {
      return res.status(400).json({ status: false, error: "Username should have minimum 3 charaters" })
    }

    if (!password) {
      return res.status(400).json({ status: false, error: "Please enter password" })
    }
    if (!confirmPassword) {
      return res.status(400).json({ status: false, error: "Please enter confirm password" })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, error: "Passwords don't match" });
    }


    // To Remove Extra Spaces 
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    username = username.trim().toLowerCase();



    // For Valid Details 
    const validName = /^[a-zA-Z]+$/;

    if (!validName.test(firstName)) {
      return res.status(400).json({ status: false, error: "Please enter a valid firstName with alphabets only" });
    }

    if (!validName.test(lastName)) {
      return res.status(400).json({ status: false, error: "Please enter a valid lastName with alphabets only" });
    }
    const validPhone = /^[6-9]{1}[0-9]{9}$/

    if (!validPhone.test(phoneNumber)) {
      return res.status(400).json({ status: false, error: "Please enter valid Moblie number" })
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      return res.status(400).json({ status: false, error: "Please enter valid Email" })
    }

    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,15}$/

    if (!validPassword.test(password)) {
      res.status(400).json({ status: false, error: "Password should contain 8-15 charaters and atleast one uppercase, one lowercase, one number and one special charaters. - Example@123" })
    }



    const user = await userModel.findOne({ username });

    if (user) {
      return res.status(400).json({ status: false, error: "Username already exists" });
    }


    // HASH PASSWORD HERE

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

      //JWT Token  

      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        status: true,
        message: "Success",
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          username: newUser.username
        }
      });
    } else {
      res.status(400).json({ status: false, error: "Invalid user details" });
    }
  } catch (error) {

    if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({ status: false, error: 'Email address already exists' });
    } else if (error.code === 11000 && error.keyPattern.phoneNumber) {
      res.status(400).json({ status: false, error: 'Phone number already exists' });
    } else if (error.code === 11000 && error.keyPattern.username) {
      res.status(400).json({ status: false, error: 'Username already exists' });
    }
    else {
      console.log("Error in Signup controller", error.message);
      res.status(500).json({ status: false, error: "Internal server error" });
    }
  }
};

// ******************* LOGIN **********************************************************


export const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    // Validation 
    if (!username) {
      return res.status(400).json({ status: false, error: "Please enter username" })
    }

    if (!password) {
      return res.status(400).json({ status: false, error: "Please enter password" })
    }

    username = username.trim().toLowerCase();


    const user = await userModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || " "
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).send({ status: false, error: "Invalid Username or Password" });
    }

    // JWT Token 

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      status: true,
      message: "Success",
      data: {
        _id: user._id,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    });
  } catch (error) {
    console.log("Error in Login controller - ", error.message);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

// **************************** LOGOUT ******************************************************
export const logout = (req, res) => {
  try {
    if (!req.cookies.jwt) {
      res.status(200).json({ status: true, message: "No user Logged In." });
    } else {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ status: true, message: "User Logged Out Successfully." });
    }
  } catch (error) {
    console.log("Error in Logout controller - ", error.message);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};