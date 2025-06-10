import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  const inputPath = path.resolve('public/full', `${filename}.jpg`);
  const outputDir = path.resolve('public/thumb');
  const outputPath = path.resolve(outputDir, `${filename}_${width}x${height}.jpg`);

  // Make sure output folder exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // If already exists, return the path (for caching)
  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
};
