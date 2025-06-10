import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

// LOGIC TO RESIZE AN IMAGE WITH CACHING
const resizeImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  const originalImagePath = path.resolve(
    __dirname,
    `../../public/images/${filename}`
  );
  const thumbDirectory = path.resolve(__dirname, '../../public/images/thumbnails');
  const baseFilename = path.parse(filename).name;
  const thumbPath = path.join(thumbDirectory, `${baseFilename}-${width}x${height}.jpg`);

  // --- DEBUG MESSAGES ADDED BELOW ---

  console.log(`[DEBUG] Checking for cached file at: ${thumbPath}`);

  try {
    await fs.access(thumbPath);
    console.log('[DEBUG] CACHE HIT! Found existing file.');
    return `/images/thumbnails/${baseFilename}-${width}x${height}.jpg`;
  } catch {
    console.log('[DEBUG] CACHE MISS. Creating new file...');
    try {
      await sharp(originalImagePath).resize(width, height).toFile(thumbPath);
      return `/images/thumbnails/${baseFilename}-${width}x${height}.jpg`;
    } catch (resizeError) {
      console.log('[DEBUG] Error during image resize:', resizeError);
      throw new Error('Image could not be processed or the original file does not exist.');
    }
  }
};

// CONTROLLER TO HANDLE THE /resize REQUEST
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

// CONTROLLER TO GET THE LIST OF AVAILABLE IMAGES
export const getImages = async (req: Request, res: Response): Promise<void> => {
  const imagesDirectory = path.resolve(__dirname, '../../public/images');
  try {
    const files = await fs.readdir(imagesDirectory);
    const imageFiles = files.filter(
      (file) => file.endsWith('.jpg') || file.endsWith('.jpeg')
    );
    res.json(imageFiles);
  } catch {
    res.status(500).json({ error: 'Could not read images directory.' });
  }
};