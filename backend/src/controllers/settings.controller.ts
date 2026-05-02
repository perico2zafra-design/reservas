import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener configuración', error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      address, 
      urbanization_details, 
    } = req.body;

    const { data, error } = await supabase
      .from('site_settings')
      .update({ 
        name, 
        address, 
        urbanization_details, 
        updated_at: new Date() 
      })

      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar configuración', error });
  }
};

