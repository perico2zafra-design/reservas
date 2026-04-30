import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener salas' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const { name, capacity, description, image } = req.body;
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .insert([{ name, capacity, description, image }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sala' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, capacity, description, image, is_active } = req.body;
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .update({ name, capacity, description, image, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sala' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sala' });
  }
};

// --- Horarios ---
export const getRoomSchedules = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('room_schedules')
      .select('*')
      .eq('room_id', id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
};

export const addRoomSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { day_of_week, start_time, end_time } = req.body;
  try {
    const { data, error } = await supabase
      .from('room_schedules')
      .insert([{ room_id: id, day_of_week, start_time, end_time }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir horario' });
  }
};

export const deleteRoomSchedule = async (req: Request, res: Response) => {
  const { slotId } = req.params;
  try {
    const { error } = await supabase.from('room_schedules').delete().eq('id', slotId);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar horario' });
  }
};

// --- Excepciones ---
export const getRoomExceptions = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('room_exceptions')
      .select('*')
      .eq('room_id', id)
      .order('exception_date', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener excepciones' });
  }
};

export const addRoomException = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { exception_date, reason } = req.body;
  try {
    const { data, error } = await supabase
      .from('room_exceptions')
      .insert([{ room_id: id, exception_date, reason }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir excepción' });
  }
};

export const deleteRoomException = async (req: Request, res: Response) => {
  const { excId } = req.params;
  try {
    const { error } = await supabase.from('room_exceptions').delete().eq('id', excId);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar excepción' });
  }
};
