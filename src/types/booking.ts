export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingInput {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  roomId?: number;
  checkin?: string;
  checkout?: string;
}

export interface Booking extends BookingInput {
  bookingid: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
}

export interface BookingApiPayload {
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  email: string;
  phone: string;
  bookingdates: BookingDates;
}
