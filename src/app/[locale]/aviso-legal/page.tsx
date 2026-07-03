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
      ? 'Avís Legal — ABC Centre Barcelona'
      : 'Aviso Legal — ABC Centre Barcelona',
    description: isCA
      ? 'Avís legal i condicions d\'ús del lloc web d\'ABC Centre.'
      : 'Aviso legal y condiciones de uso del sitio web de ABC Centre.',
    robots: { index: false, follow: true },
  };
}

export default async function AvisoLegalPage({ params }: Props) {
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
  title: 'Aviso Legal',
  lastUpdated: 'Última actualización: julio 2026',
  sections: [
    {
      heading: '1. Datos identificativos',
      paragraphs: [
        'En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:',
        'Titular: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia',
        'Dirección: Carrer de Malgrat, 47, 08016 Barcelona',
        'Correo electrónico: info@abccentre.es',
        'Teléfono: 93 243 48 35',
        'Sitio web: www.abccentre.es',
        'Para cualquier consulta sobre los datos de identificación completos del titular puede escribir a info@abccentre.es.',
      ],
    },
    {
      heading: '2. Objeto',
      paragraphs: [
        'El presente aviso legal regula el uso del sitio web www.abccentre.es, a través del cual ABC Centre informa sobre sus servicios de logopedia, psicología, psicopedagogia y neuropsicología, y permite a los usuarios solicitar una primera cita o sesión informativa.',
        'El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de las condiciones incluidas en este Aviso Legal.',
      ],
    },
    {
      heading: '3. Condiciones de uso',
      paragraphs: [
        'El usuario se compromete a hacer un uso adecuado y lícito del sitio web, así como de los contenidos y servicios que se ofrecen, de conformidad con la legislación vigente, la buena fe, el orden público y el presente Aviso Legal.',
        'Queda prohibido el uso del sitio web con fines ilícitos o lesivos, o que puedan causar perjuicio o impedir el normal funcionamiento del sitio web.',
      ],
    },
    {
      heading: '4. Propiedad intelectual e industrial',
      paragraphs: [
        'Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño y código fuente) son propiedad de ABC Centre o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.',
        'Queda prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin la autorización expresa de ABC Centre, salvo para uso personal y privado.',
      ],
    },
    {
      heading: '5. Exclusión de responsabilidad',
      paragraphs: [
        'ABC Centre no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de la falta de disponibilidad o continuidad del sitio web, ni de la información publicada cuando esta haya sido manipulada o introducida por un tercero ajeno al mismo.',
        'La información contenida en este sitio web tiene carácter divulgativo y no sustituye en ningún caso la valoración, el diagnóstico o el tratamiento realizado por un profesional sanitario en consulta.',
      ],
    },
    {
      heading: '6. Enlaces externos',
      paragraphs: [
        'El sitio web puede contener enlaces a páginas de terceros (redes sociales, WhatsApp, Google Calendar). ABC Centre no se responsabiliza del contenido ni de las políticas de privacidad de dichos sitios externos.',
      ],
    },
    {
      heading: '7. Legislación aplicable y jurisdicción',
      paragraphs: [
        'Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten a los Juzgados y Tribunales de Barcelona, salvo que la normativa aplicable disponga otra cosa.',
      ],
    },
  ],
};

// ─── CA Content ──────────────────────────────────────────────────────────────

const CA_CONTENT: LegalContent = {
  title: 'Avís Legal',
  lastUpdated: 'Darrera actualització: juliol 2026',
  sections: [
    {
      heading: '1. Dades identificatives',
      paragraphs: [
        'En compliment del deure d\'informació recollit a l\'article 10 de la Llei 34/2002, d\'11 de juliol, de Serveis de la Societat de la Informació i del Comerç Electrònic (LSSI-CE), s\'informa de les dades següents:',
        'Titular: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia',
        'Adreça: Carrer de Malgrat, 47, 08016 Barcelona',
        'Correu electrònic: info@abccentre.es',
        'Telèfon: 93 243 48 35',
        'Lloc web: www.abccentre.es',
        'Per a qualsevol consulta sobre les dades d\'identificació completes del titular pot escriure a info@abccentre.es.',
      ],
    },
    {
      heading: '2. Objecte',
      paragraphs: [
        'Aquest avís legal regula l\'ús del lloc web www.abccentre.es, a través del qual ABC Centre informa sobre els seus serveis de logopèdia, psicologia, psicopedagogia i neuropsicologia, i permet als usuaris sol·licitar una primera cita o sessió informativa.',
        'L\'accés i l\'ús d\'aquest lloc web atribueix la condició d\'usuari i implica l\'acceptació plena de les condicions incloses en aquest Avís Legal.',
      ],
    },
    {
      heading: '3. Condicions d\'ús',
      paragraphs: [
        'L\'usuari es compromet a fer un ús adequat i lícit del lloc web, així com dels continguts i serveis que s\'ofereixen, de conformitat amb la legislació vigent, la bona fe, l\'ordre públic i aquest Avís Legal.',
        'Queda prohibit l\'ús del lloc web amb finalitats il·lícites o lesives, o que puguin causar perjudici o impedir el funcionament normal del lloc web.',
      ],
    },
    {
      heading: '4. Propietat intel·lectual i industrial',
      paragraphs: [
        'Tots els continguts del lloc web (textos, imatges, logotips, disseny i codi font) són propietat d\'ABC Centre o de tercers que n\'han autoritzat l\'ús, i estan protegits per la normativa de propietat intel·lectual i industrial.',
        'Queda prohibida la reproducció, distribució, comunicació pública o transformació d\'aquests continguts sense l\'autorització expressa d\'ABC Centre, excepte per a ús personal i privat.',
      ],
    },
    {
      heading: '5. Exclusió de responsabilitat',
      paragraphs: [
        'ABC Centre no es fa responsable dels danys i perjudicis de qualsevol naturalesa que puguin derivar-se de la manca de disponibilitat o continuïtat del lloc web, ni de la informació publicada quan aquesta hagi estat manipulada o introduïda per un tercer aliè.',
        'La informació continguda en aquest lloc web té caràcter divulgatiu i no substitueix en cap cas la valoració, el diagnòstic o el tractament realitzat per un professional sanitari en consulta.',
      ],
    },
    {
      heading: '6. Enllaços externs',
      paragraphs: [
        'El lloc web pot contenir enllaços a pàgines de tercers (xarxes socials, WhatsApp, Google Calendar). ABC Centre no es responsabilitza del contingut ni de les polítiques de privacitat d\'aquests llocs externs.',
      ],
    },
    {
      heading: '7. Legislació aplicable i jurisdicció',
      paragraphs: [
        'Aquestes condicions es regeixen per la legislació espanyola. Per a la resolució de qualsevol controvèrsia derivada de l\'ús d\'aquest lloc web, les parts se sotmeten als Jutjats i Tribunals de Barcelona, llevat que la normativa aplicable disposi una altra cosa.',
      ],
    },
  ],
};
