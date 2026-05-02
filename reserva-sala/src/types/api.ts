export interface Room {
  id: number;
  name: string;
  capacity: number;
  description?: string;
  image?: string;
  openTime: string;
  closeTime: string;
  workDays: string; // Comma separated days e.g. "1,2,3,4,5"
  createdAt: string;
}

export interface Booking {
  id: number;
  room_id: number;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  deposit_amount: number;
  deposit_status: string;
  stripe_payment_intent_id?: string;
  access_code?: string;
  created_at: string;
  room?: Room;
}

export interface CreateBookingDTO {
  roomId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  paymentIntentId: string;
}

export interface CreateRoomDTO {
  name: string;
  capacity: number;
  description?: string;
  image?: string;
  openTime: string;
  closeTime: string;
  workDays: number[] | string;
}
