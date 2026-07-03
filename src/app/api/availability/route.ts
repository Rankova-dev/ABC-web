import { NextRequest, NextResponse } from 'next/server';
import { getAllAvailableSlots } from '@/lib/google-calendar';

export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'Se requiere el parámetro date' }, { status: 400 });
  }

  const from = new Date(`${dateStr}T00:00:00`);
  if (isNaN(from.getTime())) {
    return NextResponse.json({ error: 'Formato de fecha inválido' }, { status: 400 });
  }

  const allSlots = await getAllAvailableSlots(from);

  // Filter to the requested day (calendars are queried per-day already, this is a sanity check)
  const daySlots = allSlots.filter((slot) => {
    const slotDate = new Date(slot.start);
    return (
      slotDate.getFullYear() === from.getFullYear() &&
      slotDate.getMonth()    === from.getMonth()    &&
      slotDate.getDate()     === from.getDate()
    );
  });

  return NextResponse.json({ slots: daySlots });
}
