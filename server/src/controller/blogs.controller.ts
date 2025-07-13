import { Request, Response } from "express";
import { client } from "../config/prismaConfig";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
const configureFileStorage = () => {
  return multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
      
      const uploadsFolderPath = path.join(__dirname, '../../uploads');
      
      
      if (!fs.existsSync(uploadsFolderPath)) {
        fs.mkdirSync(uploadsFolderPath, { recursive: true });
      }
      
      
      callback(null, uploadsFolderPath);
    },
    
    
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      
      const timestamp = Date.now();
      const randomNumber = Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${file.fieldname}-${timestamp}-${randomNumber}${fileExtension}`;
      
      callback(null, uniqueFilename);
    }
  });
};


const multerUpload = multer({
  storage: configureFileStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Only image files are allowed!'));
    }
  }
}).single('image'); 

async function uploadImage(req: Request, res: Response) {
  multerUpload(req, res, async (uploadError: any) => {
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(400).json({ 
        message: uploadError.message || 'Upload failed' 
      });
    }

    
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded' 
      });
    }

    try {
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      console.log('File uploaded successfully:', req.file.filename);
      
      
      res.status(200).json({ 
        message: "Uploaded successfully",
        url: fileUrl,
        imageUrl: fileUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('File processing error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
}


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


export { 
  createBlogs, 
  uploadImage, 
  getAllBlogs, 
  getBlogById, 
  updateBlog 
};