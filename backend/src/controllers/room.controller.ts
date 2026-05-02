import { Request, Response } from 'express';
import { roomService } from '../services/room.service';

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener salas' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sala' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const room = await roomService.updateRoom(id, req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sala' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await roomService.deleteRoom(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sala' });
  }
};

// --- Horarios ---
export const getRoomSchedules = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await roomService.getRoomSchedules(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
};

export const addRoomSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await roomService.addRoomSchedule(id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir horario' });
  }
};

export const deleteRoomSchedule = async (req: Request, res: Response) => {
  const { slotId } = req.params;
  try {
    await roomService.deleteRoomSchedule(slotId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar horario' });
  }
};

// --- Excepciones ---
export const getRoomExceptions = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await roomService.getRoomExceptions(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener excepciones' });
  }
};

export const addRoomException = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await roomService.addRoomException(id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir excepción' });
  }
};

export const deleteRoomException = async (req: Request, res: Response) => {
  const { excId } = req.params;
  try {
    await roomService.deleteRoomException(excId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar excepción' });
  }
};

