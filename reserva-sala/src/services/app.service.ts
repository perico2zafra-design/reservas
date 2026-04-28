import { mockBlocks, mockRooms, mockBookings, mockUsers } from './mockData';
import type { Block, Room, Booking, User } from '@/types';

class AppService {
  // Blocks
  async getBlocks(): Promise<Block[]> {
    return [...mockBlocks];
  }

  async addBlock(block: Omit<Block, 'id'>): Promise<Block> {
    const newBlock = { ...block, id: Math.random().toString(36).substr(2, 9) };
    mockBlocks.push(newBlock);
    return newBlock;
  }

  async updateBlock(id: string, updates: Partial<Block>): Promise<Block> {
    const index = mockBlocks.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Block not found');
    mockBlocks[index] = { ...mockBlocks[index], ...updates };
    return mockBlocks[index];
  }

  async deleteBlock(id: string): Promise<void> {
    const index = mockBlocks.findIndex(b => b.id === id);
    if (index !== -1) mockBlocks.splice(index, 1);
  }

  // Rooms
  async getRooms(blockId: string): Promise<Room[]> {
    return mockRooms.filter(r => r.blockId === blockId);
  }

  async addRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom = { ...room, id: Math.random().toString(36).substr(2, 9) };
    mockRooms.push(newRoom);
    return newRoom;
  }

  // Bookings
  async getBookings(roomId: string): Promise<Booking[]> {
    return mockBookings.filter(b => b.roomId === roomId);
  }

  async createBooking(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'CONFIRMED'
    };
    mockBookings.push(newBooking);
    return newBooking;
  }

  // Auth (Mock)
  async login(email: string): Promise<User> {
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  }
}

export const appService = new AppService();
