import request from 'supertest';
import app from '../app';

describe('Test API Endpoints', () => {
  it('should get the resize endpoint with valid parameters', async () => {
    const response = await request(app).get('/api/images/resize?filename=test.jpg&width=100&height=100');
    expect(response.status).toBe(200);
    expect(response.body.path).toBeDefined();

  });
});
