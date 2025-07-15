import { Request, Response } from "express";
import { client } from "../config/prismaConfig";




async function createBlogs(req: Request, res: Response) {
  try {
    
    const { title, synopsis, content, imageUrl } = req.body;
    
    
    const { id: authorId } = req.user;
    
    const newBlog = await client.blog.create({
      data: {
        title,
        synopsis,
        content,
        featuredImage: imageUrl || "", 
        authorId: authorId
      }
    });
    
    res.status(200).json(newBlog);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function getAllBlogs(req: Request, res: Response) {
  try {
    
    const blogs = await client.blog.findMany({
      where: {
        isDeleted: false 
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function getBlogById(req: Request, res: Response) {
  try {
    
    const { id } = req.params;
    
   
    const blog = await client.blog.findFirst({
      where: {
        id,
        isDeleted: false 
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        }
      }
    });
    
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function updateBlog(req: Request, res: Response) {
  try {
    
    const { id: blogId } = req.params;
    
   
    const { title, synopsis, content, imageUrl } = req.body;
    
    const { id: userId } = req.user;
    
    
    const existingBlog = await client.blog.findFirst({
      where: {
        id: blogId,
        authorId: userId, 
        isDeleted: false
      }
    });
    
    
    if (!existingBlog) {
      return res.status(404).json({ 
        message: "Blog not found or you don't have permission to edit it" 
      });
    }
    
    
    const updatedBlog = await client.blog.update({
      where: { id: blogId },
      data: {
        title: title || undefined,
        synopsis: synopsis || undefined,
        content: content || undefined,
        featuredImage: imageUrl || undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        }
      }
    });
    
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function deleteBlog(req: Request, res: Response) {
  try {
    const { id: blogId } = req.params;
    const { id: userId } = req.user;

    
    const blog = await client.blog.findFirst({
      where: {
        id: blogId,
        authorId: userId,
        isDeleted: false
      }
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found or you don't have permission to delete it" });
    }

    await client.blog.update({
      where: { id: blogId },
      data: { isDeleted: true }
    });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


export { 
  createBlogs, 
 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
};