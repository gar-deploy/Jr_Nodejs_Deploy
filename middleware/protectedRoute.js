import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in ProtextedRoute middleware", error.message);
    res.status(500).send({ error: "Intrenal Server Error" });
  }
};

export default protectRoute;
