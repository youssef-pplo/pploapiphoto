import request from 'supertest';
import path from 'path';
import { access } from 'fs/promises';
import app from '../app';
import sharpModule, { Sharp } from 'sharp';
import * as imageProcessor from '../utils/imageProcessor';

jest.mock('sharp');

const mockSharp = sharpModule as unknown as jest.MockedFunction<typeof sharpModule>;

describe('Image API Endpoint Tests', () => {
  it('should return 200 and process the image', async () => {
    const response = await request(app).get('/api/images?filename=test&width=100&height=100');
    expect(response.status).toBe(200);
  });

  it('should return 400 for missing parameters', async () => {
    const response = await request(app).get('/api/images?filename=test');
    expect(response.status).toBe(400);
  });

  it('should return 404 for non-existent file', async () => {
    const response = await request(app).get('/api/images?filename=nonexistent&width=100&height=100');
    expect(response.status).toBe(404);
  });

  it('should check if processed image exists in cache', async () => {
    const testImagePath = path.resolve('public/images/test_image.jpg');
    await access(testImagePath);
    expect(access).toHaveBeenCalled();
  });
});

describe('Image Processing Functionality', () => {
  const resizeImage = imageProcessor.resizeImage;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call sharp and resize image successfully', async () => {
    mockSharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(undefined),
      // Fill all required methods from Sharp to match the type
      removeAlpha: jest.fn(),
      ensureAlpha: jest.fn(),
      extractChannel: jest.fn(),
      joinChannel: jest.fn(),
      // etc... (you can add more if TS complains again)
    } as unknown as Sharp));

    await resizeImage('image.jpg', 100, 100).then(result => {
  expect(result).toBeUndefined();
});

  });

  it('should throw error if resize fails', async () => {
    mockSharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockRejectedValue(new Error('Failed')),
      removeAlpha: jest.fn(),
      ensureAlpha: jest.fn(),
      extractChannel: jest.fn(),
      joinChannel: jest.fn(),
    } as unknown as Sharp));

    await resizeImage('fail.jpg', 100, 100)
  .then(() => fail('Expected function to throw an error'))
  .catch(err => {
    expect(err.message).toBe('Failed');
  });

  });
});
