"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = exports.getImages = exports.handleResizeRequest = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const IMAGES_DIR_ORIGINAL = path_1.default.resolve(__dirname, '../../public/images');
const IMAGES_DIR_THUMB = path_1.default.resolve(__dirname, '../../public/images/thumbnails');
const ensureDirExists = (dirPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.promises.access(dirPath);
    }
    catch (_a) {
        yield fs_1.promises.mkdir(dirPath, { recursive: true });
    }
});
const resizeImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    const originalImagePath = path_1.default.join(IMAGES_DIR_ORIGINAL, filename);
    const thumbPath = path_1.default.join(IMAGES_DIR_THUMB, `${path_1.default.parse(filename).name}-${width}x${height}.jpg`);
    try {
        yield fs_1.promises.access(thumbPath);
        return `/images/thumbnails/${path_1.default.basename(thumbPath)}`;
    }
    catch (_a) {
        try {
            yield ensureDirExists(IMAGES_DIR_THUMB);
            yield (0, sharp_1.default)(originalImagePath).resize(width, height).toFile(thumbPath);
            return `/images/thumbnails/${path_1.default.basename(thumbPath)}`;
        }
        catch ( // ✅ THE FIX IS HERE: The unused 'resizeError' variable is removed.
        _b) { // ✅ THE FIX IS HERE: The unused 'resizeError' variable is removed.
            throw new Error('Image could not be processed. The original file may not exist.');
        }
    }
});
const handleResizeRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        res.status(400).json({ error: 'Missing parameters. Please provide filename, width, and height.' });
        return;
    }
    const widthNum = parseInt(width);
    const heightNum = parseInt(height);
    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
        res.status(400).json({ error: 'Width and height must be positive numbers.' });
        return;
    }
    try {
        const resizedImagePath = yield resizeImage(filename, widthNum, heightNum);
        res.json({ path: resizedImagePath });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.handleResizeRequest = handleResizeRequest;
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ensureDirExists(IMAGES_DIR_ORIGINAL);
        const filesAndFolders = yield fs_1.promises.readdir(IMAGES_DIR_ORIGINAL);
        const imageFiles = [];
        for (const file of filesAndFolders) {
            const stats = yield fs_1.promises.stat(path_1.default.join(IMAGES_DIR_ORIGINAL, file));
            if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
                imageFiles.push(file);
            }
        }
        res.json(imageFiles);
    }
    catch (_a) {
        res.status(500).json({ error: 'Could not read images directory.' });
    }
});
exports.getImages = getImages;
const handleUpload = (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not provided or was filtered.' });
        return;
    }
    res.status(200).json({
        message: 'Image uploaded successfully!',
        filename: req.file.filename
    });
};
exports.handleUpload = handleUpload;
