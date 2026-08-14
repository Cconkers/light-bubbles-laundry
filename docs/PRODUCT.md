# PRODUCT.md — Burbujas de Luz

> **Producto:** Burbujas de Luz — Lavandería Autoservicio
> **Ubicación:** Sevilla, España
> **Documento:** Definición de producto desde negocio y usuario. Fuente de verdad para *qué* construimos y *para quién*.

Este documento **no** describe arquitectura técnica (ver [`PLANNING.md`](../PLANNING.md)), ni estética
(ver [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md)), ni reglas visuales reutilizables
(ver [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)).

---

## Product Vision

Burbujas de Luz es una lavandería de autoservicio en Sevilla. La web no es una tienda:
es el **escaparate digital** de un local físico. Su trabajo es que alguien que necesita
lavar ropa entienda en segundos qué se ofrece, cuánto cuesta y cómo llegar, y salga con
la confianza suficiente para cruzar la puerta.

La experiencia debe sentirse luminosa, limpia y amable, en contraste con la percepción
habitual de una lavandería como un sitio funcional y algo frío. El nombre marca la
dirección: burbujas y luz. Alegre, no infantil. Cuidado, no pretencioso.

La web debe resultar **más ordenada y tranquila que la tarea que resuelve**. Alguien que
llega con una bolsa de ropa sucia y poco tiempo no quiere explorar: quiere respuestas.

---

## Target Users

No disponemos de investigación de usuarios ni de datos demográficos del negocio. Por
tanto los perfiles se describen por **situación y necesidad**, que es lo que sí podemos
inferir con honestidad del propio servicio. Cualquier afirmación demográfica
(edad, ingresos, procedencia) queda explícitamente fuera hasta que exista dato real.

| Perfil | Situación | Qué necesita de la web |
|--------|-----------|------------------------|
| Sin lavadora en casa | Vivienda pequeña, alquiler, avería | Precio, horario y ubicación. Recurrencia. |
| Colada de gran volumen | Edredones, cortinas, ropa de cama, toallas | Capacidad de las máquinas y precio por tamaño |
| Vivienda compartida | Piso compartido, rotación de inquilinos | Rapidez, precio por carga, si hay que esperar |
| Estancia temporal | Estudiantes, trabajo temporal, visita larga | Cómo funciona sin conocer el sitio. Claridad total. |
| Prisa puntual | Necesidad urgente, imprevisto | Horario de hoy y tiempo total del ciclo |
| Micro-negocio | Peluquería, restaurante pequeño, alojamiento turístico | Volumen, coste y disponibilidad |

Un rasgo transversal domina el diseño: **muchos llegan por primera vez y no saben cómo
funciona una lavandería de autoservicio**. La web debe eliminar esa incertidumbre antes
de que se convierta en motivo para no venir.

---

## Business Goal

En orden de prioridad:

1. **Convertir búsqueda local en visita física.** El objetivo real es que alguien aparezca en el local.
2. **Responder las dudas que frenan la primera visita:** precio, horario, ubicación, cómo se usa.
3. **Transmitir confianza y limpieza.** Se deja ropa propia en manos de una máquina ajena; la percepción de higiene y cuidado no es decorativa, es comercial.
4. **Reducir fricción en el local.** Quien llega habiendo leído "cómo funciona" necesita menos ayuda del personal.
5. **Construir marca reconocible** para que la segunda visita no dependa de volver a buscar.

---

## Primary User Goals

Qué quiere resolver alguien que entra en la web, por frecuencia esperada:

1. **¿Cuánto me cuesta?** Precio por tamaño de carga.
2. **¿Está abierto y dónde está?** Horario y ubicación.
3. **¿Cómo funciona?** Secuencia concreta: llegar, cargar, pagar, secar, recoger.
4. **¿Cabe mi colada?** Capacidades disponibles.
5. **¿Es un sitio limpio y cuidado?** Se responde visualmente, no con texto.
6. **¿Y si tengo un problema?** Vía de contacto.

---

## Primary CTA

**CTA primario: "Ver tarifas".**

Razonamiento: es un autoservicio de acceso libre. No hay nada que reservar, comprar ni
registrar, así que forzar un CTA transaccional sería inventar un modelo de negocio que no
existe. La pregunta que de verdad bloquea la visita es el precio, luego el CTA principal
debe resolverla.

