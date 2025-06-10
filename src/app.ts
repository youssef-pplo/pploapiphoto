import express, { Request, Response } from 'express';
import path from 'path';
import imageRoutes from './routes/imageRoutes';

const app = express();
const port = 3000;

// This correctly mounts all your API routes under /api/images
app.use('/api/images', imageRoutes);

// This serves the static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Serve homepage as a fallback
app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;