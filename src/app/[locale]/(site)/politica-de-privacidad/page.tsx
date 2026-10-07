import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isCA = locale === 'ca';
  return {
    title: isCA
      ? 'Política de Privacitat — ABC Centre Barcelona'
      : 'Política de Privacidad — ABC Centre Barcelona',
    description: isCA
      ? 'Política de privacitat i protecció de dades de ABC Centre conforme al RGPD i la LOPD-GDD.'
      : 'Política de privacidad y protección de datos de ABC Centre conforme al RGPD y la LOPD-GDD.',
    robots: { index: false, follow: true },
  };
}

export default async function PoliticaPrivacidadPage({ params }: Props) {
  const { locale } = await params;
  const isCA = locale === 'ca';

  const content = isCA ? CA_CONTENT : ES_CONTENT;

  return (
    <>
      <section className="bg-cream pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-light text-gray hover:text-teal transition-colors mb-6 inline-block">
            ← {isCA ? 'Tornar a l\'inici' : 'Volver al inicio'}
          </Link>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{content.title}</h1>
          <p className="text-sm font-light text-gray">{content.lastUpdated}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose-legal">
          {content.sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-xl font-outfit font-semibold text-ink mb-4">{section.heading}</h2>
              <div className="space-y-3 text-sm font-light text-gray leading-relaxed">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {section.list && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {section.list.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── ES Content ──────────────────────────────────────────────────────────────

const ES_CONTENT = {
  title: 'Política de Privacidad',
  lastUpdated: 'Última actualización: mayo 2026',
  sections: [
    {
      heading: '1. Responsable del tratamiento',
      paragraphs: [
        'En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPD-GDD), le informamos de los términos y condiciones del tratamiento de sus datos personales por parte de ABC Centre.',
        'Responsable: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia',
        'Dirección: Carrer de Malgrat, 47, 08016 Barcelona',
        'Correo electrónico: info@abccentre.es',
        'Teléfono: 93 243 48 35',
      ],
    },
    {
      heading: '2. Datos que recopilamos',
      paragraphs: [
        'A través del formulario de contacto y solicitud de cita, recopilamos los siguientes datos personales:',
      ],
      list: [
        'Nombre y apellidos del paciente',
        'Edad del paciente',
        'Nombre del familiar o tutor (cuando el paciente es menor de edad)',
        'Correo electrónico',
        'Número de teléfono',
        'Servicio solicitado',
        'Motivo de consulta (descripción libre que puede contener datos de salud)',
        'Fecha y hora de la cita seleccionada',
      ],
    },
    {
      heading: '3. Finalidad del tratamiento',
      paragraphs: [
        'Los datos personales facilitados se utilizan exclusivamente para:',
      ],
      list: [
        'Gestionar su solicitud de primera consulta y agendar la cita en el calendario de la especialista correspondiente',
        'Enviarle la confirmación de su cita por correo electrónico',
        'Contactarle para modificaciones o cancelaciones de cita',
        'Responder a consultas enviadas a través del formulario de contacto',
        'Cumplir con las obligaciones legales aplicables en el ámbito sanitario',
      ],
    },
    {
      heading: '4. Base jurídica del tratamiento',
      paragraphs: [
        'El tratamiento de sus datos se fundamenta en:',
      ],
      list: [
        'Consentimiento del interesado (art. 6.1.a RGPD): para el envío del formulario de solicitud de cita y el envío de comunicaciones relacionadas',
        'Ejecución de un contrato o medidas precontractuales (art. 6.1.b RGPD): para la gestión de la relación asistencial',
        'Cumplimiento de una obligación legal (art. 6.1.c RGPD): para cumplir con la normativa sanitaria aplicable',
        'Los datos de salud son tratados al amparo del art. 9.2.h RGPD (asistencia sanitaria y social)',
      ],
    },
    {
      heading: '5. Conservación de los datos',
      paragraphs: [
        'Los datos de contacto y de cita se conservan durante el tiempo necesario para la prestación del servicio y el cumplimiento de las obligaciones legales aplicables.',
        'Los datos relacionados con la atención sanitaria se conservan conforme a la legislación vigente en materia de documentación clínica (mínimo 5 años desde la última asistencia en Cataluña, según la Llei 21/2000 de drets d\'informació concernent la salut i l\'autonomia del pacient).',
      ],
    },
    {
      heading: '6. Destinatarios de los datos',
      paragraphs: [
        'Sus datos no se ceden a terceros, salvo obligación legal. Utilizamos los siguientes servicios de terceros como encargados del tratamiento:',
      ],
      list: [
        'Google LLC (Google Calendar): para la gestión de la agenda de citas. Google actúa como encargado del tratamiento bajo el Marco de Privacidad de Datos UE–EE.UU.',
        'Proveedores de correo electrónico para el envío de confirmaciones de cita',
      ],
    },
    {
      heading: '7. Derechos de los interesados',
      paragraphs: [
        'Puede ejercer en cualquier momento los siguientes derechos:',
      ],
      list: [
        'Derecho de acceso: conocer qué datos personales tratamos sobre usted',
        'Derecho de rectificación: corregir datos inexactos o incompletos',
        'Derecho de supresión ("derecho al olvido"): solicitar la eliminación de sus datos',
        'Derecho de limitación del tratamiento: en determinadas circunstancias',
        'Derecho de portabilidad: recibir sus datos en formato estructurado',
        'Derecho de oposición: oponerse al tratamiento por motivos legítimos',
        'Derecho a no ser objeto de decisiones automatizadas',
      ],
    },
    {
      heading: '8. Cómo ejercer sus derechos',
      paragraphs: [
        'Para ejercer sus derechos, puede dirigir un escrito a info@abccentre.es o a la dirección postal: Carrer de Malgrat, 47, 08016 Barcelona.',
        'Si considera que el tratamiento de sus datos no es conforme a la normativa vigente, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).',
      ],
    },
    {
      heading: '9. Seguridad',
      paragraphs: [
        'ABC Centre adopta las medidas técnicas y organizativas apropiadas para garantizar la seguridad de sus datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado. El sitio web utiliza conexión segura HTTPS.',
      ],
    },
    {
      heading: '10. Cambios en esta política',
      paragraphs: [
        'Podemos actualizar esta política de privacidad para reflejar cambios en nuestras prácticas o en la normativa vigente. La versión actualizada estará siempre disponible en esta página con la fecha de última modificación.',
      ],
    },
  ],
};

// ─── CA Content ──────────────────────────────────────────────────────────────

const CA_CONTENT = {
  title: 'Política de Privacitat',
  lastUpdated: 'Darrera actualització: maig 2026',
  sections: [
    {
      heading: '1. Responsable del tractament',
      paragraphs: [
        'En compliment del Reglament General de Protecció de Dades (RGPD) i la Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPD-GDD), l\'informem dels termes i condicions del tractament de les seves dades personals per part d\'ABC Centre.',
        'Responsable: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia',
        'Adreça: Carrer de Malgrat, 47, 08016 Barcelona',
        'Correu electrònic: info@abccentre.es',
        'Telèfon: 93 243 48 35',
      ],
    },
    {
      heading: '2. Dades que recopilem',
      paragraphs: [
        'A través del formulari de contacte i sol·licitud de cita, recopilem les dades personals següents:',
      ],
      list: [
        'Nom i cognoms del pacient',
        'Edat del pacient',
        'Nom del familiar o tutor (quan el pacient és menor d\'edat)',
        'Correu electrònic',
        'Número de telèfon',
        'Servei sol·licitat',
        'Motiu de consulta (pot contenir dades de salut)',
        'Data i hora de la cita seleccionada',
      ],
    },
    {
      heading: '3. Finalitat del tractament',
      paragraphs: [
        'Les dades personals facilitades s\'utilitzen exclusivament per a:',
      ],
      list: [
        'Gestionar la seva sol·licitud de primera consulta i agendar la cita al calendari de l\'especialista corresponent',
        'Enviar-li la confirmació de la cita per correu electrònic',
        'Contactar-lo per a modificacions o cancel·lacions de cita',
        'Respondre consultes enviades a través del formulari de contacte',
        'Complir les obligacions legals aplicables en l\'àmbit sanitari',
      ],
    },
    {
      heading: '4. Base jurídica del tractament',
      paragraphs: [
        'El tractament de les seves dades es fonamenta en:',
      ],
      list: [
        'Consentiment de l\'interessat (art. 6.1.a RGPD)',
        'Execució d\'un contracte o mesures precontractuals (art. 6.1.b RGPD)',
        'Compliment d\'una obligació legal (art. 6.1.c RGPD)',
        'Les dades de salut es tracten a l\'empara de l\'art. 9.2.h RGPD (assistència sanitària)',
      ],
    },
    {
      heading: '5. Conservació de les dades',
      paragraphs: [
        'Les dades de contacte i de cita es conserven durant el temps necessari per a la prestació del servei i el compliment de les obligacions legals aplicables.',
        'Les dades relacionades amb l\'atenció sanitària es conserven conforme a la Llei 21/2000 dels drets d\'informació concernent la salut i l\'autonomia del pacient (mínim 5 anys des de la darrera assistència).',
      ],
    },
    {
      heading: '6. Destinataris de les dades',
      paragraphs: [
        'Les seves dades no es cedeixen a tercers, excepte obligació legal. Fem servir els serveis de tercers següents com a encarregats del tractament:',
      ],
      list: [
        'Google LLC (Google Calendar): per a la gestió de l\'agenda de cites',
        'Proveïdors de correu electrònic per a l\'enviament de confirmacions de cita',
      ],
    },
    {
      heading: '7. Drets dels interessats',
      paragraphs: [
        'Pot exercir en qualsevol moment els drets d\'accés, rectificació, supressió, limitació, portabilitat i oposició. Per fer-ho, adreci un escrit a info@abccentre.es o a Carrer de Malgrat, 47, 08016 Barcelona.',
        'Si considera que el tractament de les seves dades no és conforme a la normativa vigent, té dret a presentar una reclamació davant l\'Agència Espanyola de Protecció de Dades (www.aepd.es).',
      ],
    },
    {
      heading: '8. Seguretat',
      paragraphs: [
        'ABC Centre adopta les mesures tècniques i organitzatives apropiades per garantir la seguretat de les seves dades personals. El lloc web utilitza connexió segura HTTPS.',
      ],
    },
  ],
};
