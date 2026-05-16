import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/helpers/api-client';
import { createRoomData } from '../../src/helpers/test-data';
import { type Room } from '../../src/types/room';

test.describe('Room API', () => {
  let apiClient: ApiClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new ApiClient(request);
    await apiClient.authenticate();
  });

  test('GET /room - should return a list of rooms', async ({ request }) => {
    const response = await request.get('/room');

    expect(response.status()).toBe(200);

    const body = await response.json() as { rooms: Room[] };
    expect(body).toHaveProperty('rooms');
    expect(Array.isArray(body.rooms)).toBe(true);
  });

  test('GET /room - rooms should have required fields', async () => {
    const rooms = await apiClient.getRooms();

    expect(rooms.length).toBeGreaterThan(0);

    const room = rooms[0];
    expect(room).toHaveProperty('roomid');
    expect(room).toHaveProperty('roomNumber');
    expect(room).toHaveProperty('type');
    expect(room).toHaveProperty('accessible');
    expect(room).toHaveProperty('price');
  });

  test('POST /room - should create a new room with valid data', async ({ request }) => {
    const roomData = createRoomData({ type: 'Double', price: 200 });

    const response = await request.post('/room', {
      data: roomData,
      headers: { Cookie: `token=${await getToken(request)}` },
    });

    expect(response.status()).toBe(201);

    const created = await response.json() as Room;
    expect(created).toHaveProperty('roomid');
    expect(created.type).toBe(roomData.type);
    expect(created.price).toBe(roomData.price);

    await apiClient.deleteRoom(created.roomid);
  });

  test('POST /room - should require authentication', async ({ request }) => {
    const roomData = createRoomData();

    const response = await request.post('/room', { data: roomData });

    expect(response.status()).toBe(403);
  });

  test('DELETE /room/:id - should delete an existing room', async () => {
    const roomData = createRoomData({ type: 'Twin', price: 120 });
    const created = await apiClient.createRoom(roomData);

    await expect(apiClient.deleteRoom(created.roomid)).resolves.not.toThrow();
  });

  test('DELETE /room/:id - should return 403 without token', async ({ request }) => {
    const rooms = await apiClient.getRooms();
    expect(rooms.length).toBeGreaterThan(0);

    const response = await request.delete(`/room/${rooms[0].roomid}`);

    expect(response.status()).toBe(403);
  });
});

async function getToken(request: import('@playwright/test').APIRequestContext): Promise<string> {
  const response = await request.post('/auth/login', {
    data: {
      username: process.env.ADMIN_USERNAME ?? 'admin',
      password: process.env.ADMIN_PASSWORD ?? 'password',
    },
  });
  const body = await response.json() as { token: string };
  return body.token;
}
