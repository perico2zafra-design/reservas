import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'Room Booking',
    },
    nav: {
      dashboard: 'Dashboard',
      rooms: 'Rooms',
      myBookings: 'My Bookings',
      settings: 'Settings',
    },
    booking: {
      title: 'Book a Room',
      roomName: 'Room Name',
      date: 'Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      bookNow: 'Book Now',
      available: 'Available',
      capacity: 'Capacity',
    },
  },
  es: {
    app: {
      title: 'Reserva de Salas',
    },
    nav: {
      dashboard: 'Panel de Control',
      rooms: 'Salas',
      myBookings: 'Mis Reservas',
      settings: 'Ajustes',
    },
    booking: {
      title: 'Reservar Sala',
      roomName: 'Nombre de la Sala',
      date: 'Fecha',
      startTime: 'Hora de Inicio',
      endTime: 'Hora de Fin',
      bookNow: 'Reservar Ahora',
      available: 'Disponible',
      capacity: 'Capacidad',
    },
  },
}

export default createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages,
})
