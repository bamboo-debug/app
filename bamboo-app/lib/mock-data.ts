import { getLevel, progressToNextLevel } from './gamification';
import type { Activity, BlogPost, LeaderboardEntry, Module, UserProfile, WelcomeMessage } from './types';
const samplePoints = 940;
const progress = progressToNextLevel(samplePoints);
export const welcomeMessage: WelcomeMessage = {
  title: 'Bienvenido al club de innovación Bamboo',
  body: [
    'Lo que estás viendo es una demo, pero también es una promesa de todo lo que viene. Bamboo nace para que cualquier persona de una agencia pueda entrenar criterio, ganar confianza y convertir su trabajo diario en un espacio de mejora real.',
    'No importa si estás en cuentas, creatividad, estrategia, medios, producción, data, social o administración. La innovación no pertenece a un área. Pertenece a quienes se animan a cuestionar, probar y elevar la vara.',
    'Esta demo es el primer paso. Juntos la vamos a convertir en una plataforma viva que acompañe carreras, fortalezca equipos y haga que Texo innove con más método, más valentía y más impacto.'
  ],
  cta: 'Juntos vamos a hacer que esta demo se vuelva una realidad.'
};
export const demoProfile: UserProfile = { id: 'demo-user', full_name: 'Ana Innovación', email: 'ana@texo.com', area: 'Estrategia', level: progress.current.level, level_name: progress.current.name, points: samplePoints, streak_days: 4, next_level_points: progress.nextLevelPoints };
export const modules: Module[] = [
  {
    id: 'm1', slug: 'innovacion-en-agencia', title: '¿Qué es innovación en una agencia de verdad?', description: 'Una introducción honesta y accionable para entender que innovar no es un show: es mejorar cómo pensamos, trabajamos y generamos valor.', month: 'Mes 1', level_required: 1, xp_reward: 120, lessons: 4, status: 'completed', theme: 'Fundamentos',
    opening: 'En una agencia, innovación suele confundirse con campañas brillantes, herramientas nuevas o ideas espectaculares. Pero la mayoría de las oportunidades reales no están en el discurso; están escondidas en la fricción cotidiana: briefs confusos, retrabajos, reuniones sin decisión, procesos lentos y talento desperdiciado.',
    sections: [
      { heading: 'La innovación no está lejos', body: 'Innovar no siempre significa inventar algo desde cero. Muchas veces significa detectar una fricción y mejorarla con criterio. Si una propuesta tarda demasiado en salir, si una presentación no logra vender una idea, o si un equipo necesita demasiadas vueltas para entenderse, ahí hay una oportunidad concreta de innovación.' },
      { heading: 'En una agencia, el valor se siente', body: 'La mejor innovación no siempre se ve en un caso de festival. Se siente cuando un equipo trabaja con menos desgaste, cuando un cliente entiende más rápido el valor de una propuesta, o cuando una idea llega más lejos porque el sistema dejó de frenarla.' },
      { heading: 'La invitación de Bamboo', body: 'Bamboo no busca formar “gurús de innovación”. Busca formar personas valientes, con criterio y método, que sepan detectar lo que se puede mejorar y lo conviertan en acción. Innovar también es revisar cómo damos feedback, cómo armamos un brief o cómo logramos que un proyecto no se ahogue antes de nacer.' }
    ],
    exercise: 'Pensá en tu semana y elegí una fricción concreta: una reunión improductiva, un proceso que te roba energía o una aprobación que siempre llega tarde. Describila en una frase y respondé: ¿qué tendría que pasar para que esto funcionara mejor?', takeaway: 'No necesitás permiso para innovar. Necesitás aprender a ver lo que todos ya normalizaron.',
    quiz: { question: '¿Cuál es una señal real de innovación dentro de una agencia?', options: ['Tener ideas creativas sin restricciones', 'Implementar tecnología nueva aunque no resuelva nada', 'Mejorar un problema cotidiano de manera que genere valor real', 'Hacer una campaña llamativa aunque el proceso siga roto'], correct: 2, explanation: 'La innovación valiosa no depende del espectáculo. Depende de resolver mejor un problema importante para el negocio, el equipo o el cliente.' }
  },
  {
    id: 'm2', slug: 'mentalidad-innovadora', title: 'Mentalidad innovadora en entornos creativos', description: 'Cómo pensar con más valentía y menos piloto automático para que la creatividad no se convierta en rutina.', month: 'Mes 2', level_required: 1, xp_reward: 140, lessons: 5, status: 'completed', theme: 'Mentalidad',
    opening: 'Trabajar en una agencia no te vuelve innovador por defecto. Podés rodearte de ideas, referencias y talento, y aun así vivir atrapado en la repetición. La innovación empieza cuando dejás de aceptar como normal lo que te está limitando.',
    sections: [
      { heading: 'Cuestionar también es crear', body: 'La creatividad suele celebrarse cuando aparece una gran idea. Pero antes de esa idea hay una decisión más importante: cuestionar. ¿Por qué ese brief está planteado así? ¿Por qué ese entregable necesita cinco aprobaciones? ¿Por qué ese cliente siempre llega tarde al mismo punto? Las preguntas correctas son combustible para la innovación.' },
      { heading: 'No te enamores de la primera respuesta', body: 'En equipos con presión y tiempos cortos, la primera idea “aceptable” parece suficiente. Los profesionales que crecen son los que empujan una ronda más, una conversación más, una alternativa más. No por obsesión, sino por oficio. Ahí aparece el diferencial.' },
      { heading: 'Coraje operativo', body: 'La mentalidad innovadora no vive solo en la inspiración. Vive en decisiones pequeñas: proponer una mejora, traer una idea incómoda a una reunión, defender una solución que todavía está verde, o pedir una prueba rápida antes de pasar semanas perfeccionando algo que nadie validó.' }
    ],
    exercise: 'En tu próximo proyecto, generá tres alternativas más de las habituales y elegí una para llevarla a la conversación, aunque no sea la más cómoda. Después observá qué revela eso sobre tu equipo y tu forma de trabajar.', takeaway: 'Tu carrera no cambia solo cuando hacés bien tu trabajo. Cambia cuando te animás a elevar cómo se hace el trabajo.',
    quiz: { question: '¿Qué distingue a una persona con mentalidad innovadora?', options: ['Produce ideas rápido pero evita discutirlas', 'Tiene años de experiencia y sigue el proceso tal como está', 'Cuestiona, prueba y empuja las ideas más allá de lo obvio', 'Solo interviene cuando le piden creatividad'], correct: 2, explanation: 'La mentalidad innovadora une criterio, valentía y capacidad de acción. No se limita a generar ideas; las lleva más lejos.' }
  },
  {
    id: 'm3', slug: 'entender-cliente-real', title: 'Entender al cliente de verdad', description: 'Menos suposición y más comprensión real del problema para que el trabajo deje de ser decoración y empiece a generar impacto.', month: 'Mes 3', level_required: 2, xp_reward: 160, lessons: 5, status: 'available', theme: 'Empatía',
    opening: 'En agencias se habla mucho de consumidores, audiencias, stakeholders y targets. Pero el verdadero salto ocurre cuando dejamos de mirar categorías abstractas y empezamos a entender personas, tensiones y objetivos concretos.',
    sections: [
      { heading: 'Detrás del brief hay una ansiedad real', body: 'Cuando un cliente pide una campaña, en realidad suele estar intentando resolver otra cosa: vender más, justificar presupuesto, ordenar una marca, responder a la competencia o demostrar capacidad interna. Si no entendés esa ansiedad, tu propuesta puede ser creativa y aun así no ser relevante.' },
      { heading: 'La empatía no es amabilidad', body: 'Empatizar no es decirle que sí a todo. Es comprender lo que le importa al otro con suficiente profundidad como para tomar mejores decisiones. Eso aplica al cliente externo, al usuario final y también a tus colegas dentro de la agencia. Una gran parte de la innovación interna nace cuando entendés mejor cómo trabaja el otro.' },
      { heading: 'Escuchar cambia la calidad del trabajo', body: 'Una buena pregunta puede ahorrarte semanas de ejecución equivocada. ¿Qué te preocupa de este proyecto? ¿Qué tendría que pasar para decir “esto valió la pena”? ¿Dónde se viene trabando siempre? Estas preguntas no son accesorias: son parte del oficio.' }
    ],
    exercise: 'Elegí un cliente interno o externo y prepará una conversación de 10 minutos con tres preguntas: ¿qué te frustra hoy?, ¿qué te hace perder tiempo?, ¿qué te haría sentir que esto funcionó? Después convertí esas respuestas en una hipótesis de mejora.', takeaway: 'Si no entendés el problema real, tu solución puede verse bien y al mismo tiempo no mover nada importante.',
    quiz: { question: '¿Qué busca realmente un cliente cuando llega a una agencia?', options: ['Una campaña original por sí sola', 'Una presentación estética aunque no resuelva nada', 'Resultados y claridad frente a un problema real', 'La última tendencia del mercado'], correct: 2, explanation: 'La creatividad es una herramienta. El objetivo del cliente suele ser resolver una necesidad del negocio o de la marca.' }
  },
  {
    id: 'm4', slug: 'ideas-que-sobreviven', title: 'Ideas que sobreviven', description: 'Cómo hacer que una idea no se quede en una reunión linda sino que avance, se sostenga y genere carrera.', month: 'Mes 4', level_required: 2, xp_reward: 180, lessons: 6, status: 'available', theme: 'Ejecución',
    opening: 'En agencias sobran ideas. Lo raro no es tenerlas; lo raro es que lleguen vivas al mundo real. Muchas mueren porque no se explicaron bien, porque no conectaron con negocio, porque no se pudo defender su valor o porque nadie se hizo cargo de empujarlas.',
    sections: [
      { heading: 'Vender una idea es parte del trabajo', body: 'No alcanza con tener una buena propuesta. También hay que darle contexto, convertirla en una historia comprensible y mostrar por qué importa. Muchas veces el talento no se frustra por falta de creatividad, sino por falta de traducción.' },
      { heading: 'La viabilidad no mata la ambición', body: 'Hacer una idea viable no significa achicarla hasta volverla irrelevante. Significa encontrar una versión que pueda probarse, defenderse y crecer. Un piloto, un MVP o una activación pequeña pueden ser la diferencia entre la intuición y el impacto.' },
      { heading: 'Las carreras crecen con ideas concretadas', body: 'Tu desarrollo profesional no depende solo del talento que tenés, sino de la cantidad de ideas que lográs convertir en movimiento. Las personas que avanzan son las que no se quedan solo con el hallazgo creativo: empujan, alinean, adaptan y hacen que las cosas pasen.' }
    ],
    exercise: 'Tomá una idea que no haya avanzado y analizala con honestidad: ¿murió por claridad, por timing, por falta de sponsor o por miedo? Escribí cuál habría sido la siguiente versión viable para darle una oportunidad real.', takeaway: 'Una buena idea suma reputación. Una idea que se concreta cambia equipos, resultados y carreras.',
    quiz: { question: '¿Qué necesita una idea para sobrevivir en una agencia?', options: ['Ser muy original y quedarse intacta', 'Conectar con un problema, explicarse bien y encontrar una forma viable de avanzar', 'Depender de que el cliente la apruebe a la primera', 'Tener una presentación linda aunque no esté clara'], correct: 1, explanation: 'Las ideas que avanzan combinan valor, claridad y capacidad de implementación. No viven solo del brillo inicial.' }
  }
];
export const activities: Activity[] = [
  { id: 'a1', title: 'Workshop: detectar oportunidades invisibles', category: 'taller', date_label: '18 mayo · 9:00 a 11:00', xp_reward: 120, status: 'upcoming', description: 'Una sesión para aprender a leer fricciones en procesos, briefs y reuniones antes de que se conviertan en desgaste normalizado.' },
  { id: 'a2', title: 'Curso interno: design thinking para cualquier área', category: 'curso', date_label: '25 mayo · 15:00 a 17:00', xp_reward: 150, status: 'upcoming', description: 'Adaptado para cuentas, creatividad, medios, producción, estrategia y equipos de soporte. La idea es que todos puedan usar el método.' },
  { id: 'a3', title: 'Publicar un artículo en el blog Bamboo', category: 'blog', date_label: 'Disponible todo el mes', xp_reward: 250, status: 'upcoming', description: 'Convertí una experiencia, un hallazgo o una mejora concreta en conocimiento compartido para toda la red.' },
  { id: 'a4', title: 'Reto del mes: mejorar una experiencia interna', category: 'reto', date_label: 'Cierre 30 mayo', xp_reward: 200, status: 'upcoming', description: 'Identificá una fricción diaria, proponé una mejora y presentala como prototipo simple o recomendación accionable.' }
];
export const blogPosts: BlogPost[] = [
  { id: 'b1', title: 'La diferencia entre quienes crecen en agencia y quienes se estancan', summary: 'Una mirada directa sobre iniciativa, criterio y la capacidad de mejorar sistemas, no solo tareas.', excerpt: 'Las agencias no premian únicamente talento. Premian a las personas que detectan un problema antes que el resto, lo nombran con claridad y hacen algo para que cambie. Quedarse en la ejecución correcta puede sostenerte. Mejorar cómo se trabaja puede proyectarte.', author: 'Camila Ríos', tag: 'Carrera', status: 'published', xp_reward: 250 },
  { id: 'b2', title: 'Cómo detectar oportunidades de innovación en el día a día', summary: 'Una guía simple para encontrar oportunidades en retrabajos, aprobaciones lentas, errores repetidos y conversaciones mal planteadas.', excerpt: 'La innovación no empieza en un offsite. Empieza en ese momento en que notás que algo consume energía sin devolver valor. Cuando aprendés a leer esos patrones, empezás a jugar en otra liga profesional.', author: 'Equipo People & Cultura', tag: 'Oportunidades', status: 'published', xp_reward: 250 },
  { id: 'b3', title: 'Borrador: cómo vender una idea antes de que la maten por miedo', summary: 'Plantilla editorial para transformar una intuición creativa en una propuesta entendible y defendible.', excerpt: 'Muchas ideas no mueren porque sean malas. Mueren porque nadie logró contar por qué importaban, qué problema resolvían y cuál podía ser su primera versión viable.', author: 'Luis Herrera', tag: 'Ejecución', status: 'draft', xp_reward: 150 }
];
export const leaderboard: LeaderboardEntry[] = [
  { id: 'l1', name: 'Camila Ríos', area: 'Creatividad', points: 1820, level_name: getLevel(1820).name },
  { id: 'l2', name: 'Luis Herrera', area: 'Producción', points: 1510, level_name: getLevel(1510).name },
  { id: 'l3', name: 'Ana Innovación', area: 'Estrategia', points: 940, level_name: getLevel(940).name },
  { id: 'l4', name: 'Paola Mena', area: 'Cuentas', points: 840, level_name: getLevel(840).name }
];
