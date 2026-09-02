import { healthResponseSchema } from '@vehicle-cost/contracts';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('GET /api/health', () => {
  it('sunucunun sağlıklı olduğunu bildirir', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(healthResponseSchema.safeParse(response.body).success).toBe(true);
    expect(response.body.status).toBe('ok');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });
});

describe('GET /', () => {
  it('API kök adresinde servis ve istemci bilgisini gösterir', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toMatchObject({
      name: 'YataOil API',
      status: 'ok',
      health: '/api/health',
      endpoints: {
        brands: 'GET /api/brands',
      },
    });
    expect(response.body.message).toContain('http://localhost:3000');
  });

  it('API temel yolunda da servis bilgisini gösterir', async () => {
    const response = await request(app).get('/api').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.health).toBe('/api/health');
  });
});
