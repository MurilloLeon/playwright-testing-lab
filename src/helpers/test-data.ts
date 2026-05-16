import { type BookingInput, type BookingApiPayload } from '../types/booking';
import { type RoomInput } from '../types/room';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function futureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export function createBookingDetails(overrides: Partial<BookingInput> = {}): BookingInput {
  return {
    firstname: 'John',
    lastname: 'Playwright',
    email: `test.${randomInt(1000, 9999)}@example.com`,
    phone: `07700${randomInt(100000, 999999)}`,
    ...overrides,
  };
}

export function createBookingApiPayload(
  roomId: number,
  overrides: Partial<BookingApiPayload> = {}
): BookingApiPayload {
  const offsetDays = randomInt(30, 180);
  return {
    roomid: roomId,
    firstname: 'John',
    lastname: 'Playwright',
    depositpaid: false,
    email: `test.${randomInt(1000, 9999)}@example.com`,
    phone: `07700${randomInt(100000, 999999)}`,
    bookingdates: {
      checkin: futureDate(offsetDays),
      checkout: futureDate(offsetDays + 3),
    },
    ...overrides,
  };
}

export function createRoomData(overrides: Partial<RoomInput> = {}): RoomInput {
  return {
    roomName: String(randomInt(100, 999)),
    type: 'Single',
    accessible: false,
    roomPrice: randomInt(100, 500),
    features: [],
    description: 'Automated test room',
    image: '',
    ...overrides,
  };
}
