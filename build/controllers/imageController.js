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
exports.getImages = exports.handleResizeRequest = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
// LOGIC TO RESIZE AN IMAGE WITH CACHING
const resizeImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    const originalImagePath = path_1.default.resolve(__dirname, `../../public/images/${filename}`);
    const thumbDirectory = path_1.default.resolve(__dirname, '../../public/images/thumbnails');
    const baseFilename = path_1.default.parse(filename).name;
    const thumbPath = path_1.default.join(thumbDirectory, `${baseFilename}-${width}x${height}.jpg`);
    // --- DEBUG MESSAGES ADDED BELOW ---
    console.log(`[DEBUG] Checking for cached file at: ${thumbPath}`);
    try {
        yield fs_1.promises.access(thumbPath);
        console.log('[DEBUG] CACHE HIT! Found existing file.');
        return `/images/thumbnails/${baseFilename}-${width}x${height}.jpg`;
    }
    catch (_a) {
        console.log('[DEBUG] CACHE MISS. Creating new file...');
        try {
            yield (0, sharp_1.default)(originalImagePath).resize(width, height).toFile(thumbPath);
            return `/images/thumbnails/${baseFilename}-${width}x${height}.jpg`;
        }
        catch (resizeError) {
            console.log('[DEBUG] Error during image resize:', resizeError);
            throw new Error('Image could not be processed or the original file does not exist.');
        }
    }
});
// CONTROLLER TO HANDLE THE /resize REQUEST
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
// CONTROLLER TO GET THE LIST OF AVAILABLE IMAGES
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imagesDirectory = path_1.default.resolve(__dirname, '../../public/images');
    try {
        const files = yield fs_1.promises.readdir(imagesDirectory);
        const imageFiles = files.filter((file) => file.endsWith('.jpg') || file.endsWith('.jpeg'));
        res.json(imageFiles);
    }
    catch (_a) {
        res.status(500).json({ error: 'Could not read images directory.' });
    }
});
exports.getImages = getImages;
