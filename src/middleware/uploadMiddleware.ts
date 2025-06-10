import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// This function will be used to filter files, accepting only jpeg
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

// Configure how files are stored
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Save files to the main images folder
    cb(null, path.resolve(__dirname, '../../public/images'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Create a unique filename to prevent overwriting existing files
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

export default upload;