import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllBlocks = async (req: Request, res: Response) => {
  try {
    const blocks = await prisma.block.findMany({
      include: { rooms: true }
    });
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Error fetching blocks' });
  }
};

export const createBlock = async (req: Request, res: Response) => {
  const { name, location, description, image } = req.body;
  try {
    const block = await prisma.block.create({
      data: { name, location, description, image },
    });
    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Error creating block' });
  }
};
