import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import TeamCard from '@/components/TeamCard';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'equipo' });
  return { title: t('meta_title'), description: t('meta_desc') };
}

const DIRECTORS = [
  {
    name: 'Celia Cruz',
    role: 'Codirectora · Logopeda',
    specialty: 'Logopedia infanto-juvenil y adultos',
    initials: 'CC',
    color: 'bg-teal',
    bio: undefined,
  },
  {
    name: 'Laia Álvarez',
    role: 'Codirectora · Psicóloga Gral. Sanitaria · Neuropsicóloga',
    specialty: 'Neuropsicología infantil y adultos, psicopedagogía',
    initials: 'LA',
    color: 'bg-teal',
    bio: 'Soc Laia Álvarez, Psicòloga General Sanitaria, Neuropsicòloga i Pedagoga. Durant molt temps, vaig compaginar la intervenció psicològica infanto-juvenil amb l\'abordatge psicopedagògic, però poc a poc vaig anar continuant la meva formació i especialització en Neuropsicologia. Actualment compagino la direcció i coordinació del Centre ABC amb l\'atenció del dia a dia dels usuaris i la realització d\'avaluacions neuropsicològiques a infants, joves i adults. També continuo treballant amb infants amb necessitats psicopedagògiques. Em considero una professional propera, empàtica i que aconsegueixo vincular amb les persones amb les que treballo, per tal de poder dur a terme així un abordatge proper, personalitzat i adequat a les necessitats de cadascú.',
  },
];

