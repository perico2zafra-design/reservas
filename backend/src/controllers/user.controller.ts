import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Esto elimina tanto en auth.users como en profiles por el ON DELETE CASCADE
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};
