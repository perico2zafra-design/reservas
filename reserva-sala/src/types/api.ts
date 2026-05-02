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
  roomId: number;
  userName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
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
