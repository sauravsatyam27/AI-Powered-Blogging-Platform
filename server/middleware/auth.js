import jwt from "jsonwebtoken";

// ===================== AUTH MIDDLEWARE =====================
// Ye middleware admin/protected routes ko secure karta hai
// Har request se pehle JWT token verify karta hai
const auth = (req, res, next) => {
  try {
    // ⬅️ Authorization header read kar rahe hain
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // ⬅️ Agar token hi nahi aaya
    // Matlab user unauthorized hai
    if (!authHeader) {
      return res.json({
        success: false,
        message: "No token provided"
      });
    }

    // ⬅️ "Bearer <token>" se actual token extract kar rahe hain
    const token = authHeader.split(" ")[1];

    // ⬅️ Token verify kar rahe hain using secret key
    // Agar token invalid / expired hua to error throw hoga
    jwt.verify(token, process.env.JWT_SECRET);

    // ⬅️ Token valid hai, ab next middleware / controller call hoga
    next();
  } catch {
    // ⬅️ Token invalid, expired ya tampered ho sakta hai
    res.json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default auth;