const TEAM = [
  {
    name: 'Laia Lahoz',
    role: 'Logopeda',
    specialty: 'Logopedia infanto-juvenil',
    initials: 'LL',
    bio: 'Sóc la Laia Lahoz, graduada en logopèdia i amb un màster realitzat enfocat en l\'abordatge dels trastorns de l\'aprenentatge. Acompanyo a infants i adolescents adaptant-me a les diferents necessitats, així com les de les famílies que els acompanyen. Considero que la vinculació és molt important, per això sempre intento fer-la de la millor manera possible.',
  },
  {
    name: 'Vanessa de Pedro',
    role: 'Logopeda',
    specialty: 'Logopedia infanto-juvenil y adultos',
    initials: 'VP',
    bio: 'Soc la Vanessa, graduada en Logopèdia i en Educació Primària, amb menció en Pedagogia Terapèutica i Audició i Llenguatge. Acompanyo a infants, adolescents i adults en el seu desenvolupament comunicatiu i lingüístic, adaptant-me a les necessitats individuals de cada persona. Compto amb formació i experiència en atenció precoç, trastorn de l\'espectre autista (TEA), trastorns del llenguatge i parla, i alteracions en la lectoescriptura. També treballo aspectes relacionats amb la motricitat orofacial i els processos de la deglució en totes les edats. Continuo formant-me per oferir una atenció centrada en les necessitats de cada persona.',
  },
  {
    name: 'Noelia Torres',
    role: 'Logopeda',
    specialty: 'Logopedia adultos e infanto-juvenil',
    initials: 'NT',
    bio: 'Soc la Noelia Torres, soc logopeda desde l\'any 2019 tinc menció en la intervenció en l\'àmbit clínic que em dóna el coneixement per abordar patologies i dissenyar tractaments personalitzats en infants i adults. Tinc formació en dificultats dels aprenentatges, el qual m\'ha donat coneixements per realitzar tractaments enfocats a la dislèxia, la disgrafia i altres dificultats d\'aprenentatge. A l\'hora, tinc formació i experiència amb adults, per treballar diferents patologies i dificultats relacionades amb la comunicació, el llenguatge, la respiració i la deglució. Em considero una persona empàtica que sap connectar amb el pacient i augmentar la seva motivació per assolir els objectius els quals volem arribar.',
  },
  {
    name: 'María Andrés',
    role: 'Psicóloga',
    specialty: 'Psicología infanto-juvenil',
    initials: 'MA',
    bio: 'Graduada en Psicología · Máster en Psicología General Sanitaria · Máster en Psicología Infanto-Juvenil',
  },
  {
    name: 'Maria del Mar Aránega',
    role: 'Psicóloga General Sanitaria',
    specialty: 'Psicología infantil, juvenil y adultos',
    initials: 'MM',
    bio: 'Sóc Psicòloga General Sanitària. Al llarg de la meva trajectòria he adquirit experiència en l\'avaluació i intervenció psicològica amb infants, adolescents i les seves famílies, adaptant sempre el treball terapèutic a les necessitats individuals de cada persona. També he realitzat formació en l\'àmbit d\'adults, el que em permet abordar la intervenció psicològica en totes les edats. Una de les àrees en què em sento especialment còmoda és el treball amb adolescents. Considero que tinc facilitat per establir un vincle de confiança amb ells, comprendre les seves necessitats i acompanyar-los en processos relacionats amb la gestió emocional, l\'autoestima, les relacions socials, les dificultats conductuals i els reptes propis d\'aquesta etapa vital. Em defineixo com una professional propera, empàtica i compromesa, que valora el treball coordinat amb les famílies i altres professionals per oferir una atenció integral.',
  },
  {
    name: 'Margot Moreno',
    role: 'Psicóloga General Sanitaria · Neuropsicóloga',
    specialty: 'Psicología infantil, juvenil y adultos',
    initials: 'MR',
    bio: 'Soc Psicòloga General Sanitària i amb formació especialitzada en neuropsicologia, trastorns mentals crònics i intervenció en conducta suïcida. Actualment treballo amb infants, adolescents i adults, acompanyant-los en aquells moments en què les emocions, les dificultats personals o les situacions vitals poden generar malestar. Al llarg de la meva trajectòria he tingut l\'oportunitat de treballar en diferents àmbits de la salut mental, una experiència que m\'ha ajudat a entendre la importància d\'adaptar cada procés terapèutic a les necessitats de la persona que tinc al davant. Per a mi, la teràpia és un espai de confiança, escolta i respecte, on poder sentir-se comprès i acompanyat sense judicis. M\'agrada crear un vincle proper amb cada persona i caminar al seu costat perquè pugui entendre millor el que li està passant, descobrir les seves pròpies eines i avançar cap al benestar que busca. Tinc un especial interès en la prevenció i la intervenció en conducta suïcida, una àrea que m\'apassiona i en la qual m\'he format específicament, perquè crec en la importància d\'oferir un espai segur on poder parlar del patiment i trobar noves formes d\'afrontar-lo.',
  },
  {
    name: 'Silvia Marcó',
    role: 'Psicóloga General Sanitaria · Neuropsicóloga',
    specialty: 'Infantil, adultos, TEA',
    initials: 'SM',
    bio: 'Soc Psicòloga General Sanitaria, amb formació en neuropsicologia i acreditada com a Experta en Neuropsicologia pel COPC. En els darrers anys he obtingut el Doctorat Cum Laude en Psicologia a la Universitat de Barcelona. La meva trajectoria professional va enfocada al treball neuropsicològic i a la intervenció en trastorns de l\'espectre de l\'autisme, motiu pel qual he anat ampliant la meva formació fins haver obtingut la Certificació en el model DENVER d\'Atenció Primerenca, l\'acreditació en l\'entrevista diagnòstica ADI-R pel Trastorn de l\'Espectre Autista i l\'acreditació en l\'administració d\'ADOS-2 pel Trastorn de l\'Espectre Autista. La meva formació m\'ha aportat una mirada clínica rigorosa, integradora i propera. El meu objectiu principal és que l\'avaluació i la intervenció siguin útils, comprensibles i respectuoses, ajudant la persona i el seu entorn a entendre millor el seu funcionament i a disposar d\'eines concretes per afavorir el seu desenvolupament, benestar i autonomia. Considero essencial el treball coordinat amb famílies, escoles i altres professionals, així com oferir orientacions pràctiques i ajustades a cada cas.',
  },
  {
    name: 'Sara Reyes',
    role: 'Psicóloga General Sanitaria · Neuropsicóloga',
    specialty: 'Infantil, adultos, TEA',
    initials: 'SR',
    bio: undefined,
  },
  {
    name: 'Eulàlia Márquez',
    role: 'Psicóloga General Sanitaria',
    specialty: 'Psicología infantil, juvenil y adultos',
    initials: 'EM',
    bio: 'Soc Psicòloga General Sanitària, graduada en Psicologia per la Universitat Ramon Llull. Atenc infants, adolescents i adults, acompanyant persones en diferents moments del seu cicle vital. He desenvolupat la meva pràctica clínica acompanyant persones que travessen situacions de malestar emocional, dificultats personals o relacionals, així com processos de canvi i creixement personal. També he realitzat formació en trastorn mental greu, ampliant els meus coneixements dins l\'àmbit de la salut mental. Entenc la teràpia com un espai segur de confiança, escolta i respecte, on poder comprendre allò que està generant malestar i trobar eines per afrontar les dificultats. Treballo des d\'una perspectiva propera, empàtica i personalitzada, adaptant la intervenció a les necessitats i al ritme de cada persona.',
  },
  {
    name: 'Carla López',
    role: 'Psicopedagoga',
    specialty: 'Trastornos de aprendizaje, máster psicología infanto-juvenil',
    initials: 'CL',
    bio: 'Soc graduada en Mestra d\'educació Primaria, amb els màsters de Psicopedagogia i Psicologia Clínica Infanto-Juvenil, formació que ha orientat la meva trajectòria professional cap a l\'acompanyament emocional, educatiu i familiar. Actualment, continuo la meva formació cursant el Grau de Psicologia. La meva vocació sempre ha estat acompanyar infants i adolescents en el seu procés de creixement i aprenentatge. He exercit durant vuit anys com a professora, una experiència que em va permetre conèixer de prop el desenvolupament infantil, els processos d\'aprenentatge i les necessitats educatives dels infants i adolescents. Com a psicopedagoga, treballo amb infants, adolescents i les seves famílies en aspectes relacionats amb les dificultats d\'aprenentatge, les necessitats educatives, els hàbits d\'estudi, l\'atenció, les funcions executives, la gestió emocional i les habilitats socials. Em defineixo com una professional propera, empàtica i compromesa, que dona molta importància a la creació d\'un vincle de confiança amb els infants i les seves famílies. Considero fonamental adaptar la intervenció a les necessitats de cada persona, potenciant els seus recursos i acompanyant-la en el seu procés de creixement i desenvolupament.',
  },
  {
    name: 'Raisa Pocino',
    role: 'Psicóloga General Sanitaria',
    specialty: 'Infanto-juvenil, TEA',
    initials: 'RP',
    bio: 'Sóc la Raisa Pocino, Psicòloga Infanto-juvenil i Psicòloga General Sanitària. Compto amb formació específica en Trastorn de l\'Espectre de l\'Autisme, havent obtingut el Diploma d\'Especialització en Autisme. El meu objectiu és poder acompanyar infants, adolescents i les seves famílies des d\'una mirada respectuosa i centrada en les seves necessitats. Treballo des d\'una mirada individualitzada i integral, tenint en compte tant les dificultats com les fortaleses de cada infant o jove, amb l\'objectiu d\'afavorir el seu benestar emocional, desenvolupament personal i qualitat de vida.',
  },
  {
    name: 'Elia Huertas',
    role: 'Psicóloga General Sanitaria',
    specialty: 'Infanto-juvenil, adultos, TEA',
    initials: 'EH',
    bio: 'Sóc Psicòloga General Sanitària, amb Màster d\'especialitat en Clínica Psicoanalítica de la Infància i l\'Adolescència. He completat la meva formació amb diferents especialitzacions en salut mental, psicopatologia i atenció infantojuvenil, com són la teràpia familiar, l\'hora del joc, formació en Trastorn de l\'Espectre de l\'Autisme i Llengua de Signes Catalana. D\'altra banda, també compto amb formació específica en l\'àmbit de la sexualitat i la protecció a la infància i l\'adolescència: \'Abuso Sexual Infantil: identificación, actuación y prevención\', realitzat a la Fundació Vicki Bernadet, i el \'Curs d\'Atenció a la Sexualitat en l\'Adolescència\', realitzat al CJAS, Centre Jove d\'Atenció a les Sexualitats. La meva trajectòria professional s\'ha desenvolupat tant en l\'àmbit privat com en diferents dispositius de la xarxa de salut mental pública, treballant amb infants, adolescents, adults i les seves famílies. Treballo des d\'una orientació psicodinàmica, entenent la teràpia com un espai d\'escolta, reflexió i acompanyament que permet comprendre el malestar emocional i potenciar els recursos propis de cada persona. Em defineix una mirada propera, sensible i respectuosa amb la singularitat de cada pacient. Actualment, continuo en formació permanent a través de seminaris de lectura teòrica entorn de la intervenció i la clínica.',
  },
];

