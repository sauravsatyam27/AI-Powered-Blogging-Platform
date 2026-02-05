import multer from "multer";

// ===================== MULTER CONFIG =====================
// Multer ka use file upload handle karne ke liye hota hai
// Yahan hum disk storage use kar rahe hain



const upload = multer({
  storage: multer.diskStorage({
    // ⬅️ Empty config ka matlab hai:
    // Multer default temporary folder mein file save karega
    // (usually system temp directory)
  })
});

// ⬅️ upload middleware ko export kar rahe hain
// Isse routes mein use karke images/files receive kar sakte hain
export default upload;
