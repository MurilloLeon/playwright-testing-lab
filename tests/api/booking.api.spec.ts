import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/helpers/api-client';
import { createBookingApiPayload } from '../../src/helpers/test-data';
import { type Booking } from '../../src/types/booking';

test.describe('Booking API', () => {
  let apiClient: ApiClient;
  let createdBookingId: number;

  test.beforeAll(async ({ request }) => {
    apiClient = new ApiClient(request);
    await apiClient.authenticate();
  });

  test('GET /booking - should return a list of bookings', async ({ request }) => {
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);

    const body = await response.json() as { bookings: Array<{ bookingid: number }> };
    expect(body).toHaveProperty('bookings');
    expect(Array.isArray(body.bookings)).toBe(true);
  });

  test('POST /booking - should create a new booking', async ({ request }) => {
    const rooms = await apiClient.getRooms();
    expect(rooms.length).toBeGreaterThan(0);

    const payload = createBookingApiPayload(rooms[0].roomid);
    const response = await request.post('/booking', { data: payload });

    expect(response.status()).toBe(201);

    const booking = await response.json() as Booking;
    expect(booking).toHaveProperty('bookingid');
    expect(booking.firstname).toBe(payload.firstname);
    expect(booking.lastname).toBe(payload.lastname);

    createdBookingId = booking.bookingid;
  });

  test('GET /booking/:id - should return the created booking', async ({ request }) => {
    const rooms = await apiClient.getRooms();
    const payload = createBookingApiPayload(rooms[0].roomid);
    const created = await apiClient.createBooking(payload);

    const response = await request.get(`/booking/${created.bookingid}`);

    expect(response.status()).toBe(200);

    const booking = await response.json() as Booking;
    expect(booking.firstname).toBe(payload.firstname);
    expect(booking.lastname).toBe(payload.lastname);

    await apiClient.deleteBooking(created.bookingid);
  });

  test('DELETE /booking/:id - should delete a booking', async () => {
    const rooms = await apiClient.getRooms();
    const payload = createBookingApiPayload(rooms[0].roomid);
    const created = await apiClient.createBooking(payload);

    await expect(apiClient.deleteBooking(created.bookingid)).resolves.not.toThrow();
  });

  test('POST /booking - should return 409 for overlapping dates on same room', async ({ request }) => {
    const rooms = await apiClient.getRooms();
    const payload = createBookingApiPayload(rooms[0].roomid);

    const first = await apiClient.createBooking(payload);

    const duplicate = await request.post('/booking', { data: payload });
    expect(duplicate.status()).toBe(409);

    await apiClient.deleteBooking(first.bookingid);
  });
});
