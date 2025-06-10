import supertest from 'supertest';
import app from '../app';

const request = supertest(app);

describe('Test API Endpoints', () => {
  it('should get the main page at /', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('should get the resize endpoint with valid parameters', async () => {
    const response = await request.get('/api/images/resize?filename=fjord&width=200&height=200');
    expect(response.status).toBe(200);
  });

  // Remember to add more tests for other cases as required by the project rubric
});
