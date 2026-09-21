import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

/**
 * Condiciones de contratación.
 *
 * Hacen falta desde que la web cobra por adelantado las sesiones online
 * (ver docs/STRIPE-MODO-PRUEBA.md). Mismo formato que el aviso legal y las
 * políticas: el texto vive aquí, no en los ficheros de traducción, porque es
 * texto legal que se revisa entero y de una vez, no cadena a cadena.
 *
 * OJO: texto redactado por Rankova — ABC no tiene gestoría ni asesoría legal,
 * así que nadie lo ha revisado jurídicamente. Lo que queda entre corchetes son
 * datos que solo tiene ABC (titular, NIF, número de autorización sanitaria) y
 * una decisión sin tomar (duración del crédito por cancelación tardía). No
 * publicar con los corchetes puestos.
 */

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
      ? 'Condicions de contractació — ABC Centre Barcelona'
      : 'Condiciones de contratación — ABC Centre Barcelona',
    description: isCA
      ? "Condicions de contractació dels serveis d'ABC Centre: preus, pagament, cancel·lacions i devolucions."
      : 'Condiciones de contratación de los servicios de ABC Centre: precios, pago, cancelaciones y devoluciones.',
    robots: { index: false, follow: true },
  };
}

export default async function CondicionesContratacionPage({ params }: Props) {
  const { locale } = await params;
  const isCA = locale === 'ca';

  const content = isCA ? CA_CONTENT : ES_CONTENT;

  return (
    <>
      <section className="bg-cream pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-light text-gray hover:text-teal transition-colors mb-6 inline-block">
            ← {isCA ? "Tornar a l'inici" : 'Volver al inicio'}
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
  title: 'Condiciones de contratación',
  lastUpdated: 'Última actualización: [fecha]',
  sections: [
    {
      heading: '1. Datos identificativos',
      paragraphs: [
        'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa de los siguientes datos:',
      ],
      list: [
        'Titular: [denominación social completa], con NIF [NIF/CIF].',
        'Nombre comercial: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia.',
        'Domicilio: Carrer de Malgrat, 47, 08016 Barcelona.',
        'Correo electrónico: info@abccentre.es. Teléfono: 93 243 48 35.',
        'Sitio web: www.abccentre.es',
        'Centro sanitario inscrito en el Registro de centros, servicios y establecimientos sanitarios de la Generalitat de Catalunya con el número [número de autorización sanitaria].',
      ],
    },
    {
      heading: '2. Objeto y aceptación',
      paragraphs: [
        'Las presentes condiciones regulan la contratación a distancia, a través del sitio web www.abccentre.es, de los servicios asistenciales prestados por ABC Centre: sesiones de logopedia, psicología, psicopedagogía y neuropsicología, tanto presenciales como en línea, así como los bonos y packs de valoración ofrecidos.',
        'Al reservar una cita o abonar un servicio a través del sitio web, el usuario declara haber leído y aceptado estas condiciones. Se recomienda guardarlas o imprimirlas; el correo de confirmación incluye un enlace a la versión vigente.',
      ],
    },
    {
      heading: '3. Capacidad y destinatarios',
      paragraphs: [
        'Para contratar es necesario ser mayor de 18 años y tener capacidad legal para ello. Cuando el servicio se destine a una persona menor de edad o con la capacidad modificada judicialmente, la reserva la realizará su madre, padre, tutor o representante legal, que responderá de la veracidad de los datos facilitados y prestará el consentimiento necesario para la intervención.',
        'Los servicios ofrecidos son de carácter asistencial y programado. No constituyen un servicio de urgencias. Ante una situación de urgencia debe llamarse al 112 o acudirse al servicio de urgencias más cercano.',
      ],
    },
    {
      heading: '4. Servicios, precios e impuestos',
      paragraphs: [
        'Los precios aplicables son los publicados en la página de tarifas del sitio web en el momento de realizar la reserva, expresados en euros.',
        'Los servicios de asistencia sanitaria prestados por profesionales sanitarios están exentos de IVA conforme al artículo 20.Uno.3.º de la Ley 37/1992, del Impuesto sobre el Valor Añadido. Los precios mostrados son, por tanto, precios finales.',
        'A través del sitio web se abonan por adelantado únicamente los siguientes servicios:',
      ],
      list: [
        'Primera sesión de psicología en línea: 60 €.',
        'Bono de 4 sesiones de psicología de adultos en línea: 220 €.',
      ],
    },
    {
      heading: '5. Proceso de contratación',
      paragraphs: [
        'El resto de servicios puede reservarse a través del sitio web y se abona presencialmente en el centro. ABC Centre se reserva el derecho a modificar sus precios en cualquier momento; la modificación no afectará a las reservas ya confirmadas y pagadas.',
        'La contratación se realiza seleccionando el servicio, el tipo de sesión y uno de los horarios disponibles; cumplimentando el formulario con los datos de contacto y, en su caso, los de la persona destinataria del servicio; y, en los servicios de pago anticipado, abonando el importe con tarjeta en la pasarela de pago. Mientras el pago está en curso, el horario elegido queda reservado durante un tiempo limitado.',
        'Confirmado el pago, el usuario recibe en el correo electrónico facilitado la confirmación con el día, la hora, la modalidad y la profesional asignada. El contrato se entiende perfeccionado con la confirmación del pago. Si el pago no se completa en el plazo indicado por la pasarela, la reserva decae automáticamente y el horario vuelve a ofrecerse.',
        'El contrato se formaliza en castellano o en catalán, según el idioma elegido por el usuario en el sitio web. ABC Centre conserva constancia electrónica de la contratación; el usuario puede solicitar una copia escribiendo a info@abccentre.es.',
      ],
    },
    {
      heading: '6. Formas de pago',
      paragraphs: [
        'El pago en línea se realiza mediante tarjeta bancaria a través de la pasarela de pago de Stripe Payments Europe, Ltd. ABC Centre no almacena ni tiene acceso a los datos completos de la tarjeta: son tratados directamente por el proveedor de pago conforme a sus propias condiciones y a los estándares de seguridad del sector.',
        'La operación puede requerir la autenticación reforzada del titular de la tarjeta exigida por su entidad bancaria. Si la autorización es denegada, la reserva no llega a confirmarse.',
        'Los servicios que no se abonan a través del sitio web se pagan en el centro por los medios admitidos en recepción.',
      ],
    },
    {
      heading: '7. Sesiones en línea',
      paragraphs: [
        'Las sesiones en línea se realizan por videollamada, mediante el sistema que la profesional indique en el correo de confirmación. El usuario necesita conexión a internet estable, un dispositivo con cámara y micrófono y un espacio privado donde poder hablar con tranquilidad.',
        'La atención en línea no resulta adecuada para todos los casos. Si la profesional valora que el caso requiere atención presencial o una derivación, se propondrá al usuario el cambio de modalidad sin coste adicional o, si el servicio no puede prestarse, la devolución del importe abonado.',
        'Queda prohibida la grabación de las sesiones, total o parcial, por cualquiera de las partes, sin el consentimiento expreso y por escrito de la otra.',
        'Si la sesión no puede desarrollarse por un fallo técnico atribuible al centro, se reprograma sin coste o se devuelve íntegramente el importe. Si el impedimento se produce en el lado del usuario, se aplica el régimen de cancelaciones del apartado siguiente.',
      ],
    },
    {
      heading: '8. Cancelaciones, cambios de hora y no asistencia',
      paragraphs: [
        'El usuario puede cancelar o cambiar su cita comunicándolo por teléfono (93 243 48 35) o por correo electrónico (info@abccentre.es), con los siguientes efectos:',
      ],
      list: [
        'Con 24 horas o más de antelación: devolución íntegra del importe abonado o reprogramación de la cita sin coste, a elección del usuario.',
        'Entre 24 horas y 1 hora antes de la cita: no se devuelve el importe, que queda a favor del usuario como crédito canjeable por otra sesión del mismo tipo durante los [3 meses] siguientes.',
        'Con menos de 1 hora de antelación o en caso de no presentarse: no se devuelve el importe ni genera crédito, al haberse reservado en exclusiva el tiempo de la profesional.',
      ],
    },
    {
      heading: '9. Cancelación por parte del centro',
      paragraphs: [
        'Cuando sea ABC Centre quien deba cancelar o aplazar una cita, se ofrecerá al usuario una nueva fecha o la devolución íntegra del importe, a su elección.',
        'Lo previsto en el apartado anterior y en este se entiende sin perjuicio del derecho de desistimiento reconocido en el apartado 11.',
      ],
    },
    {
      heading: '10. Bonos y packs de valoración',
      paragraphs: [
        'Los bonos y packs adquiridos tienen la siguiente validez, contada desde la fecha de la primera sesión realizada:',
      ],
      list: [
        'Bonos de 4 sesiones: 2 meses.',
        'Packs de valoración: 6 meses.',
      ],
    },
    {
      heading: '11. Derecho de desistimiento',
      paragraphs: [
        'Transcurrido el plazo de validez, las sesiones no utilizadas caducan y no son canjeables ni reembolsables, salvo causa justificada y acreditada (enfermedad, hospitalización u otra circunstancia análoga), en cuyo caso ABC Centre podrá ampliar el plazo. Los bonos y packs son personales e intransferibles, y la interrupción voluntaria del tratamiento antes de agotar las sesiones contratadas no da derecho a la devolución de las sesiones no utilizadas.',
        'Al tratarse de un contrato celebrado a distancia, el usuario que actúe como consumidor dispone de 14 días naturales desde la celebración del contrato para desistir de él sin necesidad de justificación y sin penalización, conforme a los artículos 102 y siguientes del Real Decreto Legislativo 1/2007, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.',
        'Para ejercerlo basta con comunicarlo de forma inequívoca a info@abccentre.es, pudiendo utilizarse el modelo de formulario de desistimiento que figura en el anexo B de dicha norma.',
        'Si el usuario solicita expresamente que la prestación comience dentro del plazo de desistimiento —por ejemplo, porque la cita es en los días inmediatamente siguientes— y el servicio se ejecuta por completo, pierde el derecho de desistimiento una vez ejecutado, habiendo sido informado previamente de ello. Si desiste cuando la prestación ya ha comenzado pero no ha concluido, deberá abonar el importe proporcional al servicio ya prestado.',
        'Fuera de estos supuestos, ABC Centre devolverá el importe recibido en un plazo máximo de 14 días naturales desde que tenga constancia del desistimiento, por el mismo medio de pago empleado en la compra.',
      ],
    },
    {
      heading: '12. Devoluciones: forma y plazos',
      paragraphs: [
        'Las devoluciones se efectúan siempre por el mismo medio de pago utilizado en la compra y a favor del titular de la tarjeta con la que se abonó el servicio.',
        'Una vez ordenada la devolución por ABC Centre, el abono puede tardar entre 5 y 10 días hábiles en quedar reflejado en la cuenta del usuario, en función de la entidad emisora de la tarjeta, sin que ese plazo dependa del centro.',
      ],
    },
    {
      heading: '13. Facturación',
      paragraphs: [
        'ABC Centre emite factura o justificante de los servicios prestados, con la mención de exención de IVA que corresponda. El usuario que precise factura con sus datos fiscales puede solicitarla en info@abccentre.es indicando dichos datos. El justificante del cargo emitido por la pasarela de pago acredita el pago, pero no sustituye a la factura.',
      ],
    },
    {
      heading: '14. Protección de datos y confidencialidad',
      paragraphs: [
        'Los datos personales facilitados se tratan conforme al Reglamento (UE) 2016/679 y a la Ley Orgánica 3/2018, en los términos detallados en la Política de Privacidad del sitio web.',
        'Los datos relativos a la salud tienen la consideración de categoría especial y se tratan con la única finalidad de prestar la asistencia contratada, con sujeción al deber de secreto profesional que vincula a las profesionales del centro. La documentación clínica se conserva conforme a la Ley 41/2002, básica reguladora de la autonomía del paciente, y a la Ley 21/2000 de Cataluña sobre los derechos de información relativos a la salud.',
      ],
    },
    {
      heading: '15. Obligaciones del usuario',
      paragraphs: [
        'El usuario se compromete a facilitar datos veraces y actualizados, a comunicar cualquier información relevante para la correcta prestación del servicio, a respetar los horarios acordados y a tratar con respeto a las profesionales del centro.',
        'ABC Centre podrá dar por finalizada la prestación, devolviendo el importe correspondiente a los servicios no prestados, cuando concurran circunstancias que impidan la continuidad de la atención en condiciones adecuadas.',
      ],
    },
    {
      heading: '16. Atención al cliente y reclamaciones',
      paragraphs: [
        'Cualquier queja, reclamación o incidencia puede dirigirse a info@abccentre.es o al teléfono 93 243 48 35. ABC Centre acusará recibo y responderá en el plazo más breve posible y, en todo caso, en el plazo máximo de un mes.',
        'El centro dispone de hojas oficiales de queja, reclamación y denuncia a disposición de los usuarios, conforme a la normativa de consumo de Cataluña. El usuario puede dirigirse asimismo a la Agència Catalana del Consum o a la Oficina Municipal de Información al Consumidor de su municipio.',
      ],
    },
    {
      heading: '17. Modificación de las condiciones, legislación aplicable y jurisdicción',
      paragraphs: [
        'ABC Centre puede modificar estas condiciones en cualquier momento. A cada contratación se le aplican las condiciones vigentes y publicadas en el momento de realizar la reserva.',
        'Las presentes condiciones se rigen por la legislación española. En los contratos celebrados con consumidores serán competentes los juzgados y tribunales que determine la normativa de protección de los consumidores, que con carácter general es la del domicilio del consumidor. La nulidad de alguna de estas cláusulas no afectará a la validez del resto.',
      ],
    },
  ],
};

// ─── CA Content ──────────────────────────────────────────────────────────────

const CA_CONTENT: LegalContent = {
  title: 'Condicions de contractació',
  lastUpdated: 'Darrera actualització: [data]',
  sections: [
    {
      heading: '1. Dades identificatives',
      paragraphs: [
        "En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i de comerç electrònic, s'informa de les dades següents:",
      ],
      list: [
        'Titular: [denominació social completa], amb NIF [NIF/CIF].',
        'Nom comercial: ABC Centre de Logopèdia, Psicologia, Psicopedagogia i Neuropsicologia.',
        'Domicili: Carrer de Malgrat, 47, 08016 Barcelona.',
        'Adreça electrònica: info@abccentre.es. Telèfon: 93 243 48 35.',
        'Lloc web: www.abccentre.es',
        "Centre sanitari inscrit al Registre de centres, serveis i establiments sanitaris de la Generalitat de Catalunya amb el número [número d'autorització sanitària].",
      ],
    },
    {
      heading: '2. Objecte i acceptació',
      paragraphs: [
        'Aquestes condicions regulen la contractació a distància, a través del lloc web www.abccentre.es, dels serveis assistencials prestats per ABC Centre: sessions de logopèdia, psicologia, psicopedagogia i neuropsicologia, tant presencials com en línia, així com els bons i packs de valoració oferts.',
        "En reservar una cita o abonar un servei a través del lloc web, l'usuari declara haver llegit i acceptat aquestes condicions. Es recomana desar-les o imprimir-les; el correu de confirmació inclou un enllaç a la versió vigent.",
      ],
    },
    {
      heading: '3. Capacitat i destinataris',
      paragraphs: [
        "Per contractar cal ser major de 18 anys i tenir-ne capacitat legal. Quan el servei es destini a una persona menor d'edat o amb la capacitat modificada judicialment, la reserva l'ha de fer la mare, el pare, el tutor o el representant legal, que respondrà de la veracitat de les dades facilitades i prestarà el consentiment necessari per a la intervenció.",
        "Els serveis oferts són de caràcter assistencial i programat. No constitueixen un servei d'urgències. Davant d'una situació d'urgència cal trucar al 112 o adreçar-se al servei d'urgències més proper.",
      ],
    },
    {
      heading: '4. Serveis, preus i impostos',
      paragraphs: [
        'Els preus aplicables són els publicats a la pàgina de tarifes del lloc web en el moment de fer la reserva, expressats en euros.',
        "Els serveis d'assistència sanitària prestats per professionals sanitaris estan exempts d'IVA d'acord amb l'article 20.U.3r de la Llei 37/1992, de l'impost sobre el valor afegit. Els preus mostrats són, doncs, preus finals.",
        "A través del lloc web només s'abonen per avançat els serveis següents:",
      ],
      list: [
        'Primera sessió de psicologia en línia: 60 €.',
        "Bo de 4 sessions de psicologia d'adults en línia: 220 €.",
      ],
    },
    {
      heading: '5. Procés de contractació',
      paragraphs: [
        "La resta de serveis es poden reservar a través del lloc web i s'abonen presencialment al centre. ABC Centre es reserva el dret de modificar els seus preus en qualsevol moment; la modificació no afectarà les reserves ja confirmades i pagades.",
        "La contractació es fa seleccionant el servei, el tipus de sessió i un dels horaris disponibles; emplenant el formulari amb les dades de contacte i, si escau, les de la persona destinatària del servei; i, en els serveis de pagament anticipat, abonant l'import amb targeta a la passarel·la de pagament. Mentre el pagament és en curs, l'horari triat queda reservat durant un temps limitat.",
        "Un cop confirmat el pagament, l'usuari rep al correu electrònic facilitat la confirmació amb el dia, l'hora, la modalitat i la professional assignada. El contracte es perfecciona amb la confirmació del pagament. Si el pagament no es completa dins el termini indicat per la passarel·la, la reserva decau automàticament i l'horari torna a oferir-se.",
        "El contracte es formalitza en català o en castellà, segons l'idioma triat per l'usuari al lloc web. ABC Centre conserva constància electrònica de la contractació; l'usuari en pot demanar una còpia escrivint a info@abccentre.es.",
      ],
    },
    {
      heading: '6. Formes de pagament',
      paragraphs: [
        "El pagament en línia es fa amb targeta bancària a través de la passarel·la de pagament de Stripe Payments Europe, Ltd. ABC Centre no emmagatzema ni té accés a les dades completes de la targeta: les tracta directament el proveïdor de pagament, d'acord amb les seves pròpies condicions i amb els estàndards de seguretat del sector.",
        "L'operació pot requerir l'autenticació reforçada del titular de la targeta que exigeixi la seva entitat bancària. Si l'autorització és denegada, la reserva no arriba a confirmar-se.",
        "Els serveis que no s'abonen a través del lloc web es paguen al centre pels mitjans admesos a recepció.",
      ],
    },
    {
      heading: '7. Sessions en línia',
      paragraphs: [
        "Les sessions en línia es fan per videotrucada, mitjançant el sistema que la professional indiqui al correu de confirmació. L'usuari necessita connexió a internet estable, un dispositiu amb càmera i micròfon i un espai privat on pugui parlar amb tranquil·litat.",
        "L'atenció en línia no és adequada per a tots els casos. Si la professional valora que el cas requereix atenció presencial o una derivació, es proposarà a l'usuari el canvi de modalitat sense cost addicional o, si el servei no es pot prestar, la devolució de l'import abonat.",
        "Queda prohibida la gravació de les sessions, total o parcial, per qualsevol de les parts, sense el consentiment exprés i per escrit de l'altra.",
        "Si la sessió no es pot desenvolupar per una fallada tècnica atribuïble al centre, es reprograma sense cost o es retorna íntegrament l'import. Si l'impediment es produeix a la banda de l'usuari, s'aplica el règim de cancel·lacions de l'apartat següent.",
      ],
    },
    {
      heading: "8. Cancel·lacions, canvis d'hora i no assistència",
      paragraphs: [
        "L'usuari pot cancel·lar o canviar la seva cita comunicant-ho per telèfon (93 243 48 35) o per correu electrònic (info@abccentre.es), amb els efectes següents:",
      ],
      list: [
        "Amb 24 hores o més d'antelació: devolució íntegra de l'import abonat o reprogramació de la cita sense cost, a elecció de l'usuari.",
        "Entre 24 hores i 1 hora abans de la cita: no es retorna l'import, que queda a favor de l'usuari com a crèdit bescanviable per una altra sessió del mateix tipus durant els [3 mesos] següents.",
        "Amb menys d'1 hora d'antelació o en cas de no presentar-se: no es retorna l'import ni genera crèdit, pel fet d'haver reservat en exclusiva el temps de la professional.",
      ],
    },
    {
      heading: '9. Cancel·lació per part del centre',
      paragraphs: [
        "Quan sigui ABC Centre qui hagi de cancel·lar o ajornar una cita, s'oferirà a l'usuari una nova data o la devolució íntegra de l'import, a la seva elecció.",
        "El que preveuen l'apartat anterior i aquest s'entén sense perjudici del dret de desistiment reconegut a l'apartat 11.",
      ],
    },
    {
      heading: '10. Bons i packs de valoració',
      paragraphs: [
        'Els bons i packs adquirits tenen la validesa següent, comptada des de la data de la primera sessió feta:',
      ],
      list: [
        'Bons de 4 sessions: 2 mesos.',
        'Packs de valoració: 6 mesos.',
      ],
    },
    {
      heading: '11. Dret de desistiment',
      paragraphs: [
        "Un cop transcorregut el termini de validesa, les sessions no utilitzades caduquen i no són bescanviables ni reemborsables, llevat de causa justificada i acreditada (malaltia, hospitalització o una altra circumstància anàloga), cas en què ABC Centre podrà ampliar el termini. Els bons i packs són personals i intransferibles, i la interrupció voluntària del tractament abans d'exhaurir les sessions contractades no dona dret a la devolució de les sessions no utilitzades.",
        "Per tractar-se d'un contracte fet a distància, l'usuari que actuï com a consumidor disposa de 14 dies naturals des de la celebració del contracte per desistir-ne sense necessitat de justificació i sense penalització, d'acord amb els articles 102 i següents del Reial decret legislatiu 1/2007, pel qual s'aprova el text refós de la Llei general per a la defensa dels consumidors i usuaris.",
        "Per exercir-lo n'hi ha prou amb comunicar-ho de manera inequívoca a info@abccentre.es, i es pot fer servir el model de formulari de desistiment que figura a l'annex B d'aquesta norma.",
        "Si l'usuari demana expressament que la prestació comenci dins el termini de desistiment —per exemple, perquè la cita és els dies immediatament següents— i el servei s'executa completament, perd el dret de desistiment un cop executat, havent-ne estat informat prèviament. Si desisteix quan la prestació ja ha començat però no ha acabat, haurà d'abonar l'import proporcional al servei ja prestat.",
        "Fora d'aquests supòsits, ABC Centre retornarà l'import rebut en un termini màxim de 14 dies naturals des que tingui constància del desistiment, pel mateix mitjà de pagament emprat en la compra.",
      ],
    },
    {
      heading: '12. Devolucions: forma i terminis',
      paragraphs: [
        'Les devolucions es fan sempre pel mateix mitjà de pagament utilitzat en la compra i a favor del titular de la targeta amb què es va abonar el servei.',
        "Un cop ABC Centre ha ordenat la devolució, l'abonament pot trigar entre 5 i 10 dies hàbils a quedar reflectit al compte de l'usuari, en funció de l'entitat emissora de la targeta, sense que aquest termini depengui del centre.",
      ],
    },
    {
      heading: '13. Facturació',
      paragraphs: [
        "ABC Centre emet factura o justificant dels serveis prestats, amb la menció d'exempció d'IVA que correspongui. L'usuari que necessiti factura amb les seves dades fiscals la pot demanar a info@abccentre.es indicant-les. El justificant del càrrec emès per la passarel·la de pagament acredita el pagament, però no substitueix la factura.",
      ],
    },
    {
      heading: '14. Protecció de dades i confidencialitat',
      paragraphs: [
        "Les dades personals facilitades es tracten d'acord amb el Reglament (UE) 2016/679 i amb la Llei orgànica 3/2018, en els termes detallats a la Política de Privacitat del lloc web.",
        "Les dades relatives a la salut tenen la consideració de categoria especial i es tracten amb l'única finalitat de prestar l'assistència contractada, subjectes al deure de secret professional que vincula les professionals del centre. La documentació clínica es conserva d'acord amb la Llei 41/2002, bàsica reguladora de l'autonomia del pacient, i amb la Llei 21/2000 de Catalunya sobre els drets d'informació relatius a la salut.",
      ],
    },
    {
      heading: "15. Obligacions de l'usuari",
      paragraphs: [
        "L'usuari es compromet a facilitar dades veraces i actualitzades, a comunicar qualsevol informació rellevant per a la correcta prestació del servei, a respectar els horaris acordats i a tractar amb respecte les professionals del centre.",
        "ABC Centre podrà donar per finalitzada la prestació, retornant l'import corresponent als serveis no prestats, quan concorrin circumstàncies que impedeixin la continuïtat de l'atenció en condicions adequades.",
      ],
    },
    {
      heading: '16. Atenció al client i reclamacions',
      paragraphs: [
        "Qualsevol queixa, reclamació o incidència es pot adreçar a info@abccentre.es o al telèfon 93 243 48 35. ABC Centre n'acusarà recepció i respondrà en el termini més breu possible i, en tot cas, en el termini màxim d'un mes.",
        "El centre disposa de fulls oficials de queixa, reclamació i denúncia a disposició dels usuaris, d'acord amb la normativa de consum de Catalunya. L'usuari també es pot adreçar a l'Agència Catalana del Consum o a l'Oficina Municipal d'Informació al Consumidor del seu municipi.",
      ],
    },
    {
      heading: '17. Modificació de les condicions, legislació aplicable i jurisdicció',
      paragraphs: [
        'ABC Centre pot modificar aquestes condicions en qualsevol moment. A cada contractació s\'hi apliquen les condicions vigents i publicades en el moment de fer la reserva.',
        "Aquestes condicions es regeixen per la legislació espanyola. En els contractes fets amb consumidors seran competents els jutjats i tribunals que determini la normativa de protecció dels consumidors, que amb caràcter general és la del domicili del consumidor. La nul·litat d'alguna d'aquestes clàusules no afectarà la validesa de la resta.",
      ],
    },
  ],
};
