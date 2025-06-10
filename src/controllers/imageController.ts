
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR_ORIGINAL = path.resolve(__dirname, '../../public/images');
const IMAGES_DIR_THUMB = path.resolve(__dirname, '../../public/images/thumbnails');

const ensureDirExists = async (dirPath: string): Promise<void> => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

const resizeImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  const originalImagePath = path.join(IMAGES_DIR_ORIGINAL, filename);
  const thumbPath = path.join(IMAGES_DIR_THUMB, `${path.parse(filename).name}-${width}x${height}.jpg`);

  try {
    await fs.access(thumbPath);
    return `/images/thumbnails/${path.basename(thumbPath)}`;
  } catch {
    try {
      await ensureDirExists(IMAGES_DIR_THUMB);
      await sharp(originalImagePath).resize(width, height).toFile(thumbPath);
      return `/images/thumbnails/${path.basename(thumbPath)}`;
    } catch { // ✅ THE FIX IS HERE: The unused 'resizeError' variable is removed.
      throw new Error('Image could not be processed. The original file may not exist.');
    }
  }
};

export const handleResizeRequest = async (req: Request, res: Response): Promise<void> => {
  const { filename, width, height } = req.query;

  if (!filename || !width || !height) {
    res.status(400).json({ error: 'Missing parameters. Please provide filename, width, and height.' });
    return;
  }
  const widthNum = parseInt(width as string);
  const heightNum = parseInt(height as string);

  if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
    res.status(400).json({ error: 'Width and height must be positive numbers.'});
    return;
  }

  try {
    const resizedImagePath = await resizeImage(filename as string, widthNum, heightNum);
    res.json({ path: resizedImagePath });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDirExists(IMAGES_DIR_ORIGINAL);
    const filesAndFolders = await fs.readdir(IMAGES_DIR_ORIGINAL);
    
    const imageFiles = [];
    for (const file of filesAndFolders) {
        const stats = await fs.stat(path.join(IMAGES_DIR_ORIGINAL, file));
        if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
            imageFiles.push(file);
        }
    }
    
    res.json(imageFiles);
  } catch {
    res.status(500).json({ error: 'Could not read images directory.' });
  }
};

export const handleUpload = (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ error: 'File not provided or was filtered.' });
        return;
    }
    res.status(200).json({
        message: 'Image uploaded successfully!',
        filename: req.file.filename
    });
};