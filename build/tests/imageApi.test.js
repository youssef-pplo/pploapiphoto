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
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const app_1 = __importDefault(require("../app"));
const imageProcessor_1 = require("../utils/imageProcessor");
describe('Image API Endpoint Tests', () => {
    it('should return 200 and process the image', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images/resize?filename=test.jpg&width=100&height=100');
        expect(res.statusCode).toBe(200);
        expect(res.body.path).toContain('/images/thumbnails/test-100x100.jpg');
    }));
    it('should return 400 for missing parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images/resize?filename=test.jpg');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    }));
    it('should return 400 for non-existent file', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images/resize?filename=nonexistent.jpg&width=100&height=100');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    }));
    it('should return a list of images from /api/images', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTrue();
    }));
});
describe('Image Processing Functionality', () => {
    it('should resize image successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const outputPath = yield (0, imageProcessor_1.resizeImage)('test.jpg', 120, 120);
        const fullPath = path_1.default.resolve('public/images/thumbnails', 'test-120x120.jpg');
        try {
            yield promises_1.default.access(fullPath);
            expect(true).toBeTrue();
        }
        catch (_a) {
            fail('Resized image not created.');
        }
    }));
    it('should throw error if input image does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, imageProcessor_1.resizeImage)('nonexistent.jpg', 100, 100);
            fail('Expected error to be thrown');
        }
        catch (err) {
            expect(err).toBeDefined();
        }
    }));
});
