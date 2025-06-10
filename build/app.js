"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// This correctly mounts all your API routes under /api/images
app.use('/api/images', imageRoutes_1.default);
// This serves the static frontend files (HTML, CSS, JS)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Serve homepage as a fallback
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
exports.default = app;
