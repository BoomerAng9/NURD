import { Router } from 'express';
import { storage } from './storage';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Set up multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using original name, timestamp, and random string
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname);
    cb(null, `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Setup router
const router = Router();

// Middleware to check if user has admin rights
const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }
  next();
};

// Image Categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await storage.getImageCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching image categories:', error);
    res.status(500).json({ error: 'Failed to fetch image categories' });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await storage.getImageCategoryById(parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching image category:', error);
    res.status(500).json({ error: 'Failed to fetch image category' });
  }
});

router.post('/categories', checkAdmin, async (req, res) => {
  try {
    const newCategory = await storage.createImageCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating image category:', error);
    res.status(500).json({ error: 'Failed to create image category' });
  }
});

router.put('/categories/:id', checkAdmin, async (req, res) => {
  try {
    const updatedCategory = await storage.updateImageCategory(parseInt(req.params.id), req.body);
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating image category:', error);
    res.status(500).json({ error: 'Failed to update image category' });
  }
});

router.delete('/categories/:id', checkAdmin, async (req, res) => {
  try {
    const success = await storage.deleteImageCategory(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Category not found or could not be deleted' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting image category:', error);
    res.status(500).json({ error: 'Failed to delete image category' });
  }
});

// App Pages
router.get('/pages', async (req, res) => {
  try {
    const pages = await storage.getAppPages();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching app pages:', error);
    res.status(500).json({ error: 'Failed to fetch app pages' });
  }
});

router.get('/pages/:id', async (req, res) => {
  try {
    const page = await storage.getAppPageById(parseInt(req.params.id));
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching app page:', error);
    res.status(500).json({ error: 'Failed to fetch app page' });
  }
});

router.post('/pages', checkAdmin, async (req, res) => {
  try {
    const newPage = await storage.createAppPage(req.body);
    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating app page:', error);
    res.status(500).json({ error: 'Failed to create app page' });
  }
});

router.put('/pages/:id', checkAdmin, async (req, res) => {
  try {
    const updatedPage = await storage.updateAppPage(parseInt(req.params.id), req.body);
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(updatedPage);
  } catch (error) {
    console.error('Error updating app page:', error);
    res.status(500).json({ error: 'Failed to update app page' });
  }
});

router.delete('/pages/:id', checkAdmin, async (req, res) => {
  try {
    const success = await storage.deleteAppPage(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ error: 'Page not found or could not be deleted' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting app page:', error);
    res.status(500).json({ error: 'Failed to delete app page' });
  }
});

// Images
router.get('/images', async (req, res) => {
  try {
    const { categoryId, limit, offset, active } = req.query;
    const images = await storage.getImages(
      categoryId ? parseInt(categoryId as string) : undefined,
      {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        active: active === 'true' ? true : active === 'false' ? false : undefined
      }
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const image = await storage.getImageById(parseInt(req.params.id));
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

router.post('/images', checkAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get the uploaded file information
    const { filename, path: filePath, size, mimetype } = req.file;
    const { categoryId, title, description, altText } = req.body;

    // Create the image record in the database
    const newImage = await storage.createImage({
      title: title || filename,
      description: description || '',
      file_path: `/uploads/${filename}`,
      file_size: size,
      file_type: mimetype,
      alt_text: altText || '',
      category_id: categoryId ? parseInt(categoryId) : null,
      is_active: true,
      usage_count: 0,
      uploaded_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.put('/images/:id', checkAdmin, async (req, res) => {
  try {
    const updatedImage = await storage.updateImage(parseInt(req.params.id), req.body);
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

router.put('/images/:id/toggle-active', checkAdmin, async (req, res) => {
  try {
    const updatedImage = await storage.toggleImageActive(parseInt(req.params.id));
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(updatedImage);
  } catch (error) {
    console.error('Error toggling image active state:', error);
    res.status(500).json({ error: 'Failed to toggle image active state' });
  }
});

router.delete('/images/:id', checkAdmin, async (req, res) => {
  try {
    const image = await storage.getImageById(parseInt(req.params.id));
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the file from the filesystem
    if (image.file_path) {
      const filePath = path.join(process.cwd(), image.file_path.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete the image record from the database
    const success = await storage.deleteImage(image.id);
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete image record' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Image-Page Mappings
router.get('/pages/:pageId/images', async (req, res) => {
  try {
    const { usageType, limit, offset } = req.query;
    const images = await storage.getImagesForPage(
      parseInt(req.params.pageId),
      {
        usageType: usageType as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      }
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching images for page:', error);
    res.status(500).json({ error: 'Failed to fetch images for page' });
  }
});

router.get('/images/:imageId/pages', async (req, res) => {
  try {
    const pages = await storage.getPagesForImage(parseInt(req.params.imageId));
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages for image:', error);
    res.status(500).json({ error: 'Failed to fetch pages for image' });
  }
});

router.post('/images/:imageId/pages/:pageId', checkAdmin, async (req, res) => {
  try {
    const { usage_type, position, notes } = req.body;
    const mapping = await storage.createImagePageMapping({
      image_id: parseInt(req.params.imageId),
      page_id: parseInt(req.params.pageId),
      usage_type: usage_type || 'general',
      position: position || 0,
      notes: notes || '',
      created_at: new Date(),
      updated_at: new Date()
    });
    res.status(201).json(mapping);
  } catch (error) {
    console.error('Error creating image-page mapping:', error);
    res.status(500).json({ error: 'Failed to create image-page mapping' });
  }
});

router.put('/images/:imageId/pages/:pageId', checkAdmin, async (req, res) => {
  try {
    const updatedMapping = await storage.updateImagePageMapping(
      parseInt(req.params.imageId),
      parseInt(req.params.pageId),
      req.body
    );
    if (!updatedMapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    res.json(updatedMapping);
  } catch (error) {
    console.error('Error updating image-page mapping:', error);
    res.status(500).json({ error: 'Failed to update image-page mapping' });
  }
});

router.delete('/images/:imageId/pages/:pageId', checkAdmin, async (req, res) => {
  try {
    const success = await storage.deleteImagePageMapping(
      parseInt(req.params.imageId),
      parseInt(req.params.pageId)
    );
    if (!success) {
      return res.status(404).json({ error: 'Mapping not found or could not be deleted' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting image-page mapping:', error);
    res.status(500).json({ error: 'Failed to delete image-page mapping' });
  }
});

// Tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await storage.getImageTags();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching image tags:', error);
    res.status(500).json({ error: 'Failed to fetch image tags' });
  }
});

router.post('/tags', checkAdmin, async (req, res) => {
  try {
    const newTag = await storage.createImageTag(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating image tag:', error);
    res.status(500).json({ error: 'Failed to create image tag' });
  }
});

router.get('/tags/:tagId/images', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const images = await storage.getImagesByTag(
      parseInt(req.params.tagId),
      {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      }
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching images by tag:', error);
    res.status(500).json({ error: 'Failed to fetch images by tag' });
  }
});

router.get('/images/:imageId/tags', async (req, res) => {
  try {
    const tags = await storage.getTagsForImage(parseInt(req.params.imageId));
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags for image:', error);
    res.status(500).json({ error: 'Failed to fetch tags for image' });
  }
});

router.post('/images/:imageId/tags/:tagId', checkAdmin, async (req, res) => {
  try {
    await storage.tagImage(parseInt(req.params.imageId), parseInt(req.params.tagId));
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tagging image:', error);
    res.status(500).json({ error: 'Failed to tag image' });
  }
});

router.delete('/images/:imageId/tags/:tagId', checkAdmin, async (req, res) => {
  try {
    await storage.untagImage(parseInt(req.params.imageId), parseInt(req.params.tagId));
    res.status(204).end();
  } catch (error) {
    console.error('Error untagging image:', error);
    res.status(500).json({ error: 'Failed to untag image' });
  }
});

export const imageLockerRouter = router;