export type UserRole = 'SUPER_ADMIN' | 'BLOCK_ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  blockId?: string;
}

export interface Block {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
}

export interface Availability {
  days: number[];
  startTime: string;
  endTime: string;
}

export interface Room {
  id: string;
  blockId: string;
  name: string;
  description: string;
  capacity: number;
  image: string;
  features: string[];
  availability: Availability;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
}
