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
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

export const manualCreateUser = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      address, 
      portal, 
      floor, 
      letter,
      role 
    } = req.body;

    // 1. Create in Auth (automatically creates profile via trigger)
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        first_name: firstName, 
        last_name: lastName, 
        address, 
        portal, 
        floor, 
        letter,
        role: role || 'USER' 
      },
      email_confirm: true
    });

    if (authError) throw authError;

    // 2. Approve the profile immediately
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ status: 'APPROVED' })
      .eq('id', data.user.id);

    if (profileError) throw profileError;

    res.status(201).json({ message: 'Usuario creado y admitido correctamente', user: data.user });
  } catch (error) {
    console.error('Error in manualCreateUser:', error);
    res.status(500).json({ message: 'Error al crear usuario manualmente', error });
  }
};
