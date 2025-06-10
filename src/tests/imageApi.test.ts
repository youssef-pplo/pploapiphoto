import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import app from '../app';
import { resizeImage } from '../utils/imageProcessor';

describe('Image API Endpoint Tests', () => {
  it('should return 200 and process the image', async () => {
    const res = await request(app).get('/api/images/resize?filename=test.jpg&width=100&height=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.path).toContain('/images/thumbnails/test-100x100.jpg');
  });

  it('should return 400 for missing parameters', async () => {
    const res = await request(app).get('/api/images/resize?filename=test.jpg');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 for non-existent file', async () => {
    const res = await request(app).get('/api/images/resize?filename=nonexistent.jpg&width=100&height=100');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return a list of images from /api/images', async () => {
    const res = await request(app).get('/api/images');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });
});

describe('Image Processing Functionality', () => {
  it('should resize image successfully', async () => {
    const outputPath = await resizeImage('test.jpg', 120, 120);
    const fullPath = path.resolve('public/images/thumbnails', 'test-120x120.jpg');
    try {
      await fs.access(fullPath);
      expect(true).toBeTrue();
    } catch {
      fail('Resized image not created.');
    }
  });

  it('should throw error if input image does not exist', async () => {
    try {
      await resizeImage('nonexistent.jpg', 100, 100);
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
