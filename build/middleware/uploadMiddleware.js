"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// This function will be used to filter files, accepting only jpeg
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true); // Accept the file
    }
    else {
        cb(null, false); // Reject the file
    }
};
// Configure how files are stored
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Save files to the main images folder
        cb(null, path_1.default.resolve(__dirname, '../../public/images'));
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwriting existing files
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage, fileFilter: imageFileFilter });
exports.default = upload;
