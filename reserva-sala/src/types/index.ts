export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type DepositStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'CAPTURED';

export interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  portal?: string;
  floor?: string;
  letter?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  blocked_until?: string;
  created_at?: string;
}

export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  image: string;
  is_active: boolean;
  deposit_amount: number;
  max_bookings_per_month?: number;
  booking_horizon_months?: number;
}

export interface Booking {
  id: number;
  room_id: number;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  deposit_status: DepositStatus;
  deposit_amount: number;
  stripe_payment_intent_id?: string;
  created_at: string;
  // Relaciones pobladas
  room?: Room;
  user?: Partial<User>;
}

export interface SiteSettings {
  id: number;
  name: string;
  address: string;
  urbanization_details: string;
  updated_at: string;
}

