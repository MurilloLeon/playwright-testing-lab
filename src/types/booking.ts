export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingInput {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
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

export interface Booking {
  bookingid: number;
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  bookingdates: BookingDates;
}

export interface BookingListResponse {
  bookings: Booking[];
}
