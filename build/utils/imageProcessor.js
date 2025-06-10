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
exports.resizeImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resizeImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    const originalImagePath = path_1.default.resolve(__dirname, `../../public/images/${filename}`);
    const thumbDirectory = path_1.default.resolve(__dirname, '../../public/images/thumbnails');
    const baseFilename = path_1.default.parse(filename).name;
    const thumbPath = path_1.default.join(thumbDirectory, `${baseFilename}-${width}x${height}.jpg`);
    try {
        yield fs_1.default.promises.access(thumbPath);
        return thumbPath;
    }
    catch (_a) {
        try {
            if (!fs_1.default.existsSync(thumbDirectory)) {
                yield fs_1.default.promises.mkdir(thumbDirectory, { recursive: true });
            }
            yield (0, sharp_1.default)(originalImagePath).resize(width, height).toFile(thumbPath);
            return thumbPath;
        }
        catch ( // ✅ THE FIX IS HERE: The unused '_resizeError' variable is removed.
        _b) { // ✅ THE FIX IS HERE: The unused '_resizeError' variable is removed.
            throw new Error('Image could not be processed or the original file does not exist.');
        }
    }
});
exports.resizeImage = resizeImage;
