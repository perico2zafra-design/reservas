import { Request, Response } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

export const getAllBlocks = async (req: Request & { user?: any }, res: Response) => {
  try {
    const isSuperAdmin = req.user?.user_metadata?.role === 'SUPER_ADMIN';
    
    let query = supabase.from('Block').select('*, Room(*)');
    
    // Si no es Super Admin, filtramos por los bloques donde es miembro
    if (!isSuperAdmin) {
      const { data: userBlocks } = await supabase
        .from('BlockMember')
        .select('blockId')
        .eq('userId', req.user.id);
      
      const blockIds = userBlocks?.map(ub => ub.blockId) || [];
      query = query.in('id', blockIds);
    }

    const { data: blocks, error } = await query;
    
    if (error) throw error;
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Error fetching blocks' });
  }
};

export const createBlock = async (req: Request, res: Response) => {
  const { name, location, description, image } = req.body;
  try {
    const { data: block, error } = await supabase
      .from('Block')
      .insert([{ name, location, description, image }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating block:', error);
    res.status(500).json({ error: 'Error creating block' });
  }
};
