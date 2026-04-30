-- 1. ELIMINAR TABLAS ANTIGUAS (Borrado total para empezar de cero)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "Room" CASCADE;
DROP TABLE IF EXISTS "BlockMember" CASCADE;
DROP TABLE IF EXISTS "Block" CASCADE;
DROP TABLE IF EXISTS "RoomSchedule" CASCADE;
DROP TABLE IF EXISTS "RoomException" CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. CREAR NUEVAS TABLAS

-- Información base de la web (Configurable por Super Admin)
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Reserva Sala',
    address TEXT,
    urbanization_details TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO site_settings (name, address, urbanization_details)
VALUES ('Mi Urbanización', 'Calle Ejemplo 123', 'Detalles de la comunidad...');

-- Perfiles de usuario (Extensión de auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    address TEXT,
    portal TEXT,
    floor TEXT,
    letter TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPERADMIN')),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Salas
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER,
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Horarios semanales de las salas
CREATE TABLE room_schedules (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 1=Lunes...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(room_id, day_of_week, start_time, end_time)
);

-- Excepciones (Días bloqueados)
CREATE TABLE room_exceptions (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    reason TEXT,
    UNIQUE(room_id, exception_date)
);

-- Reservas con sistema de fianza
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    deposit_status TEXT DEFAULT 'PENDING' CHECK (deposit_status IN ('PENDING', 'PAID', 'REFUNDED', 'CAPTURED')),
    stripe_payment_intent_id TEXT,
    deposit_amount DECIMAL DEFAULT 50.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FUNCIONES Y TRIGGERS

-- Crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, address, portal, floor, letter, role, status)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'portal',
    new.raw_user_meta_data->>'floor',
    new.raw_user_meta_data->>'letter',
    COALESCE(new.raw_user_meta_data->>'role', 'USER'),
    'PENDING'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
