// import express from 'express';
// import imageRoutes from './routes/imageRoutes';
// import path from 'path';

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use('/images', express.static(path.join(__dirname, '../public/images')));

// // Routes
// app.use('/api/images', imageRoutes);



// // Test route
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
  
// });