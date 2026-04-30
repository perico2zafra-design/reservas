import { defineStore } from 'pinia';
import { bookingService } from '@/services/booking.service';
import type { Room, Booking } from '@/types';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    rooms: [] as Room[],
    bookings: [] as Booking[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchBlocks() {
      this.isLoading = true;
      try {
        this.blocks = await bookingService.getBlocks();
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error fetching blocks';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRooms(blockId?: number) {
      this.isLoading = true;
      try {
        this.rooms = await bookingService.getRooms(blockId);
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error fetching rooms';
      } finally {
        this.isLoading = false;
      }
    },

    async addRoom(roomData: CreateRoomDTO) {
      this.isLoading = true;
      try {
        const newRoom = await bookingService.createRoom(roomData);
        this.rooms.push(newRoom);
        return newRoom;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error creating room';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRoom(id: number, roomData: Partial<CreateRoomDTO>) {
      this.isLoading = true;
      try {
        const updatedRoom = await bookingService.updateRoom(id, roomData);
        const index = this.rooms.findIndex(r => r.id === id);
        if (index !== -1) this.rooms[index] = updatedRoom;
        return updatedRoom;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error updating room';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRoom(id: number) {
      this.isLoading = true;
      try {
        await bookingService.deleteRoom(id);
        this.rooms = this.rooms.filter(r => r.id !== id);
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error deleting room';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchBookings() {
      this.isLoading = true;
      try {
        this.bookings = await bookingService.getBookings();
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error fetching bookings';
      } finally {
        this.isLoading = false;
      }
    },

    async createBooking(bookingData: CreateBookingDTO) {
      this.isLoading = true;
      try {
        const newBooking = await bookingService.createBooking(bookingData);
        this.bookings.push(newBooking);
        return newBooking;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error creating booking';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async cancelBooking(id: number) {
      this.isLoading = true;
      try {
        await bookingService.cancelBooking(id);
        this.bookings = this.bookings.filter(b => b.id !== id);
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Error canceling booking';
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
