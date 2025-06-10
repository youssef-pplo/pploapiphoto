"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const app_1 = __importDefault(require("../app"));
const sharp_1 = __importDefault(require("sharp"));
const imageProcessor = __importStar(require("../utils/imageProcessor"));
jest.mock('sharp');
const mockSharp = sharp_1.default;
describe('Image API Endpoint Tests', () => {
    it('should return 200 and process the image', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=test&width=100&height=100');
        expect(response.status).toBe(200);
    }));
    it('should return 400 for missing parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=test');
        expect(response.status).toBe(400);
    }));
    it('should return 404 for non-existent file', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=nonexistent&width=100&height=100');
        expect(response.status).toBe(404);
    }));
    it('should check if processed image exists in cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const testImagePath = path_1.default.resolve('public/images/test_image.jpg');
        yield (0, promises_1.access)(testImagePath);
        expect(promises_1.access).toHaveBeenCalled();
    }));
});
describe('Image Processing Functionality', () => {
    const resizeImage = imageProcessor.resizeImage;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should call sharp and resize image successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        mockSharp.mockImplementation(() => ({
            resize: jest.fn().mockReturnThis(),
            toFile: jest.fn().mockResolvedValue(undefined),
            // Fill all required methods from Sharp to match the type
            removeAlpha: jest.fn(),
            ensureAlpha: jest.fn(),
            extractChannel: jest.fn(),
            joinChannel: jest.fn(),
            // etc... (you can add more if TS complains again)
        }));
        yield resizeImage('image.jpg', 100, 100).then(result => {
            expect(result).toBeUndefined();
        });
    }));
    it('should throw error if resize fails', () => __awaiter(void 0, void 0, void 0, function* () {
        mockSharp.mockImplementation(() => ({
            resize: jest.fn().mockReturnThis(),
            toFile: jest.fn().mockRejectedValue(new Error('Failed')),
            removeAlpha: jest.fn(),
            ensureAlpha: jest.fn(),
            extractChannel: jest.fn(),
            joinChannel: jest.fn(),
        }));
        yield resizeImage('fail.jpg', 100, 100)
            .then(() => fail('Expected function to throw an error'))
            .catch(err => {
            expect(err.message).toBe('Failed');
        });
    }));
});
