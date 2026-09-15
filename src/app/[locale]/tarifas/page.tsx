import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import {
  APPOINTMENT_TYPES,
  SERVICE_APPOINTMENT_TYPES,
  getAppointmentTypeText,
  getSpecialistsForAppointment,
  SPECIALISTS,
} from '@/config/specialists';
import type { Service, AppointmentType } from '@/config/specialists';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tarifas' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

/**
 * Servicios con tarifa propia, en el orden en que se muestran. El resto solo
 * ofrecen sesión informativa gratuita, así que no tienen bloque de precios.
 */
const PRICED_SERVICES: Service[] = [
  'psicologia',
  'neuropsicologia',
  'psicopedagogia',
  'tea',
  'orientacion-familiar',
];

/** Clave del nombre del servicio en el menú (nav.services_menu.*) */
function serviceMenuKey(service: Service): string {
  return service.replace(/-/g, '_');
}

function formatPrice(price: number) {
  return price === 0 ? 'Gratuita' : `${price} €`;
}

/** Tipos de pago de un servicio, sin las sesiones informativas gratuitas */
function paidTypes(service: Service): AppointmentType[] {
  return SERVICE_APPOINTMENT_TYPES[service].filter((type) => APPOINTMENT_TYPES[type].price > 0);
}

export default function TarifasPage() {
  const t = useTranslations('tarifas');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">ABC Centre</p>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{t('h1')}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mx-auto mb-6">{t('subtitle')}</p>
          <p className="inline-flex items-center gap-2 bg-lime/20 border border-lime/30 text-ink text-sm font-medium rounded-full px-4 py-1.5">
            {t('free_first')}
          </p>
        </div>
      </section>

      {/* Bloques por servicio */}
      {PRICED_SERVICES.map((service, sIdx) => {
        const types = paidTypes(service);
        if (types.length === 0) return null;

        return (
          <section
            key={service}
            id={service}
            className={`py-14 scroll-mt-24 ${sIdx % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="section-title animate-on-scroll">
                {tNav(`services_menu.${serviceMenuKey(service)}` as never)}
              </h2>

              <div className="space-y-4 mt-6">
                {types.map((type, i) => {
                  const cfg = APPOINTMENT_TYPES[type];
                  const text = getAppointmentTypeText(type, locale);
                  // Las tarifas que no se reservan online no anuncian equipo:
                  // quién la hace se acuerda en la sesión informativa.
                  const bookable = cfg.bookable !== false;
                  const team = bookable ? getSpecialistsForAppointment(service, type) : [];

                  return (
                    <div
                      key={type}
                      className="card animate-on-scroll flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-outfit font-semibold text-ink text-base leading-snug">
                          {text.label}
                        </h3>
                        {text.includes && (
                          <p className="text-sm font-light text-gray leading-relaxed mt-2">
                            <span className="font-semibold text-ink">{t('includes')}: </span>
                            {text.includes}
                          </p>
                        )}
                        {!bookable && (
                          <p className="text-sm font-light text-gray/80 leading-relaxed mt-2">
                            {t('by_info_session')}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {cfg.sessions && (
                            <span className="text-xs font-medium text-teal bg-teal/10 rounded-full px-3 py-1">
                              {cfg.sessions} {t('sessions')}
                            </span>
                          )}
                          {cfg.onlineOnly && (
                            <span className="text-xs font-medium text-teal bg-teal/10 rounded-full px-3 py-1">
                              {t('online_tag')}
                            </span>
                          )}
                          {cfg.maxStartHour != null && (
                            <span className="text-xs font-medium text-teal bg-teal/10 rounded-full px-3 py-1">
                              {t('morning_tag')}
                            </span>
                          )}
                          {team.length > 0 && (
                            <span className="text-xs font-light text-gray/70 px-1 py-1">
                              {team.map((id) => SPECIALISTS[id].name).join(' · ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                        <p className="font-outfit font-semibold text-teal text-2xl leading-none">
                          {formatPrice(cfg.price)}
                        </p>
                        <Link
                          href={{
                            pathname: '/contacto',
                            query: bookable
                              ? { service, type }
                              : { service, type: 'informativa-presencial' },
                            hash: 'cita',
                          }}
                          className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap"
                        >
                          {bookable ? t('buy') : t('ask')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Resto de servicios */}
      <section className="py-14 bg-white border-t border-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('other_title')}</h2>
          <p className="text-base font-outfit font-light text-gray leading-relaxed mt-4 animate-on-scroll">
            {t('other_body')}
          </p>
          <div className="mt-6 animate-on-scroll">
            <Link href="/contacto" className="btn-primary">
              {t('other_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Nota de pago */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-light text-gray leading-relaxed">{t('payment_note')}</p>
        </div>
      </section>
    </>
  );
}
