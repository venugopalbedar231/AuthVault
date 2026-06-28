import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export async function protect(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        console.log("Middleware token:", token); // add this

        if (!token) {
            return res.status(401).json({ message: "Access token not found" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log("Decoded:", decoded); // add this

        const user = await userModel.findById(decoded.id).select("-password");
        console.log("User found:", user); // add this
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (err) {
        console.log("Middleware error:", err.message); // add this
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}