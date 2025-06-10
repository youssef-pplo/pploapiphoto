import express, { Request, Response } from 'express';
import upload from '../middleware/uploadMiddleware'; // Assuming you have this middleware
import * as imageController from '../controllers/imageController';

const router = express.Router();

// GET /api/images/ - Lists available images
router.get('/', imageController.getImages);

// GET /api/images/resize - Resizes an image
router.get('/resize', imageController.handleResizeRequest);

// POST /api/images/upload - Uploads a new image
router.post('/upload', upload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) {
    // Send the error response
    res.status(400).json({ error: 'No file uploaded or file type not allowed.' });
    // Exit the function with a void return
    return;
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

export default router;