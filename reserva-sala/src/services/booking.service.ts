import api from './api';
import type { Booking, CreateBookingDTO, Room, CreateRoomDTO } from '../types/api';

export const bookingService = {
  // Block endpoints
  async getBlocks(): Promise<any[]> {
    const response = await api.get('/blocks');
    return response.data;
  },

  async createBlock(blockData: any): Promise<any> {
    const response = await api.post('/blocks', blockData);
    return response.data;
  },

  // Room endpoints
  async getRooms(blockId?: number): Promise<Room[]> {
    const url = blockId ? `/rooms?blockId=${blockId}` : '/rooms';
    const response = await api.get<Room[]>(url);
    return response.data;
  },

  async createRoom(roomData: CreateRoomDTO): Promise<Room> {
    const response = await api.post<Room>('/rooms', roomData);
    return response.data;
  },

  async updateRoom(id: number, roomData: Partial<CreateRoomDTO>): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, roomData);
    return response.data;
  },

  async deleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },

  // Booking endpoints
  async getBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  // Payment & Deposit endpoints
  async createPaymentIntent(data: any): Promise<{ clientSecret: string, depositAmount: number }> {
    const response = await api.post('/bookings/payment-intent', data);
    return response.data;
  },

  async createBooking(bookingData: CreateBookingDTO): Promise<Booking> {
    const response = await api.post<Booking>('/bookings/confirm', bookingData);
    return response.data;
  },

  async manageDeposit(id: number, action: 'REFUND' | 'CAPTURE'): Promise<any> {
    const response = await api.patch(`/bookings/${id}/deposit`, { action });
    return response.data;
  },

  // Schedules & Exceptions
  async getRoomSchedules(roomId: number): Promise<any[]> {
    const response = await api.get(`/rooms/${roomId}/schedules`);
    return response.data;
  },

  async addRoomSchedule(roomId: number, scheduleData: any): Promise<any> {
    const response = await api.post(`/rooms/${roomId}/schedules`, scheduleData);
    return response.data;
  },

  async deleteRoomSchedule(slotId: number): Promise<void> {
    await api.delete(`/rooms/schedules/${slotId}`);
  },

  async getRoomExceptions(roomId: number): Promise<any[]> {
    const response = await api.get(`/rooms/${roomId}/exceptions`);
    return response.data;
  },

  async addRoomException(roomId: number, exceptionData: any): Promise<any> {
    const response = await api.post(`/rooms/${roomId}/exceptions`, exceptionData);
    return response.data;
  },

  async deleteRoomException(excId: number): Promise<void> {
    await api.delete(`/rooms/exceptions/${excId}`);
  }
};