- **CTA secundario:** "Cómo funciona" — atiende al usuario primerizo, el segmento con más fricción.
- **CTA de apoyo persistente:** ubicación y horario, accesibles sin scroll profundo.
- **CTA de contacto:** disponible pero nunca prioritario. Necesitar contacto es señal de que la web no ha explicado bien algo.

Esta decisión queda registrada en [`DECISIONS.md`](./DECISIONS.md) y no debe cambiarse sin
registrar una decisión nueva.

---

## Brand Personality

La marca **debe** sentirse:

cercana · alegre · moderna · limpia · familiar · accesible · divertida · luminosa · europea · mediterránea

La marca **no** debe sentirse:

- estética *cyberpunk*
- estética *nightclub* o discoteca
- estética casino
- exceso de negro
- excesivamente tecnológica o *sci-fi*
- genéricamente americana

Traducción operativa, para que esto sea aplicable y no solo declarativo:

| En lugar de | Usar |
|-------------|------|
| Fondos oscuros con neón | Fondos claros con lavados pastel |
| Resplandores y *bloom* | Luz natural y sombras suaves |
| Tipografía técnica o condensada | Tipografía redondeada y amable |
| Lenguaje de producto SaaS | Lenguaje de barrio, directo y cálido |
| Rigor de retícula corporativa | Formas orgánicas y curvas |

El detalle visual completo vive en [`VISUAL_DIRECTION.md`](./VISUAL_DIRECTION.md).

---

## Product Principles

1. **Claridad antes que espectáculo.** Si una animación compite con un precio, gana el precio.
2. **Responder antes de persuadir.** Primero el dato, después el argumento.
3. **El primerizo manda.** Ante la duda, se diseña para quien no ha pisado nunca una lavandería de autoservicio.
4. **Honestidad en el dato.** Ningún precio, horario o cifra sin confirmar. Ver [`DECISIONS.md`](./DECISIONS.md) D-010.
5. **Móvil primero, de verdad.** El uso realista es un teléfono en la calle o en casa decidiendo si salir.
6. **Accesible por defecto.** Contraste y navegación por teclado son requisito, no mejora.
7. **Ligereza como rasgo de producto.** Una web lenta contradice el mensaje de "más tiempo para ti".
8. **Alegría contenida.** La marca es divertida; la interfaz es tranquila. La diversión vive en ilustración y color, no en la interacción.
9. **Sin funcionalidad especulativa.** No se construye nada que el local no pueda sostener hoy.

---

## Non-goals

Fuera de alcance en esta fase. Cada punto requiere una SPEC nueva y una decisión
registrada para reactivarse:

- Reservas o gestión de turnos de máquina
- Cuentas de usuario, registro o área privada
- Pagos online, monedero o suscripciones
- E-commerce (venta de detergente u otros productos)
- Blog o gestión de contenidos editorial
- PWA, modo offline, notificaciones
- Internacionalización (i18n) o multi-idioma
- Estado de máquinas en tiempo real o telemetría
- Reseñas, valoraciones o integraciones sociales
- Panel de administración

---

## Datos pendientes de confirmación

Nada de lo siguiente está confirmado. Aparece en las referencias visuales como
**contenido de maqueta** y debe tratarse como `[PLACEHOLDER: ...]` hasta que el negocio lo
verifique. Ver [`DECISIONS.md`](./DECISIONS.md) D-010.

| Dato | Estado |
|------|--------|
| Precios por tamaño de carga | Sin confirmar |
| Capacidades reales de lavadoras y secadoras | Sin confirmar |
| Dirección postal | Sin confirmar |
| Teléfono y WhatsApp | Sin confirmar |
| Email | Sin confirmar |
| Horario de apertura | Sin confirmar |
| Métodos de pago aceptados | Sin confirmar |
| Cifras de negocio (clientes, años, nº de máquinas) | Sin confirmar |
| Servicios adicionales | Sin confirmar |
| Perfiles y enlaces sociales | Sin confirmar |

Los eslóganes presentes en las referencias ("Tu colada, más fácil, más tiempo para ti",
"Lava, seca, disfruta", "Limpio, rápido y a tu manera") son **copy candidato** creado por
el propio negocio. Pueden usarse como punto de partida, pero no son definitivos y no
deben tratarse como datos operativos.

---

*Última actualización: agosto 2026*
