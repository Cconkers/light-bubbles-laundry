/**
 * Contenido centralizado de la home.
 * Todo dato de negocio sin confirmar usa el formato [PLACEHOLDER: ...] (D-010).
 * Cuando el negocio confirme los datos, editar solo este archivo.
 */

export const site = {
  name: 'Burbujas de Luz',
  tagline: 'Lavandería Autoservicio',
  location: 'Sevilla',
  description:
    'Lavandería autoservicio en Sevilla. Lava, seca y disfruta con máquinas modernas a tu ritmo. Descubre las tarifas y cómo funciona.',
};

export const hero = {
  headline: {
    line1: 'Tu colada,',
    line2a: 'más ',
    line2b: 'fácil,',
    line3a: 'más tiempo',
    line3b: 'para ti',
  },
  subheadline:
    'Lavandería autoservicio moderna, rápida y eficiente para tu día a día.',
  slogan: 'Limpio, rápido y a tu manera',
  ctaPrimary: { label: 'Ver tarifas', href: '#tarifas' },
  ctaSecondary: { label: 'Cómo funciona', href: '#como-funciona' },
};

export const benefits = [
  {
    icon: 'sparkle',
    color: 'violet',
    title: 'Fácil de usar',
    description: 'Máquinas intuitivas, instrucciones claras. Sin curva de aprendizaje.',
  },
  {
    icon: 'leaf',
    color: 'mint',
    title: 'Ecológico y eficiente',
    description: 'Programas de lavado que cuidan tu ropa y el medioambiente.',
  },
  {
    icon: 'clock',
    color: 'cyan',
    title: 'Ahorra tiempo',
    description: 'Varias máquinas disponibles. Lava y seca al mismo tiempo.',
  },
  {
    icon: 'heart',
    color: 'pink',
    title: 'Cuidamos tu ropa',
    description: 'Programas específicos para cada tejido y temperatura.',
  },
] as const;

export const servicesIntro = {
  title: 'Nuestros servicios',
  subtitle: 'Todo lo que necesitas para cuidar tu ropa, en un solo lugar.',
};

export const servicesContact = {
  text: '¿Necesitas ayuda personalizada? Estamos aquí para asesorarte',
  cta: { label: 'Contáctanos', href: '#contacto' },
};

export const services = [
  {
    icon: 'washing-machine',
    color: 'violet',
    title: 'Lavado',
    description:
      'Lavadoras de distintas capacidades para todo tipo de colada: desde el día a día hasta edredones y textiles voluminosos.',
    href: '#tarifas',
    actionLabel: 'Ver más',
  },
  {
    icon: 'wind',
    color: 'cyan',
    title: 'Secado',
    description:
      'Secadoras potentes con programas y temperaturas adaptables. Deja la ropa lista para guardar o planchar.',
    href: '#tarifas',
    actionLabel: 'Ver más',
  },
  {
    icon: 'spray',
    color: 'mint',
    title: 'Productos',
    description:
      'Detergentes y suavizantes a tu disposición en el local. Elige la dosis que necesites en cada ciclo.',
    href: '#contacto',
    actionLabel: 'Ver más',
  },
  {
    icon: 'plus-circle',
    color: 'orange',
    title: 'Extra',
    description:
      'Bolsas, cestas y otros complementos para que tu visita sea más cómoda. Pregúntanos si necesitas algo más.',
    href: '#contacto',
    actionLabel: 'Ver más',
  },
] as const;

export const pricingIntro = {
  titleLead: 'Tarifas simples,',
  titleAccent: 'siempre claras',
  subtitle:
    'Elige el tamaño que encaje con tu colada. Precios de ejemplo según el mockup; pendientes de confirmación del negocio.',
  note: 'Precios y capacidades orientativos (maqueta del design board). Pendientes de confirmación del negocio.',
};

/** Precios de ejemplo tomados del design board (maqueta). Sustituir al confirmar (D-010). */
export const pricingByCategory = {
  lavado: [
    {
      id: 'lavado-pequena',
      title: 'Pequeña',
      capacity: '9 kg',
      price: '5,50 €',
      description: 'Ideal para cargas pequeñas',
      color: 'violet',
      featured: false,
      iconSize: 48,
    },
    {
      id: 'lavado-mediana',
      title: 'Mediana',
      capacity: '14 kg',
      price: '8,00 €',
      description: 'Ideal para el día a día',
      color: 'pink',
      featured: true,
      badge: 'Más popular',
      iconSize: 56,
    },
    {
      id: 'lavado-grande',
      title: 'Grande',
      capacity: '19 kg',
      price: '11,00 €',
      description: 'Para grandes cargas',
      color: 'orange',
      featured: false,
      iconSize: 64,
    },
    {
      id: 'lavado-extra',
      title: 'Extra grande',
      capacity: '24 kg',
      price: '13,50 €',
      description: 'Para edredones y más',
      color: 'mint',
      featured: false,
      iconSize: 72,
    },
  ],
  secado: [
    {
      id: 'secado-pequena',
      title: 'Pequeña',
      capacity: '9 kg',
      price: '3,50 €',
      description: 'Secado rápido de cargas ligeras',
      color: 'violet',
      featured: false,
      iconSize: 48,
    },
    {
      id: 'secado-mediana',
      title: 'Mediana',
      capacity: '14 kg',
      price: '5,00 €',
      description: 'El tamaño más usado',
      color: 'pink',
      featured: true,
      badge: 'Más popular',
      iconSize: 56,
    },
    {
      id: 'secado-grande',
      title: 'Grande',
      capacity: '19 kg',
      price: '7,00 €',
      description: 'Cargas abundantes',
      color: 'orange',
      featured: false,
      iconSize: 64,
    },
    {
      id: 'secado-extra',
      title: 'Extra grande',
      capacity: '24 kg',
      price: '9,00 €',
      description: 'Edredones y textiles voluminosos',
      color: 'mint',
      featured: false,
      iconSize: 72,
    },
  ],
} as const;

