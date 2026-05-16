import { type APIRequestContext } from '@playwright/test';
import { type AuthCredentials, type AuthToken } from '../types/auth';
import { type BookingApiPayload, type Booking, type BookingListResponse } from '../types/booking';
import { type Room, type RoomInput } from '../types/room';

export class ApiClient {
  private readonly request: APIRequestContext;
  private token: string | null = null;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async authenticate(credentials?: AuthCredentials): Promise<string> {
    const body: AuthCredentials = credentials ?? {
      username: process.env.ADMIN_USERNAME ?? 'admin',
      password: process.env.ADMIN_PASSWORD ?? 'password',
    };

    const response = await this.request.post('auth/login', { data: body });

    if (!response.ok()) {
      throw new Error(`Authentication failed: ${response.status()} ${response.statusText()}`);
    }

    const data = (await response.json()) as AuthToken;
    this.token = data.token;
    return this.token;
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }
    return { Cookie: `token=${this.token}` };
  }

  async getBookings(roomId: number): Promise<Booking[]> {
    const response = await this.request.get(`booking?roomid=${roomId}`, {
      headers: this.authHeaders(),
    });
    const data = (await response.json()) as BookingListResponse;
    return data.bookings ?? [];
  }

  async createBooking(payload: BookingApiPayload): Promise<Booking> {
    const response = await this.request.post('booking', {
      data: payload,
      headers: this.authHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`Create booking failed: ${response.status()}`);
    }

    return response.json() as Promise<Booking>;
  }

  async getBookingById(bookingId: number): Promise<Booking> {
    const response = await this.request.get(`booking/${bookingId}`, {
      headers: this.authHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`Get booking failed: ${response.status()}`);
    }

    return response.json() as Promise<Booking>;
  }

  async deleteBooking(bookingId: number): Promise<void> {
    const response = await this.request.delete(`booking/${bookingId}`, {
      headers: this.authHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`Delete booking failed: ${response.status()}`);
    }
  }

  async getRooms(): Promise<Room[]> {
    const response = await this.request.get('room');
    const data = await response.json() as { rooms: Room[] };
    return data.rooms;
  }

  async createRoom(payload: RoomInput): Promise<void> {
    const response = await this.request.post('room', {
      data: payload,
      headers: this.authHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`Create room failed: ${response.status()}`);
    }
  }

  async deleteRoom(roomId: number): Promise<void> {
    const response = await this.request.delete(`room/${roomId}`, {
      headers: this.authHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`Delete room failed: ${response.status()}`);
    }
  }
}
