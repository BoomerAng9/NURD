import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { storage } from './storage';
import fs from 'fs';
import { z, ZodError } from 'zod';

// Create router
export const imageLockerRouter = express.Router();

// Configure multer storage for image uploads
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads/images');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage: storage2,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters").optional(),
  description: z.string().optional(),
});

const createTagSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
});

const imagePageMappingSchema = z.object({
  usage_type: z.string().optional(),
  position: z.number().nonnegative().default(0)
});

// Category routes
imageLockerRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await storage.getImageCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.get('/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await storage.getImageCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    return res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const categoryData = createCategorySchema.parse(req.body);
    const newCategory = await storage.createImageCategory(categoryData);
    return res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.format()
      });
    }
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const categoryData = updateCategorySchema.parse(req.body);
    const updatedCategory = await storage.updateImageCategory(id, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    return res.status(200).json(updatedCategory);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.format()
      });
    }
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await storage.deleteImageCategory(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Category not found or could not be deleted' });
    }
    
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// App Pages routes
imageLockerRouter.get('/pages', async (req: Request, res: Response) => {
  try {
    const pages = await storage.getAppPages();
    return res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.get('/pages/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const page = await storage.getAppPageById(id);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    return res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Image routes
imageLockerRouter.get('/images', async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const active = req.query.active === 'true' ? true : undefined;
    
    const images = await storage.getImages(categoryId, { limit, offset, active });
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.get('/images/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const image = await storage.getImageById(id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    return res.status(200).json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.post('/images', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title, description, altText, categoryId } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Generate public URL for the file
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/images/${req.file.filename}`;
    
    const imageData = {
      path: fileUrl,
      filename: req.file.filename,
      original_filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      width: null, // We could extract this with an image processing lib if needed
      height: null, // We could extract this with an image processing lib if needed
      alt_text: altText || null,
      title: title,
      category_id: categoryId ? parseInt(categoryId) : null,
      uploaded_by: null, // We could set this from the session if needed
      is_active: true,
    };

    const newImage = await storage.createImage(imageData);
    return res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.put('/images/:id/toggle-active', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const image = await storage.toggleImageActive(id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    return res.status(200).json(image);
  } catch (error) {
    console.error('Error toggling image active state:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.delete('/images/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Get the image first to find file path
    const image = await storage.getImageById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from database
    const result = await storage.deleteImage(id);
    if (!result) {
      return res.status(500).json({ message: 'Failed to delete image from database' });
    }
    
    // Try to delete the actual file (if it exists and is in our uploads directory)
    try {
      // Use the path from the database instead of file_path
      const filePath = path.join(uploadDir, path.basename(image.path));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      // Log error but don't fail the request if file deletion fails
      console.error('Error deleting image file:', fileError);
    }
    
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Image Page Mapping routes
imageLockerRouter.get('/images/:imageId/pages', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const pages = await storage.getPagesForImage(imageId);
    return res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages for image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.get('/pages/:pageId/images', async (req: Request, res: Response) => {
  try {
    const pageId = parseInt(req.params.pageId);
    const usageType = req.query.usageType as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    
    const images = await storage.getImagesForPage(pageId, { usageType, limit, offset });
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images for page:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.post('/images/:imageId/pages/:pageId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const pageId = parseInt(req.params.pageId);
    
    const mappingData = imagePageMappingSchema.parse(req.body);
    
    const mapping = await storage.createImagePageMapping({
      image_id: imageId,
      page_id: pageId,
      usage_type: mappingData.usage_type || 'general',
      position: mappingData.position
    });
    
    // Increment usage count
    await storage.incrementImageUsageCount(imageId);
    
    return res.status(201).json(mapping);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.format()
      });
    }
    console.error('Error creating image-page mapping:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.delete('/images/:imageId/pages/:pageId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const pageId = parseInt(req.params.pageId);
    
    const result = await storage.deleteImagePageMapping(imageId, pageId);
    
    if (!result) {
      return res.status(404).json({ message: 'Mapping not found or could not be deleted' });
    }
    
    return res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting image-page mapping:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Tag routes
imageLockerRouter.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await storage.getImageTags();
    return res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.post('/tags', async (req: Request, res: Response) => {
  try {
    const tagData = createTagSchema.parse(req.body);
    const newTag = await storage.createImageTag(tagData);
    return res.status(201).json(newTag);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.format()
      });
    }
    console.error('Error creating tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.get('/images/:imageId/tags', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const tags = await storage.getTagsForImage(imageId);
    return res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags for image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.post('/images/:imageId/tags/:tagId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const tagId = parseInt(req.params.tagId);
    
    await storage.tagImage(imageId, tagId);
    return res.status(200).json({ message: 'Tag added to image successfully' });
  } catch (error) {
    console.error('Error tagging image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

imageLockerRouter.delete('/images/:imageId/tags/:tagId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId);
    const tagId = parseInt(req.params.tagId);
    
    await storage.untagImage(imageId, tagId);
    return res.status(200).json({ message: 'Tag removed from image successfully' });
  } catch (error) {
    console.error('Error removing tag from image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get images by tag
imageLockerRouter.get('/tags/:tagId/images', async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.tagId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    
    const images = await storage.getImagesByTag(tagId, { limit, offset });
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images by tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});