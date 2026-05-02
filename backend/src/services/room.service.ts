import { supabase } from '../lib/supabase.js';

export class RoomService {
  async getAllRooms() {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return rooms;
  }

  async createRoom(roomData: any) {
    const { data: room, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) throw error;
    return room;
  }

  async updateRoom(id: string, roomData: any) {
    const { data: room, error } = await supabase
      .from('rooms')
      .update(roomData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return room;
  }

  async deleteRoom(id: string) {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Horarios ---
  async getRoomSchedules(id: string) {
    const { data, error } = await supabase
      .from('room_schedules')
      .select('*')
      .eq('room_id', id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) throw error;
    return data;
  }

  async addRoomSchedule(id: string, scheduleData: any) {
    const { data, error } = await supabase
      .from('room_schedules')
      .insert([{ room_id: id, ...scheduleData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteRoomSchedule(slotId: string) {
    const { error } = await supabase.from('room_schedules').delete().eq('id', slotId);
    if (error) throw error;
  }

  // --- Excepciones ---
  async getRoomExceptions(id: string) {
    const { data, error } = await supabase
      .from('room_exceptions')
      .select('*')
      .eq('room_id', id)
      .order('exception_date', { ascending: true });
    if (error) throw error;
    return data;
  }

  async addRoomException(id: string, exceptionData: any) {
    const { data, error } = await supabase
      .from('room_exceptions')
      .insert([{ room_id: id, ...exceptionData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteRoomException(excId: string) {
    const { error } = await supabase.from('room_exceptions').delete().eq('id', excId);
    if (error) throw error;
  }
}

export const roomService = new RoomService();
