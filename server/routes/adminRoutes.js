import express from "express"
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogAdmin, getAllComments, getDashboard, verifyAdmin } from "../controller/adminController.js"
import auth from "../middleware/auth.js"

const adminRouter = express.Router()

adminRouter.post("/login", adminLogin);
adminRouter.get("/verify", auth, verifyAdmin);
adminRouter.get("/comments",auth, getAllComments);
adminRouter.get("/blogs",auth, getAllBlogAdmin);
adminRouter.post("/delete-comment",auth, deleteCommentById);
adminRouter.post("/approve-comment",auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboard);


export default adminRouter
