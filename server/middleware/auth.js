import jwt from "jsonwebtoken";
import User from "../models/User.js";
const protect = async (req, res, next) => {
  let token;

  console.log("Checking auth for:", req.method, req.path);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token from header:", token);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token from cookie:", token);
  }

  if (!token) {
    console.log("No token found!");
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/auth/login");
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User authorized:", req.user.email);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/auth/login");
    } else {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};

export default protect;
