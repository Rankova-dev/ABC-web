'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  MessageCircle, Brain, Activity, BookOpen,
  Sparkles, Mic, Users, Handshake,
} from 'lucide-react';
import type { Service, SpecialistId } from '@/config/specialists';
import { getTeamForService, SERVICE_TEAM } from '@/config/specialists';
import type { TimeSlot } from '@/lib/google-calendar';

// ─── Static data ──────────────────────────────────────────────────────────────

const SERVICES: { value: Service; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'logopedia',            label: 'Logopedia',              icon: <MessageCircle className="w-5 h-5" />, desc: 'Voz, habla y lenguaje' },
  { value: 'psicologia',           label: 'Psicología',             icon: <Brain          className="w-5 h-5" />, desc: 'Bienestar emocional' },
  { value: 'neuropsicologia',      label: 'Neuropsicología',        icon: <Activity       className="w-5 h-5" />, desc: 'Evaluación cognitiva' },
  { value: 'psicopedagogia',       label: 'Psicopedagogia',         icon: <BookOpen       className="w-5 h-5" />, desc: 'Aprendizaje y desarrollo' },
  { value: 'tea',                  label: 'TEA (Autismo)',           icon: <Sparkles       className="w-5 h-5" />, desc: 'Trastorno del espectro' },
  { value: 'rehabilitacion-voz',   label: 'Rehabilitación de Voz',  icon: <Mic            className="w-5 h-5" />, desc: 'Patología vocal' },
  { value: 'terapia-familiar',     label: 'Terapia Familiar',       icon: <Users          className="w-5 h-5" />, desc: 'Relaciones y conflictos' },
  { value: 'habilidades-sociales', label: 'Habilidades Sociales',   icon: <Handshake      className="w-5 h-5" />, desc: 'Comunicación interpersonal' },
];

const TODAY_STR = new Date().toISOString().split('T')[0];

