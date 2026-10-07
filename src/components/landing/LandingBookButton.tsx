'use client';
import type { AppointmentType } from '@/config/specialists';
import { BOOKING_PRESELECT_EVENT } from '@/components/BookingForm';

interface Props {
  area:       string;
  type?:      AppointmentType;
  className?: string;
  children:   React.ReactNode;
}

/**
 * Enlace al formulario de la landing que, de paso, deja elegida el área (y el
 * tipo de cita, si se indica) para que el paciente no tenga que volver a
 * buscarla.
 */
export default function LandingBookButton({ area, type, className, children }: Props) {
  return (
    <a
      href="#reserva"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent(BOOKING_PRESELECT_EVENT, { detail: { area, type } }))
      }
    >
      {children}
    </a>
  );
}
