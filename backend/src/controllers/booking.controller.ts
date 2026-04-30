import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, rooms(*), user:user_id(email, first_name, last_name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

// Crear intención de pago para la fianza de 50€
export const createBookingPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { roomId, bookingDate, startTime, endTime } = req.body;
    
    // 1. Crear el Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // 50.00€ en céntimos
      currency: 'eur',
      metadata: { 
        roomId, 
        userId: (req as any).user.id,
        bookingDate 
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      depositAmount: 50
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
        deposit_amount: 50
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
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
};
