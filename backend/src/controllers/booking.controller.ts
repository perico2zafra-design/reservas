import { Request, Response } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { data: bookings, error } = await supabase
      .from('Booking')
      .select('*, Room(*)');
    
    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { roomId, userId, startTime, endTime } = req.body;
  try {
    const { data: booking, error } = await supabase
      .from('Booking')
      .insert([{
        roomId: parseInt(roomId),
        userId, // Esto ahora es un UUID de Supabase Auth
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('Booking')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Error deleting booking' });
  }
};
