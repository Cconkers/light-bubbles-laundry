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

export const services = [
  {
    icon: 'washing-machine',
    color: 'violet',
    title: 'Lavado',
    description: '[PLACEHOLDER: capacidades de lavadora disponibles]',
    badge: null,
  },
  {
    icon: 'wind',
    color: 'cyan',
    title: 'Secado',
    description: '[PLACEHOLDER: capacidades de secadora y temperaturas disponibles]',
    badge: null,
  },
  {
    icon: 'spray',
    color: 'mint',
    title: 'Productos',
    description: '[PLACEHOLDER: detergentes y suavizantes disponibles en el local]',
    badge: null,
  },
  {
    icon: 'plus-circle',
    color: 'orange',
    title: 'Extra',
    description: '[PLACEHOLDER: servicios adicionales disponibles]',
    badge: null,
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
    description: '[PLACEHOLDER: detalle del proceso de selección de máquina]',
  },
  {
    number: 2,
    color: 'pink',
    title: 'Añade los productos',
    description: '[PLACEHOLDER: instrucciones para añadir detergente y suavizante]',
  },
  {
    number: 3,
    color: 'cyan',
    title: 'Inicia el ciclo',
    description: '[PLACEHOLDER: método de pago aceptado y cómo iniciar el ciclo]',
  },
  {
    number: 4,
    color: 'orange',
    title: 'Disfruta tu tiempo',
    description: '[PLACEHOLDER: duración aproximada del ciclo de lavado y secado]',
  },
] as const;

export const contact = {
  phone: '[PLACEHOLDER: teléfono]',
  whatsapp: '[PLACEHOLDER: número WhatsApp]',
  email: '[PLACEHOLDER: email]',
  address: '[PLACEHOLDER: dirección postal completa, Sevilla]',
  hours: '[PLACEHOLDER: horario de apertura]',
};
