import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { startTime: 'asc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { roomId, userName, startTime, endTime } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: {
        roomId: parseInt(roomId),
        userName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Error deleting booking' });
  }
};
