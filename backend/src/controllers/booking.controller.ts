import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    // 1. Obtener reservas y salas (esta relación sí existe)
    const { data: bookings, error: bError } = await supabase
      .from('bookings')
      .select('*, room:rooms!room_id(*)')
      .order('created_at', { ascending: false });
    
    if (bError) throw bError;

    // 2. Obtener todos los perfiles para asociarlos manualmente
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*');

    if (pError) throw pError;

    // 3. Combinar los datos en el servidor
    const enrichedBookings = bookings.map(booking => ({
      ...booking,
      user: profiles.find(p => p.id === booking.user_id) || { first_name: 'Vecino', last_name: 'Desconocido' }
    }));

    res.json(enrichedBookings);
  } catch (error) {
    console.error('Error detallado en getAllBookings:', error);
    res.status(500).json({ error: 'Error al obtener reservas', details: error });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { data, error } = await supabase
      .from('bookings')
      .select('*, room:rooms!room_id(*)')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus reservas' });
  }
};


// Crear intención de pago para la fianza de 50€
export const createBookingPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { roomId, bookingDate, startTime, endTime } = req.body;
    const userId = (req as any).user.id;

    // 0. Obtener configuración dinámica
    const { data: settings } = await supabase.from('site_settings').select('max_bookings_per_month').single();
    const MAX_LIMIT = settings?.max_bookings_per_month || 2;

    // 1. Verificar límite de reservas por propietario (Máximo X al mes natural según acta)
    const targetDate = new Date(bookingDate);
    const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const { count, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'CANCELLED')
      .gte('booking_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('booking_date', lastDayOfMonth.toISOString().split('T')[0]);

    if (countError) throw countError;

    if (count !== null && count >= MAX_LIMIT) {
      return res.status(403).json({ 
        error: 'Límite mensual alcanzado', 
        message: `Para el mes de ${targetDate.toLocaleString('es-ES', { month: 'long' })}, ya has alcanzado el máximo de ${MAX_LIMIT} reservas permitido por propietario.` 
      });
    }

    // 2. Obtener el precio de fianza configurado para esta sala
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('deposit_amount')
      .eq('id', roomId)
      .single();

    if (roomError || !room) throw new Error('Sala no encontrada');
    
    const amountInCents = Math.round(room.deposit_amount * 100);

    // 3. Crear el Setup Intent en Stripe (Valida y guarda la tarjeta sin cobrar)
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('tu_clave_secreta')) {
      return res.status(500).json({ 
        error: 'Error de configuración', 
        message: 'No se ha configurado una clave de Stripe válida en el backend (.env).' 
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      usage: 'off_session', // Permite cobros futuros sin que el cliente esté presente
      metadata: { 
        roomId, 
        userId,
        bookingDate,
        type: 'registro_fianza_segura'
      }
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      depositAmount: room.deposit_amount
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: 'Error al crear la fianza' });
  }
};

// Confirmar reserva tras el pago
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { roomId, bookingDate, startTime, endTime, paymentIntentId } = req.body;
    const userId = (req as any).user.id;
    
    // 0. Obtener configuración dinámica y verificar límites (Duplicado de seguridad)
    const { data: settings } = await supabase.from('site_settings').select('max_bookings_per_month').single();
    const MAX_LIMIT = settings?.max_bookings_per_month || 2;

    const targetDate = new Date(bookingDate);
    const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('status', 'CANCELLED')
      .gte('booking_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('booking_date', lastDayOfMonth.toISOString().split('T')[0]);

    if (count !== null && count >= MAX_LIMIT) {
      return res.status(403).json({ 
        error: 'Límite mensual alcanzado', 
        message: `No se puede confirmar: has alcanzado el máximo de ${MAX_LIMIT} reservas al mes.` 
      });
    }

    // Obtener fianza configurada para la sala
    const { data: room } = await supabase
      .from('rooms')
      .select('deposit_amount')
      .eq('id', roomId)
      .single();

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        room_id: roomId,
        user_id: userId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        status: 'CONFIRMED',
        deposit_status: 'PAID',
        stripe_payment_intent_id: paymentIntentId,
        deposit_amount: room?.deposit_amount || 50
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar la reserva' });
  }
};

// Gestión de fianza por el Admin (Devolver o Cobrar)
export const manageDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'REFUND' o 'CAPTURE'
    
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: 'Reserva no encontrada' });

    if (action === 'REFUND') {
      // Reembolsar en Stripe
      await stripe.refunds.create({
        payment_intent: booking.stripe_payment_intent_id,
      });

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ deposit_status: 'REFUNDED' })
        .eq('id', id);

      if (updateError) throw updateError;
      res.json({ message: 'Fianza devuelta correctamente' });
    } else if (action === 'CAPTURE') {
      // En este flujo simplificado, el dinero ya está pagado. 
      // CAPTURE aquí significa simplemente que el admin marca que se queda el dinero por daños.
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ deposit_status: 'CAPTURED' })
        .eq('id', id);

      if (updateError) throw updateError;
      res.json({ message: 'Fianza ejecutada (cobrada) por daños' });
    }
  } catch (error) {
    console.error('Deposit Management Error:', error);
    res.status(500).json({ error: 'Error al gestionar la fianza' });
  }
};


export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 1. Obtener los datos de la reserva
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('booking_date, start_time')
      .eq('id', id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: 'Reserva no encontrada' });

    // 2. Validar regla de las 24 horas
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    const diffInHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return res.status(403).json({ 
        error: 'Plazo de cancelación expirado',
        message: 'No puedes cancelar una reserva con menos de 24 horas de antelación.' 
      });
    }

    // 3. Cancelar (Soft delete) y limpiar estado de fianza
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'CANCELLED',
        deposit_status: 'REFUNDED' 
      })
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    console.error('Cancel Error:', error);
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
};

