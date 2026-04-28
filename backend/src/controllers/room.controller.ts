import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Error fetching rooms' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const { name, capacity, description, image, openTime, closeTime, workDays } = req.body;
  try {
    const room = await prisma.room.create({
      data: {
        name,
        capacity: parseInt(capacity),
        description,
        image,
        openTime,
        closeTime,
        workDays: Array.isArray(workDays) ? workDays.join(',') : workDays,
      },
    });
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
    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: {
        name,
        capacity: capacity ? parseInt(capacity) : undefined,
        description,
        image,
        openTime,
        closeTime,
        workDays: Array.isArray(workDays) ? workDays.join(',') : workDays,
      },
    });
    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Error updating room' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.room.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Error deleting room' });
  }
};