/** @deprecated Usar pricingByCategory — se mantiene por compatibilidad de imports */
export const pricing = pricingByCategory.lavado;

export const steps = [
  {
    number: 1,
    color: 'violet',
    title: 'Elige la máquina',
    description:
      'Mira el volumen de tu colada y elige la lavadora libre que mejor le venga. La pantalla indica si está disponible y el programa recomendado.',
  },
  {
    number: 2,
    color: 'pink',
    title: 'Añade los productos',
    description:
      'Echa detergente y suavizante en los cajetines, o coge una dosis en el expositor del local. Cierra la puerta y listo.',
  },
  {
    number: 3,
    color: 'cyan',
    title: 'Inicia el ciclo',
    description:
      'Paga en el terminal de la máquina (tarjeta o monedas) y pulsa inicio. El ciclo arranca solo; no hace falta quedarse al lado.',
  },
  {
    number: 4,
    color: 'orange',
    title: 'Disfruta tu tiempo',
    description:
      'El lavado suele durar unos 35 minutos; el secado, entre 20 y 40 según el programa. Espera en el local o date una vuelta.',
  },
] as const;

export const contact = {
  phone: '629 517 805',
  /** wa.me: mismo móvil + prefijo España */
  whatsapp: '34629517805',
  email: 'viedmaelectric@gmail.com',
  address: 'C. Virgen de la Cinta, 41011 Sevilla',
  hours: 'Lunes a domingo, de 7:00 h a 23:00 h',
};

const mapsQuery = encodeURIComponent(contact.address);

/** SPEC-006 — intro y URLs de mapa (D-024: iframe lazy + enlace externo). */
export const locationIntro = {
  title: 'Estamos aquí para ayudarte',
  subtitle: 'Encuéntranos en Sevilla. Ven cuando quieras dentro del horario.',
  ctaDirections: 'Cómo llegar',
  ctaOpenMaps: 'Abrir en Google Maps',
  mapTitle: `Mapa de Burbujas de Luz en ${contact.address}`,
  mapsEmbedUrl: `https://maps.google.com/maps?q=${mapsQuery}&output=embed&hl=es`,
  mapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  mapsOpenUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
};

/** SPEC-007 — FAQ (copy de maqueta; horario/dirección desde contact). */
export const faqIntro = {
  title: 'Preguntas frecuentes',
  subtitle: 'Resolvemos las dudas más habituales antes de tu visita.',
  contactLead: '¿Sigues con dudas?',
  contactCta: { label: 'Contáctanos', href: '#contacto' },
};

export const faqItems = [
  {
    id: 'reserva',
    question: '¿Necesito reserva?',
    answer:
      'No. Somos lavandería de autoservicio: ven cuando quieras dentro del horario, elige una máquina libre y empieza. Sin cita previa ni app.',
  },
  {
    id: 'pago',
    question: '¿Qué métodos de pago aceptáis?',
    answer:
      'En el terminal de cada máquina puedes pagar con tarjeta o monedas. Si una máquina concreta pide otro formato, lo indica en pantalla; ante la duda, pregunta en el local.',
  },
  {
    id: 'detergente',
    question: '¿Hay detergente en el local?',
    answer:
      'Sí. Encontrarás detergente y suavizante en el expositor para dosificar en cada ciclo. También puedes traer tus propios productos si lo prefieres.',
  },
  {
    id: 'cargas',
    question: '¿Puedo lavar edredones o cargas grandes?',
    answer:
      'Sí. Hay lavadoras de distintas capacidades, incluidas las más grandes para edredones, cortinas y textiles voluminosos.',
    link: { label: 'Ver tarifas y tamaños', href: '#tarifas' },
  },
  {
    id: 'horario',
    question: '¿Cuál es el horario?',
    answer: `Estamos abiertos ${contact.hours}.`,
  },
  {
    id: 'ubicacion',
    question: '¿Dónde estáis?',
    answer: `Estamos en ${contact.address}. En la sección de contacto tienes el mapa y cómo llegar.`,
    link: { label: 'Ver ubicación y mapa', href: '#contacto' },
  },
] as const;
