import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const register = async (req: Request, res: Response) => {
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
      phone 
    } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          first_name: firstName,
          last_name: lastName,
          address,
          portal,
          floor,
          letter,
          phone,
          role: 'USER' 
        }
      }
    });

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({
      message: 'Registro exitoso. Pendiente de aprobación por el administrador.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        status: 'PENDING'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(400).json({ message: 'Credenciales inválidas' });

    // Verificar estado en la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('status, role, first_name, last_name')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ message: 'Perfil no encontrado' });
    }

    if (profile.status !== 'APPROVED') {
      return res.status(403).json({ message: 'Tu cuenta está pendiente de aprobación o ha sido rechazada.' });
    }

    res.json({
      token: data.session?.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: `${profile.first_name} ${profile.last_name}`,
        role: profile.role || 'USER'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: 'Se ha enviado un enlace de recuperación a tu email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar solicitud', error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer contraseña', error });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return res.status(401).json({ message: 'Token inválido' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, role, status')
      .eq('id', user.id)
      .single();

    res.json({
      id: user.id,
      email: user.email,
      name: profile ? `${profile.first_name} ${profile.last_name}` : user.user_metadata?.first_name,
      role: profile?.role || 'USER',
      status: profile?.status || 'PENDING'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};
