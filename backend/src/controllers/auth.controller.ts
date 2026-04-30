import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import jwt from 'jsonwebtoken';

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
    console.log('--- Intento de Login ---');
    console.log('Email:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error Auth Supabase:', error.message);
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    console.log('Usuario Auth encontrado:', data.user.id);

    // Verificar estado en la tabla profiles
    console.log('Buscando perfil para ID:', data.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error de Supabase al buscar perfil:', profileError);
      return res.status(500).json({ message: 'Error al consultar la base de datos', details: profileError });
    }

    if (!profile) {
      console.error('AVISO: El perfil no existe en la tabla profiles. Intentando crear...');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || 'Admin',
          last_name: data.user.user_metadata?.last_name || 'Campus',
          status: 'APPROVED',
          role: 'SUPERADMIN'
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error al crear perfil:', insertError);
        return res.status(403).json({ 
          message: 'Error de consistencia: El perfil existe en la DB pero no se puede leer. Revisa los permisos RLS en Supabase.',
          db_error: insertError 
        });
      }
      
      // Si se creó, usamos el nuevo perfil
      const p = newProfile;
      const token = jwt.sign(
        { id: data.user.id, email: data.user.email, role: p.role, status: p.status },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      return res.json({
        token,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: `${p.first_name} ${p.last_name}`,
          role: p.role,
          status: p.status
        }
      });
    }

    console.log('Perfil cargado correctamente:', profile.email, 'Estado:', profile.status);

    // Verificar bloqueos
    if (profile.status === 'BLOCKED') {
      const now = new Date();
      const blockedUntil = profile.blocked_until ? new Date(profile.blocked_until) : null;
      
      if (blockedUntil && blockedUntil > now) {
        return res.status(403).json({ 
          message: `Tu cuenta está temporalmente bloqueada por incumplimiento de las normas hasta el ${blockedUntil.toLocaleDateString()}.` 
        });
      } else {
        // El bloqueo ha expirado, restauramos a APPROVED
        await supabase.from('profiles').update({ status: 'APPROVED', blocked_until: null }).eq('id', data.user.id);
        profile.status = 'APPROVED';
      }
    }

    const token = jwt.sign(
      { id: data.user.id, email: data.user.email, role: profile.role, status: profile.status },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: `${profile.first_name} ${profile.last_name}`,
        role: profile.role,
        status: profile.status
      }
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
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
    const userId = (req as any).user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, role, status, email')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({
      id: userId,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      role: profile.role,
      status: profile.status
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};
