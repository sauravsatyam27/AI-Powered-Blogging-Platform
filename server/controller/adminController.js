import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// ===================== ADMIN LOGIN =====================
export const adminLogin = async (req, res) => {
  try {
    // ⬅️ Extract email & password sent from frontend form
    // Frontend se jo data aa raha hai, usko yahan read kar rahe hain
    const { email, password } = req.body;

    // ⬅️ Admin credentials ko env variables se match kar rahe hain
    // Is approach se admin data DB mein store nahi hota (more secure)
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // ⬅️ JWT token generate kar rahe hain for authentication
    // Ye token future admin requests ko verify karne ke kaam aayega
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // ⬅️ Token frontend ko send kar diya
    res.json({
      success: true,
      token: token,
    });
  } catch (error) {
    // ⬅️ Agar koi unexpected error aaye to yahan handle hoga
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== GET ALL BLOGS (ADMIN) =====================
export const getAllBlogAdmin = async (req, res) => {
  try {
    // ⬅️ Saare blogs fetch kar rahe hain
    // createdAt:-1 => newest blog sabse upar dikhega
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== GET ALL COMMENTS =====================
export const getAllComments = async (req, res) => {
  try {
    // ⬅️ Saare comments fetch kar rahe hain
    // populate("blog") se comment ke saath blog details bhi mil jaati hain
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== DASHBOARD DATA =====================
export const getDashboard = async (req, res) => {
  try {
    // ⬅️ Dashboard ke liye recent blogs la rahe hain
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 });

    // ⬅️ Total blogs ka count (performance ke liye countDocuments)
    const blogs = await Blog.countDocuments();

    // ⬅️ Total comments count
    const comments = await Comment.countDocuments();

    // ⬅️ Unpublished blogs ko drafts maana ja raha hai
    const drafts = await Blog.countDocuments({ isPublished: false });

    // ⬅️ Saara dashboard data ek object mein pack kar diya
    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== DELETE COMMENT =====================
export const deleteCommentById = async (req, res) => {
  try {
    // ⬅️ Admin panel se comment ka id aa raha hai
    const { id } = req.body;

    // ⬅️ Comment ko permanently delete kar rahe hain
    // Ye admin-level action hai
    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment deleted Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===================== APPROVE COMMENT =====================
export const approveCommentById = async (req, res) => {
  try {
    // ⬅️ Approve karne wale comment ka id
    const { id } = req.body;

    // ⬅️ Comment ko approved mark kar rahe hain
    // Content change nahi hota, sirf flag update hota hai
    await Comment.findByIdAndUpdate(id, { isApproved: true });

    res.json({
      success: true,
      message: "Comment Approved Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
