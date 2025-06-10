import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

describe('Test API Endpoints', () => {
  it('GET /: should return the main page', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
  });

  it('GET /api/images: should return a JSON array of image names', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    // Expecting an array in the body
    expect(Array.isArray(response.body)).toBeTrue();
  });

  it('GET /api/images/resize: should resize an image successfully', async () => {
    const response = await request.get('/api/images/resize?filename=fjord&width=150&height=150');
    expect(response.status).toBe(200);
    expect(response.type).toBe('image/jpeg');
  });

  it('GET /api/images/resize: should return 400 for missing parameters', async () => {
    const response = await request.get('/api/images/resize?filename=fjord');
    expect(response.status).toBe(400);
  });
});