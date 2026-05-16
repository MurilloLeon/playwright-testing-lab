import { test, expect } from '@playwright/test';

test.describe('Auth API', () => {
  test('POST auth/login - should return token with valid credentials', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME ?? 'admin',
        password: process.env.ADMIN_PASSWORD ?? 'password',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json() as { token: string };
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST auth/login - should return 401 with invalid credentials', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: 'wrong_user',
        password: 'wrong_password',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('POST auth/login - should return 401 with empty credentials', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: '',
        password: '',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('POST auth/login - should respond in JSON format', async ({ request }) => {
    const response = await request.post('auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME ?? 'admin',
        password: process.env.ADMIN_PASSWORD ?? 'password',
      },
    });

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });
});
