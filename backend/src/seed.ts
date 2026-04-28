import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.block.deleteMany();

  // Create Blocks
  const blockA = await prisma.block.create({
    data: {
      name: 'Bloque de Ingeniería',
      location: 'Campus Norte, Edificio 3',
      description: 'Principal centro de innovación y desarrollo tecnológico.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    }
  });

  const blockB = await prisma.block.create({
    data: {
      name: 'Centro de Negocios',
      location: 'Campus Sur, Edificio Principal',
      description: 'Espacio dedicado al emprendimiento y finanzas.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    }
  });

  // Create Rooms for Block A
  await prisma.room.create({
    data: { 
      name: 'Laboratorio de IA', 
      capacity: 15, 
      description: 'Equipado con GPUs de última generación.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
      blockId: blockA.id,
      openTime: '08:00',
      closeTime: '22:00',
      workDays: '1,2,3,4,5'
    }
  });

  await prisma.room.create({
    data: { 
      name: 'Sala de Robótica', 
      capacity: 10, 
      description: 'Mesa de trabajo y kits de prototipado.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
      blockId: blockA.id,
      openTime: '09:00',
      closeTime: '18:00',
      workDays: '1,2,3,4,5'
    }
  });

  // Create Rooms for Block B
  await prisma.room.create({
    data: { 
      name: 'Sala de Juntas VIP', 
      capacity: 8, 
      description: 'Vistas panorámicas y sistema de audio premium.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=600',
      blockId: blockB.id,
      openTime: '07:00',
      closeTime: '21:00',
      workDays: '1,2,3,4,5,6'
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
