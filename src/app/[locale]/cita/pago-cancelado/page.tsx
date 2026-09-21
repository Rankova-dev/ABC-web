import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { CHECKOUT_EXPIRY_MINUTES } from '@/lib/stripe';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isCA = locale === 'ca';
  return {
    title:       isCA ? 'Pagament no completat — ABC Centre' : 'Pago no completado — ABC Centre',
    description: isCA ? 'La cita no s\'ha arribat a reservar.' : 'La cita no se ha llegado a reservar.',
    robots:      { index: false, follow: false },
  };
}

export default async function PagoCanceladoPage({ params }: Props) {
  const { locale } = await params;
  const isCA = locale === 'ca';

  return (
    <section className="bg-cream pt-28 pb-20 min-h-[70vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">

        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-display font-outfit font-semibold text-ink mb-3">
          {isCA ? 'Pagament no completat' : 'Pago no completado'}
        </h1>
        <p className="text-sm font-light text-gray leading-relaxed mb-8">
          {isCA
            ? 'No s\'ha cobrat res i la cita no s\'ha reservat. L\'hora que havies triat et queda guardada uns minuts, així que encara hi ets a temps.'
            : 'No se ha cobrado nada y la cita no se ha reservado. La hora que habías elegido te queda guardada unos minutos, así que aún estás a tiempo.'}
        </p>

        <div className="bg-white rounded-2xl px-6 py-5 text-left mb-8">
          <p className="text-sm font-light text-gray leading-relaxed">
            {isCA
              ? `Si no acabes el pagament en ${CHECKOUT_EXPIRY_MINUTES} minuts, l'hora torna a quedar lliure per a altres pacients. També pots reservar-la per telèfon i pagar al centre.`
              : `Si no completas el pago en ${CHECKOUT_EXPIRY_MINUTES} minutos, la hora vuelve a quedar libre para otros pacientes. También puedes reservarla por teléfono y pagar en el centro.`}
          </p>
          <p className="text-sm font-light text-gray mt-2">
            {isCA ? 'Truca\'ns al ' : 'Llámanos al '}
            <a href="tel:+34932434835" className="text-teal font-semibold">93 243 48 35</a>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contacto" className="btn-primary inline-flex">
            {isCA ? 'Tornar a provar' : 'Volver a intentarlo'}
          </Link>
          <Link href="/" className="btn-secondary inline-flex px-5 py-2.5 text-sm">
            {isCA ? 'Inici' : 'Inicio'}
          </Link>
        </div>
      </div>
    </section>
  );
}
