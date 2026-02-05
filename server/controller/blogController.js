import fs from "fs";
import Blog from "../models/Blog.js";
import imagekit from "../config/imageKit.js";
import Comment from "../models/Comment.js";
import generateAIContent from "../config/gemini.js";

/* ===================== ADD BLOG ===================== */
export const addBlog = async (req, res) => {
  try {
    // ⬅️ Blog data frontend se string ke form mein aa raha hai
    // Isliye JSON.parse karna zaroori hai
    const { title, subTitle, description, category, isPublished } =
      JSON.parse(req.body.blog);

    // ⬅️ Uploaded image file (multer ke through)
    const imageFile = req.file;

    // ⬅️ Basic validation: important fields missing na ho
    if (!title || !description || !category || !imageFile) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    // ⬅️ Image ko buffer mein convert kar rahe hain
    // Ye buffer ImageKit upload ke kaam aata hai
    const fileBuffer = fs.readFileSync(imageFile.path);
    let imageURL = "";

    // 🔥 Upload image to ImageKit (cloud storage)
    try {
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: Date.now() + ".jpg" // unique filename
      });

      // ⬅️ Public image URL generate kar rahe hain
      imageURL = imagekit.url({
        path: response.filePath
      });
    } catch (err) {
      // ⬅️ Agar image upload fail ho jaaye
      // Tab bhi blog create hone diya ja raha hai (graceful handling)
      console.log("Ignoring ImageKit error:", err.message);
    }

    // ✅ DELETE TEMP FILE (VERY IMPORTANT)
    // Local server par unnecessary file save na rahe
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    // 🔥 Blog data database mein save kar rahe hain
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: imageURL,
      isPublished
    });

    return res.json({
      success: true,
      message: "Blog added successfully"
    });
  } catch (error) {
    // ⬅️ Kisi bhi unexpected error ko safely handle kar rahe hain
    return res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== GET ALL BLOGS ===================== */
export const getAllBlogs = async (req, res) => {
  try {
    // ⬅️ Sirf published blogs users ko dikhaye jaate hain
    const blogs = await Blog.find({ isPublished: true });

    res.json({ success: true, blogs });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== GET BLOG BY ID ===================== */
export const getBlogById = async (req, res) => {
  try {
    // ⬅️ URL params se blogId nikaal rahe hain
    const { blogId } = req.params;

    // ⬅️ Specific blog fetch kar rahe hain
    const blog = await Blog.findById(blogId);

    // ⬅️ Agar blog exist nahi karta
    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found"
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== DELETE BLOG ===================== */
export const deleteBlogById = async (req, res) => {
  try {
    // ⬅️ Blog id admin panel se aa rahi hai
    const { id } = req.body;

    // ⬅️ Blog delete kar rahe hain
    await Blog.findByIdAndDelete(id);

    // ⬅️ Us blog ke saare comments bhi delete karna important hai
    // Taki orphan comments na bache
    await Comment.deleteMany({ blog: id });

    res.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== TOGGLE PUBLISH ===================== */
export const togglePublish = async (req, res) => {
  try {
    // ⬅️ Blog id jiski publish state change karni hai
    const { id } = req.body;

    const blog = await Blog.findById(id);

    // ⬅️ True ↔ False toggle logic
    // Published blog unpublish ho jaayega aur vice-versa
    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      success: true,
      message: "Blog status updated"
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== ADD COMMENT ===================== */
export const addComment = async (req, res) => {
  try {
    // ⬅️ User se comment data aa raha hai
    const { blog, name, content } = req.body;

    // ⬅️ Comment directly publish nahi hota
    // Admin approval ke baad visible hoga
    await Comment.create({
      blog,
      name,
      content
    });

    res.json({
      success: true,
      message: "Comment added for review"
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== GET BLOG COMMENTS ===================== */
export const getBlogComments = async (req, res) => {
  try {
    // ⬅️ Blog ID frontend se aa rahi hai
    const { blogId } = req.body;

    // ⬅️ Sirf approved comments hi show honge
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

/* ===================== AI CONTENT GENERATION ===================== */
export const generateContent = async (req, res) => {
  try {
    // ⬅️ Prompt frontend se aa raha hai
    const { prompt } = req.body;

    // ⬅️ Prompt empty hua to AI call karna bekaar hai
    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required"
      });
    }

    // ⬅️ Gemini AI ko structured prompt bhej rahe hain
    const content = await generateAIContent(
      `Write a detailed blog post about: ${prompt}`
    );

    res.json({
      success: true,
      content
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
