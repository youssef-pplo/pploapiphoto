
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  const originalImagePath = path.resolve(
    __dirname,
    `../../public/images/${filename}`
  );
  const thumbDirectory = path.resolve(
    __dirname,
    '../../public/images/thumbnails'
  );
  const baseFilename = path.parse(filename).name;
  const thumbPath = path.join(
    thumbDirectory,
    `${baseFilename}-${width}x${height}.jpg`
  );

  try {
    await fs.promises.access(thumbPath);
    return thumbPath;
  } catch {
    try {
      if (!fs.existsSync(thumbDirectory)) {
        await fs.promises.mkdir(thumbDirectory, { recursive: true });
      }
      await sharp(originalImagePath).resize(width, height).toFile(thumbPath);
      return thumbPath;
    } catch { // ✅ THE FIX IS HERE: The unused '_resizeError' variable is removed.
      throw new Error(
        'Image could not be processed or the original file does not exist.'
      );
    }
  }
};