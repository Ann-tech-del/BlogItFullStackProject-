import { Router } from "express";
import { createBlogs, uploadImage, getAllBlogs, getBlogById, updateBlog } from "../controller/blogs.controller";
import verifyUser from "../middleware/verifyUser";

const blogRouter = Router()
blogRouter.get("/blogs", getAllBlogs)
blogRouter.get("/blogs/:id", getBlogById)
blogRouter.post("/blogs", verifyUser, createBlogs)
blogRouter.put("/blogs/:id", verifyUser, updateBlog)
blogRouter.post("/upload", uploadImage)
 
export default blogRouter;