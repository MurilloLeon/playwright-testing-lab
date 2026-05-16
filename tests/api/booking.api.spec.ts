import { test, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../src/helpers/api-client';
import { createBookingApiPayload } from '../../src/helpers/test-data';
import { type Booking } from '../../src/types/booking';

test.describe('Booking API', () => {
  let apiContext: APIRequestContext;
  let apiClient: ApiClient;
  let roomId: number;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://automationintesting.online/api/',
    });
    apiClient = new ApiClient(apiContext);
    await apiClient.authenticate();
    const rooms = await apiClient.getRooms();
    expect(rooms.length).toBeGreaterThan(0);
    roomId = rooms[0].roomid;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET booking?roomid - should return a list of bookings for a room', async () => {
    const bookings = await apiClient.getBookings(roomId);

    expect(Array.isArray(bookings)).toBe(true);
  });

  test('POST booking - should create a new booking', async () => {
    const payload = createBookingApiPayload(roomId);
    const created = await apiClient.createBooking(payload);

    expect(created).toHaveProperty('bookingid');
    expect(created.firstname).toBe(payload.firstname);
    expect(created.lastname).toBe(payload.lastname);

    await apiClient.deleteBooking(created.bookingid);
  });

  test('GET booking/:id - should return the created booking', async () => {
    const payload = createBookingApiPayload(roomId);
    const created = await apiClient.createBooking(payload);

    const booking = await apiClient.getBookingById(created.bookingid);

    expect(booking.bookingid).toBe(created.bookingid);
    expect(booking.firstname).toBe(payload.firstname);
    expect(booking.lastname).toBe(payload.lastname);

    await apiClient.deleteBooking(created.bookingid);
  });

  test('DELETE booking/:id - should delete a booking successfully', async () => {
    const payload = createBookingApiPayload(roomId);
    const created = await apiClient.createBooking(payload);

    await expect(apiClient.deleteBooking(created.bookingid)).resolves.not.toThrow();
  });

  test('POST booking - should return 409 for overlapping dates on same room', async () => {
    const payload = createBookingApiPayload(roomId);
    const first = await apiClient.createBooking(payload);

    const duplicateContext = await playwrightRequest.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://automationintesting.online/api/',
    });
    const duplicate = await duplicateContext.post('booking', {
      data: payload,
      headers: { Cookie: `token=${await apiClient.authenticate()}` },
    });
    await duplicateContext.dispose();

    expect(duplicate.status()).toBe(409);
    await apiClient.deleteBooking(first.bookingid);
  });
});

// Helper to verify raw HTTP status directly
test.describe('Booking API - status assertions', () => {
  test('POST booking - should return 201 on success', async ({ request }) => {
    const roomsCtx = await playwrightRequest.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://automationintesting.online/api/',
    });
    const client = new ApiClient(roomsCtx);
    await client.authenticate();
    const rooms = await client.getRooms();
    const payload = createBookingApiPayload(rooms[0].roomid);

    const tokenResp = await roomsCtx.post('auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME ?? 'admin',
        password: process.env.ADMIN_PASSWORD ?? 'password',
      },
    });
    const { token } = await tokenResp.json() as { token: string };

    const response = await request.post('booking', {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(201);
    const booking = await response.json() as Booking;
    await client.deleteBooking(booking.bookingid);
    await roomsCtx.dispose();
  });
});
