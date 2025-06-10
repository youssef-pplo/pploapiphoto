
import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware';
import * as imageController from '../controllers/imageController';

const router = express.Router();

// This route is correct
router.get('/', imageController.getImages);

// This route is correct
router.get('/resize', imageController.handleResizeRequest);

// POST /api/images/upload - Uploads a new image
// ✅ THIS IS THE CORRECTED LINE
// We now use uploadMiddleware.single('image') and imageController.handleUpload
router.post('/upload', uploadMiddleware.single('image'), imageController.handleUpload);

export default router;