const DISCIPLINES = [
  { name: 'Logopedia',       count: 4,  color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicología',      count: 8,  color: 'bg-lime/20 text-ink border-lime/30' },
  { name: 'Neuropsicología', count: 4,  color: 'bg-teal/10 text-teal border-teal/20' },
  { name: 'Psicopedagogia',  count: 1,  color: 'bg-lime/20 text-ink border-lime/30' },
];

export default function EquipoPage() {
  const t = useTranslations('equipo');

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">ABC Centre</p>
          <h1 className="text-display font-outfit font-semibold text-ink mb-4">{t('h1')}</h1>
          <p className="text-lg font-outfit font-light text-gray max-w-2xl mx-auto mb-6">{t('subtitle')}</p>

          <div className="flex flex-wrap justify-center gap-3">
            {DISCIPLINES.map((d) => (
              <span key={d.name} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${d.color}`}>
                {d.name} · {d.count}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base font-outfit font-light text-gray leading-relaxed animate-on-scroll">{t('intro')}</p>
        </div>
      </section>

      {/* Directors */}
      <section className="py-12 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('directors_title')}</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {DIRECTORS.map((member, i) => (
              <div key={member.name} className="animate-on-scroll" style={{ animationDelay: `${i * 100}ms` }}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  specialty={member.specialty}
                  initials={member.initials}
                  bio={member.bio}
                  color={member.color}
                  large
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title animate-on-scroll">{t('team_title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {TEAM.map((member, i) => (
              <div key={member.name} className="animate-on-scroll" style={{ animationDelay: `${i * 60}ms` }}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  specialty={member.specialty}
                  initials={member.initials}
                  bio={member.bio}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="unete" className="py-16 bg-teal text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-h2 font-outfit font-semibold text-white mb-4 animate-on-scroll">
            {t('join_title')}
          </h2>
          <p className="text-white/70 font-light mb-8 animate-on-scroll">
            {t('join_body')}
          </p>
          <a
            href="mailto:info@abccentre.es?subject=Candidatura%20espontanea"
            className="inline-flex items-center gap-2 px-8 py-4 bg-lime text-ink font-outfit font-semibold rounded-xl hover:bg-lime-dark transition-all animate-on-scroll"
          >
            {t('join_cta')}
          </a>
        </div>
      </section>
    </>
  );
}
