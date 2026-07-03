import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isCA = locale === 'ca';
  return {
    title: isCA
      ? 'Política de Cookies — ABC Centre Barcelona'
      : 'Política de Cookies — ABC Centre Barcelona',
    description: isCA
      ? 'Informació sobre l\'ús de cookies al lloc web d\'ABC Centre.'
      : 'Información sobre el uso de cookies en el sitio web de ABC Centre.',
    robots: { index: false, follow: true },
  };
}

export default async function PoliticaCookiesPage({ params }: Props) {
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

const ES_CONTENT: LegalContent = {
  title: 'Política de Cookies',
  lastUpdated: 'Última actualización: julio 2026',
  sections: [
    {
      heading: '1. ¿Qué son las cookies?',
      paragraphs: [
        'Una cookie es un pequeño archivo de texto que un sitio web guarda en el dispositivo del usuario cuando lo visita. Las cookies permiten, entre otras cosas, recordar las preferencias del usuario y facilitar la navegación.',
      ],
    },
    {
      heading: '2. Cookies que utiliza este sitio web',
      paragraphs: [
        'Este sitio web utiliza únicamente cookies técnicas, estrictamente necesarias para su funcionamiento, y no requieren consentimiento previo según la normativa vigente:',
      ],
      list: [
        'Cookie de idioma (NEXT_LOCALE): recuerda si has elegido navegar en castellano o en català, para no tener que seleccionarlo de nuevo en cada visita. Es una cookie propia, de sesión/persistente, sin finalidad publicitaria ni de seguimiento.',
      ],
    },
    {
      heading: '3. Cookies que no utilizamos',
      paragraphs: [
        'Actualmente este sitio web no utiliza cookies de análisis (como Google Analytics), cookies de publicidad ni cookies de redes sociales. No realizamos seguimiento del comportamiento del usuario entre sitios web ni compartimos datos de navegación con terceros con fines publicitarios.',
        'Si en el futuro incorporamos herramientas de analítica o marketing que requieran cookies no esenciales, actualizaremos esta política e implementaremos el correspondiente sistema de consentimiento antes de activarlas.',
      ],
    },
    {
      heading: '4. Cómo gestionar o eliminar las cookies',
      paragraphs: [
        'Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador. Ten en cuenta que si bloqueas la cookie de idioma, el sitio seguirá funcionando con normalidad, aunque no recordará tu preferencia de idioma entre visitas.',
      ],
      list: [
        'Chrome: chrome://settings/cookies',
        'Firefox: about:preferences#privacy',
        'Safari: Preferencias → Privacidad',
        'Edge: edge://settings/privacy',
      ],
    },
    {
      heading: '5. Más información',
      paragraphs: [
        'Para cualquier duda sobre esta Política de Cookies, puedes escribirnos a info@abccentre.es. Para información sobre el tratamiento de tus datos personales, consulta nuestra Política de Privacidad.',
      ],
    },
  ],
};

// ─── CA Content ──────────────────────────────────────────────────────────────

const CA_CONTENT: LegalContent = {
  title: 'Política de Cookies',
  lastUpdated: 'Darrera actualització: juliol 2026',
  sections: [
    {
      heading: '1. Què són les cookies?',
      paragraphs: [
        'Una cookie és un petit arxiu de text que un lloc web desa al dispositiu de l\'usuari quan el visita. Les cookies permeten, entre altres coses, recordar les preferències de l\'usuari i facilitar la navegació.',
      ],
    },
    {
      heading: '2. Cookies que utilitza aquest lloc web',
      paragraphs: [
        'Aquest lloc web utilitza únicament cookies tècniques, estrictament necessàries per al seu funcionament, i no requereixen consentiment previ segons la normativa vigent:',
      ],
      list: [
        'Cookie d\'idioma (NEXT_LOCALE): recorda si has triat navegar en castellà o en català, per no haver-lo de seleccionar de nou a cada visita. És una cookie pròpia, de sessió/persistent, sense finalitat publicitària ni de seguiment.',
      ],
    },
    {
      heading: '3. Cookies que no utilitzem',
      paragraphs: [
        'Actualment aquest lloc web no utilitza cookies d\'anàlisi (com Google Analytics), cookies de publicitat ni cookies de xarxes socials. No realitzem seguiment del comportament de l\'usuari entre llocs web ni compartim dades de navegació amb tercers amb finalitats publicitàries.',
        'Si en el futur incorporem eines d\'analítica o màrqueting que requereixin cookies no essencials, actualitzarem aquesta política i implementarem el sistema de consentiment corresponent abans d\'activar-les.',
      ],
    },
    {
      heading: '4. Com gestionar o eliminar les cookies',
      paragraphs: [
        'Pots permetre, bloquejar o eliminar les cookies instal·lades al teu equip mitjançant la configuració de les opcions del teu navegador. Si bloqueges la cookie d\'idioma, el lloc seguirà funcionant amb normalitat, tot i que no recordarà la teva preferència d\'idioma entre visites.',
      ],
      list: [
        'Chrome: chrome://settings/cookies',
        'Firefox: about:preferences#privacy',
        'Safari: Preferències → Privadesa',
        'Edge: edge://settings/privacy',
      ],
    },
    {
      heading: '5. Més informació',
      paragraphs: [
        'Per a qualsevol dubte sobre aquesta Política de Cookies, ens pots escriure a info@abccentre.es. Per a informació sobre el tractament de les teves dades personals, consulta la nostra Política de Privacitat.',
      ],
    },
  ],
};