const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return `${WEEK_DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Servicio' },
    { n: 2, label: 'Fecha y hora' },
    { n: 3, label: 'Tus datos' },
  ];
  return (
    <div className="flex items-center justify-center mb-8 select-none">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              step > s.n
                ? 'bg-teal text-white'
                : step === s.n
                ? 'bg-teal text-white ring-4 ring-teal/20'
                : 'bg-cream text-gray border border-gray/20'
            }`}>
              {step > s.n
                ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                : s.n
              }
            </div>
            <span className={`text-xs font-medium transition-colors duration-300 ${
              step === s.n ? 'text-teal' : step > s.n ? 'text-teal/60' : 'text-gray/50'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-14 sm:w-16 h-0.5 mx-1 mb-4 transition-colors duration-500 ${
              step > s.n ? 'bg-teal' : 'bg-gray/15'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (d: string) => void;
  disabled?: boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth();

  const [viewYear,  setViewYear]  = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth);

  const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (isCurrentMonth) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className={`${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={isCurrentMonth}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isCurrentMonth
              ? 'text-gray/20 cursor-not-allowed'
              : 'text-gray hover:bg-cream hover:text-teal'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="text-sm font-semibold text-ink">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth}
          className="w-8 h-8 rounded-lg hover:bg-cream flex items-center justify-center text-gray hover:text-teal transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray/40 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const mm = String(viewMonth + 1).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          const dateStr   = `${viewYear}-${mm}-${dd}`;
          const isPast    = new Date(dateStr + 'T12:00:00') < today;
          const isWeekend = [0, 6].includes(new Date(dateStr + 'T12:00:00').getDay());
          const isDisabled = isPast || isWeekend;
          const isSelected = value === dateStr;
          const isToday    = dateStr === TODAY_STR;

          return (
            <button
              key={idx}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(dateStr)}
              className={`
                h-8 w-full rounded-lg text-sm transition-all duration-150 font-outfit
                ${isSelected
                  ? 'bg-teal text-white font-semibold'
                  : isDisabled
                  ? 'text-gray/20 cursor-not-allowed'
                  : isToday
                  ? 'text-teal font-semibold hover:bg-teal/10'
                  : 'text-ink hover:bg-cream hover:text-teal'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  defaultService?: Service;
}

export default function BookingForm({ defaultService }: Props) {
  const t = useTranslations('contacto');

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 — service & specialist
  const [service,         setService]         = useState<Service | ''>(defaultService ?? '');
  const [specialists,     setSpecialists]     = useState<ReturnType<typeof getTeamForService>>([]);
  const [specialistId,    setSpecialistId]    = useState<SpecialistId | ''>('');
  const [noPreference,    setNoPreference]    = useState(false);

  // Step 2 — date & slot
  const [selectedDate,    setSelectedDate]    = useState('');
  const [availableSlots,  setAvailableSlots]  = useState<TimeSlot[]>([]);
  const [selectedSlot,    setSelectedSlot]    = useState<TimeSlot | null>(null);
  const [loadingSlots,    setLoadingSlots]    = useState(false);

  // Step 3 — patient data
  const [form, setForm] = useState({
    patientName:  '',
    patientAge:   '',
    guardianName: '',
    email:        '',
    phone:        '',
    message:      '',
    privacy:      false,
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const topRef = useRef<HTMLDivElement>(null);

  function goToStep(n: 1 | 2 | 3) {
    setStep(n);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }

  // Update specialists when service changes
  useEffect(() => {
    if (!service) { setSpecialists([]); setSpecialistId(''); setNoPreference(false); return; }
    const team = getTeamForService(service as Service);
    setSpecialists(team);
    if (team.length === 1) {
      // Only one option — select automatically
      setSpecialistId(team[0].id);
      setNoPreference(false);
    } else {
      setSpecialistId('');
      setNoPreference(false);
    }
  }, [service]);

  // Fetch slots when specialist + date change
  useEffect(() => {
    if (!specialistId || !selectedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/availability?specialist=${specialistId}&date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setAvailableSlots(data.slots ?? []))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [specialistId, selectedDate]);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleSelectSpecialist(id: SpecialistId) {
    setSpecialistId(id);
    setNoPreference(false);
  }

  function handleNoPreference() {
    // Pick the lead specialist (first in team) as the actual booking target
    if (specialists.length > 0) {
      setSpecialistId(specialists[0].id);
      setNoPreference(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !specialistId || !service) return;
    setStatus('sending');

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service, specialistId, selectedSlot }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (status === 'success') {
    const specialist = specialists.find(s => s.id === specialistId);
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-teal rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 className="font-outfit font-semibold text-2xl text-ink mb-2">¡Reserva confirmada!</h3>
        <p className="text-sm font-light text-gray mb-6 max-w-xs mx-auto leading-relaxed">
          Hemos enviado la confirmación a{' '}
          <strong className="text-ink font-semibold">{form.email}</strong>.
        </p>

        {/* Booking summary card */}
        <div className="bg-cream rounded-2xl px-5 py-4 mb-6 text-left max-w-xs mx-auto space-y-3">
          <div className="flex items-center gap-3">
            {specialist && (
              <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">{specialist.initials}</span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-ink">{specialist?.name ?? 'Especialista ABC'}</p>
              <p className="text-xs text-gray">{specialist?.role.split('·')[0].trim()}</p>
            </div>
          </div>
          <div className="border-t border-gray/10 pt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-ink font-medium">{formatDateDisplay(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-ink font-medium">{selectedSlot && formatTime(selectedSlot.start)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs font-light text-gray">
          ¿Necesitas cambiar la cita? Llámanos al{' '}
          <a href="tel:+34932434835" className="text-teal font-semibold">93 243 48 35</a>
        </p>
      </div>
    );
  }

  const freeSlots             = availableSlots.filter(s => s.available);
  const selectedSpecialistInfo = specialists.find(s => s.id === specialistId);
  const selectedServiceInfo    = SERVICES.find(s => s.value === service);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={topRef}>
      <StepIndicator step={step} />

      {/* ── STEP 1: Service + Specialist ──────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">

          {/* Service selector */}
          <div>
            <p className="text-sm font-semibold text-ink mb-3">
              ¿Qué servicio necesitas? <span className="text-teal">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(svc => {
                const count = SERVICE_TEAM[svc.value].length;
                const isSelected = service === svc.value;
                return (
                  <button
                    key={svc.value}
                    type="button"
                    onClick={() => setService(svc.value)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-teal text-white border-teal shadow-card'
                        : 'bg-cream border-gray/15 text-ink hover:border-teal/40 hover:bg-teal/5'
                    }`}
                  >
                    <span className={`mt-0.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-teal'}`}>
                      {svc.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{svc.label}</p>
                      <p className={`text-xs mt-0.5 leading-tight ${isSelected ? 'text-white/70' : 'text-gray/70'}`}>
                        {svc.desc}
                      </p>
                      <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-white/60' : 'text-teal/70'}`}>
                        {count} {count === 1 ? 'especialista' : 'especialistas'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specialist selector */}
          {service && specialists.length > 0 && (
            <div>
              {specialists.length === 1 ? (
                /* Single specialist — show passively */
                <div>
                  <p className="text-sm font-semibold text-ink mb-3">
                    Especialista asignada
                    <span className="text-xs font-light text-gray ml-2">(única para este servicio)</span>
                  </p>
                  <div className="flex items-center gap-4 bg-teal/5 border border-teal rounded-xl px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-white">{specialists[0].initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">{specialists[0].name}</p>
                      <p className="text-xs font-light text-gray">{specialists[0].role}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                /* Multiple specialists */
                <div>
                  <p className="text-sm font-semibold text-ink mb-3">
                    Elige tu especialista <span className="text-teal">*</span>
                  </p>
                  <div className="space-y-2">
                    {specialists.map((sp) => {
                      const isSelected = specialistId === sp.id && !noPreference;
                      return (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => handleSelectSpecialist(sp.id)}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                            isSelected
                              ? 'bg-teal/5 border-teal'
                              : 'bg-cream border-gray/15 hover:border-teal/40 hover:bg-teal/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
                          }`}>
                            <span className="text-sm font-semibold">{sp.initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink">{sp.name}</p>
                            <p className="text-xs font-light text-gray truncate">{sp.role}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {/* "No preference" option */}
                    <button
                      type="button"
                      onClick={handleNoPreference}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                        noPreference
                          ? 'bg-lime/10 border-lime/60'
                          : 'bg-cream border-dashed border-gray/30 hover:border-gray/50 hover:bg-cream-dark/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        noPreference ? 'bg-lime/30 text-ink' : 'bg-gray/10 text-gray'
                      }`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink">Sin preferencia</p>
                        <p className="text-xs font-light text-gray">Cualquier especialista disponible</p>
                      </div>
                      {noPreference && (
                        <div className="w-5 h-5 rounded-full bg-lime flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            disabled={!service || !specialistId}
            onClick={() => goToStep(2)}
            className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            Continuar
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      )}

      {/* ── STEP 2: Date + Slot ────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">

          {/* Recap chip */}
          {selectedServiceInfo && (
            <div className="flex items-center gap-3 bg-teal/5 border border-teal/20 rounded-xl px-4 py-3">
              <span className="text-teal flex-shrink-0">{selectedServiceInfo.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {noPreference
                    ? 'Sin preferencia de especialista'
                    : selectedSpecialistInfo?.name
                  }
                </p>
                <p className="text-xs text-gray">{selectedServiceInfo.label}</p>
              </div>
              <button type="button" onClick={() => goToStep(1)}
                className="text-xs text-teal font-semibold hover:underline flex-shrink-0 ml-2">
                Cambiar
              </button>
            </div>
          )}

          {/* Calendar */}
          <div>
            <p className="text-sm font-semibold text-ink mb-3">
              Elige una fecha <span className="text-teal">*</span>
              <span className="text-xs font-light text-gray ml-2">Lunes–Viernes</span>
            </p>
            <div className="bg-cream rounded-2xl p-4">
              <MiniCalendar
                value={selectedDate}
                onChange={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
              />
            </div>
          </div>

          {/* Slots */}
          {!selectedDate ? (
            <div className="flex items-center gap-3 bg-cream rounded-xl px-4 py-4">
              <svg className="w-5 h-5 text-teal/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-light text-gray">
                Selecciona un día para ver los horarios disponibles
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-ink mb-3">
                Horarios — <span className="text-teal">{formatDateDisplay(selectedDate)}</span>
              </p>

              {loadingSlots ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-10 bg-cream rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : freeSlots.length === 0 ? (
                <div className="bg-cream rounded-xl px-4 py-5 text-center">
                  <svg className="w-8 h-8 text-gray/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-sm font-light text-gray">No hay horarios libres este día.</p>
                  <p className="text-xs text-gray/50 mt-1">Elige otra fecha en el calendario.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {freeSlots.map((slot) => {
                    const isSelected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 text-sm rounded-xl border font-outfit transition-all duration-150 ${
                          isSelected
                            ? 'bg-teal text-white border-teal font-semibold scale-105 shadow-card'
                            : 'bg-white border-gray/15 text-ink hover:border-teal hover:text-teal hover:bg-teal/5'
                        }`}
                      >
                        {formatTime(slot.start)}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-teal">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {formatDateDisplay(selectedDate)} a las {formatTime(selectedSlot.start)}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => goToStep(1)}
              className="btn-secondary px-5 py-2.5 text-sm">
              ← Atrás
            </button>
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => goToStep(3)}
              className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Patient data ───────────────────────────────────────────── */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Booking recap */}
          {selectedSpecialistInfo && selectedSlot && selectedServiceInfo && (
            <div className="bg-teal/5 border border-teal/20 rounded-xl px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray uppercase tracking-wider">Tu cita</span>
                <button type="button" onClick={() => goToStep(2)}
                  className="text-xs text-teal font-semibold hover:underline">Cambiar fecha</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">{selectedSpecialistInfo.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {noPreference ? 'Sin preferencia de especialista' : selectedSpecialistInfo.name}
                  </p>
                  <p className="text-xs text-gray">
                    {selectedServiceInfo.label} · {formatDateDisplay(selectedDate)} · {formatTime(selectedSlot.start)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Name + age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="patientName" className="block text-sm font-semibold text-ink mb-1.5">
                {t('form_name_patient')} <span className="text-teal">*</span>
              </label>
              <input
                id="patientName" name="patientName" type="text" required
                placeholder="Nombre completo"
                value={form.patientName} onChange={handleFormChange}
                className="field-base"
              />
            </div>
            <div>
              <label htmlFor="patientAge" className="block text-sm font-semibold text-ink mb-1.5">
                {t('form_age')}
              </label>
              <input
                id="patientAge" name="patientAge" type="number" min="0" max="99"
                placeholder="Ej: 8"
                value={form.patientAge} onChange={handleFormChange}
                className="field-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guardianName" className="block text-sm font-semibold text-ink mb-1.5">
              {t('form_guardian')}
              <span className="text-xs font-light text-gray ml-1">(si el paciente es menor)</span>
            </label>
            <input
              id="guardianName" name="guardianName" type="text"
              placeholder="Nombre del familiar o tutor"
              value={form.guardianName} onChange={handleFormChange}
              className="field-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
                {t('form_email')} <span className="text-teal">*</span>
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="correo@ejemplo.com"
                value={form.email} onChange={handleFormChange}
                className="field-base"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">
                {t('form_phone')} <span className="text-teal">*</span>
              </label>
              <input
                id="phone" name="phone" type="tel" required
                placeholder="6XX XXX XXX"
                value={form.phone} onChange={handleFormChange}
                className="field-base"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-ink mb-1.5">
              {t('form_message')}
              <span className="text-xs font-light text-gray ml-1">(opcional)</span>
            </label>
            <textarea
              id="message" name="message" rows={3}
              placeholder="Cuéntanos brevemente el motivo de la consulta..."
              value={form.message} onChange={handleFormChange}
              className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-xl text-sm font-light focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none placeholder:text-gray/40"
            />
          </div>

          {/* Privacy */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" name="privacy"
              checked={form.privacy} onChange={handleFormChange}
              required className="mt-0.5 w-4 h-4 accent-teal flex-shrink-0"
            />
            <span className="text-sm font-light text-gray leading-relaxed">
              He leído y acepto la{' '}
              <a href="/politica-de-privacidad" target="_blank"
                className="text-teal underline underline-offset-2 hover:no-underline">
                política de privacidad
              </a>
            </span>
          </label>

          {status === 'error' && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p className="text-sm text-red-600">{t('form_error')}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => goToStep(2)}
              className="btn-secondary px-5 py-2.5 text-sm">
              ← Atrás
            </button>
            <button
              type="submit"
              disabled={status === 'sending' || !form.privacy || !form.patientName || !form.email || !form.phone}
              className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Confirmando…
                </>
              ) : (
                <>
                  {t('form_submit')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
