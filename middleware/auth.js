import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-shaadibio-secret";

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (header && typeof header === "string" && header.startsWith("Bearer ")) {
      token = header.substring(7);
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id.toString();
    return next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Auth error", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;

