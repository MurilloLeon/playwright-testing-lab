import { test, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../src/helpers/api-client';
import { createRoomData } from '../../src/helpers/test-data';
import { type Room } from '../../src/types/room';

test.describe('Room API', () => {
  let apiContext: APIRequestContext;
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://automationintesting.online/api/',
    });
    apiClient = new ApiClient(apiContext);
    await apiClient.authenticate();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET room - should return a list of rooms', async ({ request }) => {
    const response = await request.get('room');

    expect(response.status()).toBe(200);

    const body = await response.json() as { rooms: Room[] };
    expect(body).toHaveProperty('rooms');
    expect(Array.isArray(body.rooms)).toBe(true);
  });

  test('GET room - each room should have the required fields', async () => {
    const rooms = await apiClient.getRooms();

    expect(rooms.length).toBeGreaterThan(0);

    const room = rooms[0];
    expect(room).toHaveProperty('roomid');
    expect(room).toHaveProperty('roomName');
    expect(room).toHaveProperty('type');
    expect(room).toHaveProperty('accessible');
    expect(room).toHaveProperty('roomPrice');
  });

  test('POST room - should create a new room with valid data', async () => {
    const roomData = createRoomData({ type: 'Double', roomPrice: 200 });
    const countBefore = (await apiClient.getRooms()).length;

    await apiClient.createRoom(roomData);

    const rooms = await apiClient.getRooms();
    expect(rooms.length).toBeGreaterThanOrEqual(countBefore + 1);

    const created = rooms.find(r => r.roomName === roomData.roomName);
    expect(created).toBeDefined();
    expect(created!.type).toBe(roomData.type);
    expect(created!.roomPrice).toBe(roomData.roomPrice);

    await apiClient.deleteRoom(created!.roomid);
  });

  test('POST room - should return 401 without authentication', async ({ request }) => {
    const roomData = createRoomData();

    const response = await request.post('room', { data: roomData });

    expect(response.status()).toBe(401);
  });

  test('DELETE room/:id - should delete an existing room', async () => {
    const roomData = createRoomData({ type: 'Twin', roomPrice: 120 });
    await apiClient.createRoom(roomData);

    const rooms = await apiClient.getRooms();
    const created = rooms.find(r => r.roomName === roomData.roomName);
    expect(created).toBeDefined();

    await expect(apiClient.deleteRoom(created!.roomid)).resolves.not.toThrow();
  });

  test('DELETE room/:id - should return 403 without a token', async ({ request }) => {
    const rooms = await apiClient.getRooms();
    expect(rooms.length).toBeGreaterThan(0);

    const response = await request.delete(`room/${rooms[0].roomid}`);

    expect(response.status()).toBe(403);
  });
});
