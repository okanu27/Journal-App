import {supabase} from "../lib/supabase.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = user; // Attach user info to the request object
        req.accessToken = token; // Attach the access token to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};