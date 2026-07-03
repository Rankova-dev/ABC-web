/**
 * ABC Centre — Artículos del blog
 *
 * Contenido migrado y reescrito a partir del blog original (abccentre.es),
 * estructurado por bloques para poder maquetarlo de forma semántica (h2, listas)
 * y optimizado para SEO (slugs descriptivos, meta tags, related service).
 */

import type { Service } from '@/config/specialists';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export interface BlogPostLocaleContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  body: BlogBlock[];
}

export interface BlogPost {
  slug: string;
  coverImage: string;
  coverAlt: { es: string; ca: string };
  publishedDate: string;
  relatedService: Service;
  es: BlogPostLocaleContent;
  ca: BlogPostLocaleContent;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'autismo-en-ninas',
    coverImage: '/images/blog/autismo-cover.webp',
    coverAlt: {
      es: 'Niña jugando tranquila en una habitación luminosa',
      ca: 'Nena jugant tranquil·la en una habitació lluminosa',
    },
    publishedDate: '2026-04-14',
    relatedService: 'tea',
    es: {
      title: 'Autismo en niñas: por qué pasa desapercibido y cómo identificarlo',
      metaTitle: 'Autismo en niñas: señales que pasan desapercibidas — ABC Centre',
      metaDescription: '¿Por qué el autismo en niñas se diagnostica más tarde que en niños? Te explicamos las señales sutiles del TEA femenino y cómo podemos ayudarte a identificarlo en Barcelona.',
      excerpt: 'Te contamos por qué nadie habla del autismo en niñas y te ayudamos a identificarlo.',
      body: [
        { type: 'p', text: 'Durante años, el autismo ha sido un campo de estudio centrado principalmente en niños. Esto ha provocado que exista una imagen muy concreta de cómo debe ser una persona con Trastorno del Espectro Autista (TEA). Pero, ¿por qué las niñas no encajan en este perfil?' },
        { type: 'p', text: 'Muchas niñas con autismo pasan desapercibidas durante años. No porque no tengan dificultades, sino porque **sus características son diferentes y, en muchos casos, más sutiles**. Como consecuencia, es frecuente que reciban un diagnóstico tardío o incluso erróneo.' },
        { type: 'h2', text: '¿Por qué el autismo en niñas es menos visible?' },
        { type: 'p', text: 'Una de las principales razones es que el modelo tradicional del autismo está basado en estudios realizados mayoritariamente en niños. Esto, de alguna manera, ha dejado fuera muchas formas de expresión del TEA más comunes en niñas.' },
        { type: 'p', text: 'Además, muchas niñas desarrollan una notable capacidad de **camuflaje social (masking)**. Esto significa que observan, imitan y aprenden comportamientos sociales para encajar en su entorno. Son capaces de:' },
        { type: 'ul', items: [
          'Copiar expresiones faciales',
          'Ensayar conversaciones mentalmente',
          'Forzarse a mantener contacto visual',
          'Adaptarse a lo que se espera de ellas',
        ]},
        { type: 'p', text: 'A simple vista, esto puede hacer que "todo parezca normal". Sin embargo, este esfuerzo constante puede **generar cansancio, ansiedad y una gran desconexión interna**. No es que haya menos niñas con autismo, es que se identifican menos.' },
        { type: 'h2', text: 'Señales de autismo en niñas que pueden pasar desapercibidas' },
        { type: 'p', text: 'Las características del TEA en niñas suelen ser más sutiles y, en ocasiones, socialmente aceptadas, lo que dificulta su detección. Algunas señales a tener en cuenta son:' },
        { type: 'ul', items: [
          'Dificultades en la interacción social, aunque tengan amigas.',
          'Tendencia a imitar a otras niñas para saber cómo comportarse.',
          'Intereses muy profundos (animales, lectura, series, temas concretos…).',
          'Amistades intensas, absorbentes o inestables.',
          'Necesidad de rutina, aunque intenten ocultarla.',
          'Alta sensibilidad emocional o sensorial (ruidos, luces, texturas…).',
        ]},
        { type: 'p', text: 'En muchos casos, estas niñas son descritas como "tímidas", "muy sensibles" o "perfeccionistas". Pero detrás de esas etiquetas puede haber una dificultad real para comprender y gestionar el entorno social.' },
        { type: 'h2', text: 'Consecuencias de no detectarlo a tiempo' },
        { type: 'p', text: 'Cuando el autismo no se identifica, las niñas crecen sin entender por qué se sienten diferentes. Esto puede derivar en:' },
        { type: 'ul', items: [
          'Baja autoestima.',
          'Ansiedad.',
          'Depresión.',
          'Sensación constante de no encajar.',
          'Agotamiento emocional por el esfuerzo de adaptarse.',
        ]},
        { type: 'p', text: 'Muchas niñas aprenden a "funcionar" de cara al exterior, pero internamente viven con una pesada carga emocional. No es raro que el diagnóstico llegue en la adolescencia o incluso en la edad adulta.' },
        { type: 'h2', text: '¿Cómo podemos ayudar?' },
        { type: 'p', text: 'Detectar y comprender el autismo en niñas es clave para poder ofrecer un acompañamiento adecuado. Algunas pautas importantes son:' },
        { type: 'ul', items: [
          'Validar sus emociones.',
          'No forzar la socialización.',
          'Respetar sus intereses.',
          'Crear entornos predecibles.',
          'Acompañar sin exigir "normalidad".',
          'Consultar con profesionales especializados en TEA.',
        ]},
        { type: 'p', text: 'Las niñas con autismo no están fallando. No son "demasiado sensibles" ni "exageradas". Simplemente, hemos aprendido a mirar el autismo desde una única perspectiva. Y es momento de cambiar eso: porque cuando empezamos a verlas de verdad, también empezamos a comprenderlas.' },
      ],
    },
    ca: {
      title: 'Autisme en nenes: per què passa desapercebut i com identificar-lo',
      metaTitle: 'Autisme en nenes: senyals que passen desapercebudes — ABC Centre',
      metaDescription: 'Per què l\'autisme en nenes es diagnostica més tard que en nens? T\'expliquem els senyals subtils del TEA femení i com podem ajudar-te a identificar-lo a Barcelona.',
      excerpt: 'T\'expliquem per què ningú parla de l\'autisme en nenes i t\'ajudem a identificar-lo.',
      body: [
        { type: 'p', text: 'Durant anys, l\'autisme ha estat un camp d\'estudi centrat principalment en nens. Això ha provocat que existeixi una imatge molt concreta de com ha de ser una persona amb Trastorn de l\'Espectre Autista (TEA). Però, per què les nenes no encaixen en aquest perfil?' },
        { type: 'p', text: 'Moltes nenes amb autisme passen desapercebudes durant anys. No perquè no tinguin dificultats, sinó perquè **les seves característiques són diferents i, en molts casos, més subtils**. Com a conseqüència, és freqüent que rebin un diagnòstic tardà o fins i tot erroni.' },
        { type: 'h2', text: 'Per què l\'autisme en nenes és menys visible?' },
        { type: 'p', text: 'Una de les principals raons és que el model tradicional de l\'autisme està basat en estudis realitzats majoritàriament en nens. Això, d\'alguna manera, ha deixat fora moltes formes d\'expressió del TEA més comunes en nenes.' },
        { type: 'p', text: 'A més, moltes nenes desenvolupen una notable capacitat de **camuflatge social (masking)**. Això significa que observen, imiten i aprenen comportaments socials per encaixar en el seu entorn. Són capaces de:' },
        { type: 'ul', items: [
          'Copiar expressions facials',
          'Assajar converses mentalment',
          'Forçar-se a mantenir contacte visual',
          'Adaptar-se al que s\'espera d\'elles',
        ]},
        { type: 'p', text: 'A simple vista, això pot fer que "tot sembli normal". Tanmateix, aquest esforç constant pot **generar cansament, ansietat i una gran desconnexió interna**. No és que hi hagi menys nenes amb autisme, és que s\'identifiquen menys.' },
        { type: 'h2', text: 'Senyals d\'autisme en nenes que poden passar desapercebudes' },
        { type: 'p', text: 'Les característiques del TEA en nenes solen ser més subtils i, de vegades, socialment acceptades, la qual cosa en dificulta la detecció. Alguns senyals a tenir en compte són:' },
        { type: 'ul', items: [
          'Dificultats en la interacció social, encara que tinguin amigues.',
          'Tendència a imitar altres nenes per saber com comportar-se.',
          'Interessos molt profunds (animals, lectura, sèries, temes concrets…).',
          'Amistats intenses, absorbents o inestables.',
          'Necessitat de rutina, encara que intentin ocultar-la.',
          'Alta sensibilitat emocional o sensorial (sorolls, llums, textures…).',
        ]},
        { type: 'p', text: 'En molts casos, aquestes nenes són descrites com a "tímides", "molt sensibles" o "perfeccionistes". Però darrere d\'aquestes etiquetes pot haver-hi una dificultat real per comprendre i gestionar l\'entorn social.' },
        { type: 'h2', text: 'Conseqüències de no detectar-ho a temps' },
        { type: 'p', text: 'Quan l\'autisme no s\'identifica, les nenes creixen sense entendre per què se senten diferents. Això pot derivar en:' },
        { type: 'ul', items: [
          'Baixa autoestima.',
          'Ansietat.',
          'Depressió.',
          'Sensació constant de no encaixar.',
          'Esgotament emocional per l\'esforç d\'adaptar-se.',
        ]},
        { type: 'p', text: 'Moltes nenes aprenen a "funcionar" de cara a l\'exterior, però internament viuen amb una càrrega emocional feixuga. No és estrany que el diagnòstic arribi a l\'adolescència o fins i tot a l\'edat adulta.' },
        { type: 'h2', text: 'Com podem ajudar?' },
        { type: 'p', text: 'Detectar i comprendre l\'autisme en nenes és clau per poder oferir un acompanyament adequat. Algunes pautes importants són:' },
        { type: 'ul', items: [
          'Validar les seves emocions.',
          'No forçar la socialització.',
          'Respectar els seus interessos.',
          'Crear entorns predictibles.',
          'Acompanyar sense exigir "normalitat".',
          'Consultar amb professionals especialitzats en TEA.',
        ]},
        { type: 'p', text: 'Les nenes amb autisme no estan fallant. No són "massa sensibles" ni "exagerades". Simplement, hem après a mirar l\'autisme des d\'una única perspectiva. I és moment de canviar-ho: perquè quan comencem a veure-les de veritat, també comencem a comprendre-les.' },
      ],
    },
  },

  {
    slug: 'que-esperar-cuando-vas-al-psicologo',
    coverImage: '/images/blog/psicologo-cover.webp',
    coverAlt: {
      es: 'Sala de terapia acogedora en ABC Centre',
      ca: 'Sala de teràpia acollidora a ABC Centre',
    },
    publishedDate: '2026-03-03',
    relatedService: 'psicologia',
    es: {
      title: '¿Qué esperar y qué no cuando vas al psicólogo?',
      metaTitle: 'Qué esperar de la primera visita al psicólogo — ABC Centre',
      metaDescription: 'Desmontamos los mitos más comunes sobre ir al psicólogo: qué es realmente la terapia, para quién es y qué puedes esperar de una primera sesión.',
      excerpt: 'Te explicamos cuáles son las expectativas de ir a terapia y cuál es su realidad.',
      body: [
        { type: 'p', text: 'Son muchas las expectativas o creencias (socialmente aceptadas) en el momento en que decides ir al psicólogo.' },
        { type: 'p', text: 'Se ha generado un estigma social negativo alrededor de las personas que van al psicólogo. Este es uno de los principales causantes de que la sociedad sienta miedo o rechazo a acudir a terapia.' },
        { type: 'p', text: 'Socialmente, se ha asociado la terapia con "locura", debilidad o fracaso. Es por esto que nos hemos acostumbrado, como sociedad, a oír frases como "yo puedo solo, no necesito ayuda", "pago para que solo me escuchen" o "lo tuyo no es un problema grave, ¿para qué vas?".' },
        { type: 'p', text: 'La realidad es que no, no solo van al psicólogo las personas con problemas "graves", ni las que no pueden solas, y tampoco las que solo van a que les escuchen. Ir a terapia es mucho más; el papel de un psicólogo es mucho más que eso. Ir a terapia es un acto de responsabilidad y valentía. Es cuidar tu bienestar emocional y físico.' },
        { type: 'p', text: '¡Vamos a desmontar algunos de estos mitos!' },
        { type: 'h2', text: 'Mito: "Si no es un problema grave, no debes ir"' },
        { type: 'p', text: 'Realidad: muchos pacientes que acuden a terapia lo hacen para:' },
        { type: 'ul', items: [
          'Gestionar el estrés.',
          'Mejorar sus relaciones.',
          'Tomar decisiones importantes.',
          'Aprender a conocerse mejor.',
        ]},
        { type: 'p', text: 'La terapia es prevención, no solo intervención.' },
        { type: 'h2', text: 'Mito: "Yo puedo solo, no necesito ayuda"' },
        { type: 'p', text: 'Realidad: es cierto que muchas personas pueden afrontar dificultades por sí mismas, pero eso no significa que siempre sea la mejor opción.' },
        { type: 'p', text: 'Cuando estamos dentro del problema, nos cuesta verlo con claridad. Los pensamientos repetitivos o las emociones intensas pueden hacernos sentir bloqueados. Acudir al psicólogo significa que eliges compartir tus problemas en lugar de enfrentarlos solo. Es una forma de cuidarte, de entender mejor lo que te ocurre y de encontrar nuevas herramientas para avanzar.' },
        { type: 'h2', text: 'Mito: "Voy a que solo me escuchen"' },
        { type: 'p', text: 'Realidad: la terapia no es solo "hablar por hablar". Aunque expresarte es una parte fundamental, el trabajo del psicólogo va mucho más allá. Un profesional, aparte de escuchar:' },
        { type: 'ul', items: [
          'Te ayuda a identificar patrones de pensamiento y comportamiento.',
          'Te guía con herramientas y estrategias adaptadas a ti.',
          'Te acompaña en el proceso de cambio.',
        ]},
        { type: 'p', text: 'La terapia es un proceso activo, orientado a que comprendas, afrontes y transformes lo que te preocupa.' },
        { type: 'h2', text: 'Por qué merece la pena ir al psicólogo' },
        { type: 'ul', items: [
          'Mejora tu bienestar emocional.',
          'Te da herramientas para afrontar dificultades.',
          'Previene problemas más graves.',
          'Te ayuda a entenderte mejor.',
        ]},
        { type: 'p', text: 'Ir al psicólogo es para personas que quieren estar mejor, entenderse y vivir con mayor bienestar. Dar el paso puede ser un acto difícil, pero puede ser el inicio de un cambio positivo.' },
      ],
    },
    ca: {
      title: 'Què esperar i què no quan vas al psicòleg?',
      metaTitle: 'Què esperar de la primera visita al psicòleg — ABC Centre',
      metaDescription: 'Desmuntem els mites més comuns sobre anar al psicòleg: què és realment la teràpia, per a qui és i què pots esperar d\'una primera sessió.',
      excerpt: 'T\'expliquem quines són les expectatives d\'anar a teràpia i quina és la seva realitat.',
      body: [
        { type: 'p', text: 'Són moltes les expectatives o creences (socialment acceptades) en el moment en què decideixes anar al psicòleg.' },
        { type: 'p', text: 'S\'ha generat un estigma social negatiu al voltant de les persones que van al psicòleg. Aquest és un dels principals causants que la societat senti por o rebuig a anar a teràpia.' },
        { type: 'p', text: 'Socialment, s\'ha associat la teràpia amb "bogeria", debilitat o fracàs. Per això ens hem acostumat, com a societat, a sentir frases com "jo puc sol, no necessito ajuda", "pago perquè només m\'escoltin" o "el teu no és un problema greu, per què hi vas?".' },
        { type: 'p', text: 'La realitat és que no, no només van al psicòleg les persones amb problemes "greus", ni les que no poden soles, i tampoc les que només hi van perquè les escoltin. Anar a teràpia és molt més; el paper d\'un psicòleg és molt més que això. Anar a teràpia és un acte de responsabilitat i valentia. És tenir cura del teu benestar emocional i físic.' },
        { type: 'p', text: 'Desmuntem alguns d\'aquests mites!' },
        { type: 'h2', text: 'Mite: "Si no és un problema greu, no cal anar-hi"' },
        { type: 'p', text: 'Realitat: molts pacients que van a teràpia ho fan per:' },
        { type: 'ul', items: [
          'Gestionar l\'estrès.',
          'Millorar les seves relacions.',
          'Prendre decisions importants.',
          'Aprendre a conèixer-se millor.',
        ]},
        { type: 'p', text: 'La teràpia és prevenció, no només intervenció.' },
        { type: 'h2', text: 'Mite: "Jo puc sol, no necessito ajuda"' },
        { type: 'p', text: 'Realitat: és cert que moltes persones poden afrontar dificultats per si mateixes, però això no significa que sempre sigui la millor opció.' },
        { type: 'p', text: 'Quan som dins del problema, ens costa veure-ho amb claredat. Els pensaments repetitius o les emocions intenses ens poden fer sentir bloquejats. Anar al psicòleg significa que tries compartir els teus problemes en lloc d\'afrontar-los sol. És una manera de tenir cura de tu, d\'entendre millor el que et passa i de trobar noves eines per avançar.' },
        { type: 'h2', text: 'Mite: "Hi vaig perquè només m\'escoltin"' },
        { type: 'p', text: 'Realitat: la teràpia no és només "parlar per parlar". Encara que expressar-te és una part fonamental, la feina del psicòleg va molt més enllà. Un professional, a més d\'escoltar:' },
        { type: 'ul', items: [
          'T\'ajuda a identificar patrons de pensament i comportament.',
          'Et guia amb eines i estratègies adaptades a tu.',
          'T\'acompanya en el procés de canvi.',
        ]},
        { type: 'p', text: 'La teràpia és un procés actiu, orientat perquè comprenguis, afrontis i transformis allò que et preocupa.' },
        { type: 'h2', text: 'Per què val la pena anar al psicòleg' },
        { type: 'ul', items: [
          'Millora el teu benestar emocional.',
          'Et dona eines per afrontar dificultats.',
          'Preveu problemes més greus.',
          'T\'ajuda a entendre\'t millor.',
        ]},
        { type: 'p', text: 'Anar al psicòleg és per a persones que volen estar millor, entendre\'s i viure amb més benestar. Fer el pas pot ser un acte difícil, però pot ser l\'inici d\'un canvi positiu.' },
      ],
    },
  },

  {
    slug: 'tdah-en-adultos',
    coverImage: '/images/blog/tdah-cover.webp',
    coverAlt: {
      es: 'Espacio de trabajo ordenado en una oficina luminosa',
      ca: 'Espai de treball endreçat en una oficina lluminosa',
    },
    publishedDate: '2026-01-20',
    relatedService: 'neuropsicologia',
    es: {
      title: '¿Cómo se muestra el TDAH en adultos?',
      metaTitle: 'TDAH en adultos: síntomas y señales — ABC Centre',
      metaDescription: 'El TDAH en adultos existe y a menudo pasa desapercibido. Te explicamos cómo se manifiesta, por qué se diagnostica tarde y cómo podemos ayudarte.',
      excerpt: 'El TDAH en adultos existe, y comprenderlo puede mejorar tu calidad de vida.',
      body: [
        { type: 'p', text: 'Durante mucho tiempo, el Trastorno por Déficit de Atención e Hiperactividad (TDAH) se ha asociado únicamente a la infancia. Sin embargo, muchas personas llegan a la edad adulta sin diagnóstico, conviviendo durante años con dificultades que a menudo han atribuido a falta de organización o despistes.' },
        { type: 'p', text: 'El TDAH, tanto en niños como en adultos, no solo es falta de capacidad para mantener la atención, sino que este trastorno implica muchos otros aspectos. El TDAH en adultos existe, y comprenderlo puede marcar una gran diferencia en la calidad de vida.' },
        { type: 'h2', text: '¿Cómo se manifiesta el TDAH en la madurez?' },
        { type: 'p', text: 'Aunque cada persona lo vive de manera distinta, el TDAH en adultos no siempre se parece a la imagen clásica de hiperactividad o de falta de atención que solemos imaginar. Puede expresarse como:' },
        { type: 'ul', items: [
          'Dificultad para mantener la atención en tareas largas o poco estimulantes.',
          'Sensación constante de desorganización o caos mental.',
          'Problemas para gestionar tiempos, prioridades o plazos.',
          'Tendencia a posponer tareas, incluso importantes.',
          'Olvidos frecuentes o sensación de ir "apagando fuegos".',
          'Inquietud interna, impulsividad o dificultad para desconectar.',
        ]},
        { type: 'p', text: 'Estas dificultades pueden aparecer en distintos ámbitos: trabajo, relaciones, gestión del hogar o vida personal.' },
        { type: 'h2', text: 'No es pereza, ni falta de interés' },
        { type: 'p', text: 'Uno de los mayores retos para muchos adultos con TDAH es haber crecido recibiendo mensajes como "si te esforzaras más, podrías", "eres muy despistado" o "siempre lo dejas todo para última hora".' },
        { type: 'p', text: 'Con el tiempo, esto puede generar frustración, culpa o baja autoestima. Pero el problema no es una falta de voluntad. Muchas veces tiene que ver con cómo funciona la atención, la planificación o la regulación emocional. Ponerle nombre a estas dificultades puede ser profundamente liberador.' },
        { type: 'h2', text: '¿Por qué muchos adultos se diagnostican tarde?' },
        { type: 'p', text: 'Porque durante años pasó desapercibido. A veces porque había buenas notas y nadie sospechó nada. Otras, porque las dificultades se compensaban… hasta que las demandas de la vida adulta (trabajo, pareja, hijos, responsabilidades) hicieron más difícil sostenerlo.' },
        { type: 'p', text: 'Muchas personas llegan a consulta pensando que "simplemente se organizan mal", cuando detrás puede haber algo más.' },
        { type: 'h2', text: 'Buscar ayuda también es entenderse' },
        { type: 'p', text: 'Recibir orientación profesional no es poner una etiqueta, sino comprender qué está pasando y cómo abordarlo. Un buen acompañamiento puede ayudar a:' },
        { type: 'ul', items: [
          'Entender el propio funcionamiento.',
          'Reducir la autoexigencia y la culpa.',
          'Mejorar el bienestar en el día a día.',
          'Favorecer estrategias ajustadas a cada persona.',
        ]},
        { type: 'p', text: 'Porque muchas veces no se trata de esforzarse más, sino de entenderse mejor.' },
        { type: 'p', text: 'El TDAH en adultos sigue siendo poco visible, pero es una realidad para muchas personas. Si ciertas dificultades te resultan familiares, quizá no sea simplemente "despiste" o "falta de organización". Tal vez haya una explicación que merezca ser explorada. Comprenderlo puede ser el primer paso para vivir con más calma, menos frustración y mayor bienestar.' },
      ],
    },
    ca: {
      title: 'Com es mostra el TDAH en adults?',
      metaTitle: 'TDAH en adults: símptomes i senyals — ABC Centre',
      metaDescription: 'El TDAH en adults existeix i sovint passa desapercebut. T\'expliquem com es manifesta, per què es diagnostica tard i com podem ajudar-te.',
      excerpt: 'El TDAH en adults existeix, i comprendre\'l pot millorar la teva qualitat de vida.',
      body: [
        { type: 'p', text: 'Durant molt de temps, el Trastorn per Dèficit d\'Atenció i Hiperactivitat (TDAH) s\'ha associat únicament a la infància. Tanmateix, moltes persones arriben a l\'edat adulta sense diagnòstic, convivint durant anys amb dificultats que sovint han atribuït a manca d\'organització o despistos.' },
        { type: 'p', text: 'El TDAH, tant en nens com en adults, no és només manca de capacitat per mantenir l\'atenció, sinó que aquest trastorn implica molts altres aspectes. El TDAH en adults existeix, i comprendre\'l pot marcar una gran diferència en la qualitat de vida.' },
        { type: 'h2', text: 'Com es manifesta el TDAH en la maduresa?' },
        { type: 'p', text: 'Encara que cada persona ho viu de manera diferent, el TDAH en adults no sempre s\'assembla a la imatge clàssica d\'hiperactivitat o de manca d\'atenció que solem imaginar. Pot expressar-se com:' },
        { type: 'ul', items: [
          'Dificultat per mantenir l\'atenció en tasques llargues o poc estimulants.',
          'Sensació constant de desorganització o caos mental.',
          'Problemes per gestionar temps, prioritats o terminis.',
          'Tendència a ajornar tasques, fins i tot importants.',
          'Oblits freqüents o sensació d\'anar "apagant focs".',
          'Inquietud interna, impulsivitat o dificultat per desconnectar.',
        ]},
        { type: 'p', text: 'Aquestes dificultats poden aparèixer en diferents àmbits: feina, relacions, gestió de la llar o vida personal.' },
        { type: 'h2', text: 'No és mandra, ni manca d\'interès' },
        { type: 'p', text: 'Un dels reptes més grans per a molts adults amb TDAH és haver crescut rebent missatges com "si t\'esforcessis més, podries", "ets molt despistat" o "sempre ho deixes tot per a última hora".' },
        { type: 'p', text: 'Amb el temps, això pot generar frustració, culpa o baixa autoestima. Però el problema no és una manca de voluntat. Moltes vegades té a veure amb com funciona l\'atenció, la planificació o la regulació emocional. Posar nom a aquestes dificultats pot ser profundament alliberador.' },
        { type: 'h2', text: 'Per què molts adults es diagnostiquen tard?' },
        { type: 'p', text: 'Perquè durant anys va passar desapercebut. De vegades perquè hi havia bones notes i ningú va sospitar res. D\'altres, perquè les dificultats es compensaven… fins que les demandes de la vida adulta (feina, parella, fills, responsabilitats) van fer més difícil sostenir-ho.' },
        { type: 'p', text: 'Moltes persones arriben a consulta pensant que "simplement s\'organitzen malament", quan darrere pot haver-hi alguna cosa més.' },
        { type: 'h2', text: 'Buscar ajuda també és entendre\'s' },
        { type: 'p', text: 'Rebre orientació professional no és posar una etiqueta, sinó comprendre què està passant i com abordar-ho. Un bon acompanyament pot ajudar a:' },
        { type: 'ul', items: [
          'Entendre el propi funcionament.',
          'Reduir l\'autoexigència i la culpa.',
          'Millorar el benestar en el dia a dia.',
          'Afavorir estratègies ajustades a cada persona.',
        ]},
        { type: 'p', text: 'Perquè moltes vegades no es tracta d\'esforçar-se més, sinó d\'entendre\'s millor.' },
        { type: 'p', text: 'El TDAH en adults continua sent poc visible, però és una realitat per a moltes persones. Si certes dificultats et resulten familiars, potser no sigui simplement "despiste" o "manca d\'organització". Potser hi ha una explicació que mereix ser explorada. Comprendre-ho pot ser el primer pas per viure amb més calma, menys frustració i més benestar.' },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function estimateReadingMinutes(post: BlogPost, locale: 'es' | 'ca'): number {
  const words = post[locale].body
    .map((b) => (b.type === 'ul' ? b.items.join(' ') : b.text))
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
