import type { Block, Room, Booking, User } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Super Admin', email: 'admin@example.com', role: 'SUPER_ADMIN' },
  { id: '2', name: 'Block Manager', email: 'manager@example.com', role: 'BLOCK_ADMIN', blockId: 'b1' },
  { id: '3', name: 'John Doe', email: 'john@example.com', role: 'USER' },
];

export const mockBlocks: Block[] = [
  { id: 'b1', name: 'Main Campus', description: 'Headquarters and central operations.', location: 'Madrid, ES', image: 'https://picsum.photos/400/300?random=101' },
  { id: 'b2', name: 'Innovation Lab', description: 'Tech research and development center.', location: 'Barcelona, ES', image: 'https://picsum.photos/400/300?random=102' },
];

export const mockRooms: Room[] = [
  { id: 'r1', blockId: 'b1', name: 'Boardroom A', description: 'Executive meeting room.', capacity: 15, features: ['TV', 'AC', 'Coffee'], image: 'https://picsum.photos/400/300?random=201', availability: { days: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '18:00' } },
  { id: 'r2', blockId: 'b1', name: 'Co-working Space', description: 'Shared desk area.', capacity: 30, features: ['WiFi', 'Kitchen'], image: 'https://picsum.photos/400/300?random=202', availability: { days: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '20:00' } },
  { id: 'r3', blockId: 'b2', name: 'Zen Room', description: 'Quiet space for focus.', capacity: 4, features: ['Acoustic', 'Yoga mats'], image: 'https://picsum.photos/400/300?random=203', availability: { days: [1, 2, 3, 4, 5, 6], startTime: '07:00', endTime: '22:00' } },
];

export const mockBookings: Booking[] = [
  { id: 'bk1', roomId: 'r1', userId: '3', userName: 'John Doe', date: '2026-04-24', startTime: '10:00', endTime: '11:00', status: 'CONFIRMED' },
];
