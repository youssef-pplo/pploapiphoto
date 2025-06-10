import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware';
import * as imageController from '../controllers/imageController';

const router = express.Router();

router.get('/', imageController.getImages);
router.get('/resize', imageController.handleResizeRequest);
router.post('/upload', uploadMiddleware.single('image'), imageController.handleUpload);

export default router;
