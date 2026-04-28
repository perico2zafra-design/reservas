import { Request, Response } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { data: rooms, error } = await supabase
      .from('Room')
      .select('*');
    
    if (error) throw error;
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Error fetching rooms' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const { name, capacity, description, image, openTime, closeTime, workDays, blockId } = req.body;
  try {
    const { data: room, error } = await supabase
      .from('Room')
      .insert([{
        name,
        capacity: parseInt(capacity),
        description,
        image,
        openTime,
        closeTime,
        workDays: Array.isArray(workDays) ? workDays.join(',') : workDays,
        blockId: parseInt(blockId)
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Error creating room' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, capacity, description, image, openTime, closeTime, workDays } = req.body;
  try {
    const updateData: any = {
      name,
      description,
      image,
      openTime,
      closeTime,
      workDays: Array.isArray(workDays) ? workDays.join(',') : workDays,
    };
    if (capacity) updateData.capacity = parseInt(capacity);

    const { data: room, error } = await supabase
      .from('Room')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Error updating room' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('Room')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Error deleting room' });
  }
};
