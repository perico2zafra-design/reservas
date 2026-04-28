import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getBlockMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data: members, error } = await supabase
      .from('BlockMember')
      .select('*, user:userId(id, email, user_metadata)')
      .eq('blockId', parseInt(id));

    if (error) throw error;
    res.json(members);
  } catch (error) {
    console.error('Error fetching block members:', error);
    res.status(500).json({ error: 'Error fetching block members' });
  }
};

export const addBlockMember = async (req: Request, res: Response) => {
  const { id } = req.params; // blockId
  const { email, role } = req.body; // Buscamos por email

  try {
    // 1. Buscar al usuario en auth.users (necesitamos su UUID)
    // Usamos rpc o una consulta directa si tenemos permisos, 
    // pero lo más limpio es usar el admin API de auth para buscar por email
    const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) throw searchError;

    const targetUser = users.find(u => u.email === email);

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuario no encontrado. Debe estar registrado en la app.' });
    }

    // 2. Añadirlo como miembro del bloque
    const { data: member, error } = await supabase
      .from('BlockMember')
      .insert([{
        blockId: parseInt(id),
        userId: targetUser.id,
        role: role || 'MEMBER'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(member);
  } catch (error) {
    console.error('Error adding block member:', error);
    res.status(500).json({ error: 'Error adding block member' });
  }
};

export const removeBlockMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  try {
    const { error } = await supabase
      .from('BlockMember')
      .delete()
      .eq('id', parseInt(memberId));

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error removing block member:', error);
    res.status(500).json({ error: 'Error removing block member' });
  }
};
