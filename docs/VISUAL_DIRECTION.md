# VISUAL_DIRECTION.md — Dirección artística

> **Documento:** Guía artística global de Burbujas de Luz. Define *cómo debe verse y sentirse* la marca.
> **Relación:** El *qué* y el *para quién* están en [`PRODUCT.md`](./PRODUCT.md). Los tokens y reglas
> reutilizables están en [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Este documento es el criterio
> estético del que se derivan esos tokens.

---

## 0. La regla que resume todo

**Burbujas de Luz no debe parecer una discoteca.**

El nombre contiene "luz" y "burbujas", dos palabras que empujan con facilidad hacia el
error: neón sobre negro, resplandores, partículas por todas partes, morados saturados.
Ese es exactamente el resultado equivocado.

Las burbujas deben funcionar como un elemento **alegre, luminoso y algo mágico integrado
en una lavandería realista y acogedora**. Son un detalle de una escena creíble, no el
sujeto de la escena.

La estética debe sentirse:

**moderna europea + mediterránea + familiar + premium accesible**

y nunca:

**cyberpunk + nightclub + sci-fi oscura + casino**

Si una decisión visual es ambigua, la pregunta correcta es: *¿esto se parece más a una
lavandería sevillana luminosa a media mañana, o a un club nocturno?* La primera respuesta
siempre gana.

---

## 1. Referencias visuales

Los tres archivos son la fuente estética. Deben consultarse antes de tomar cualquier
decisión visual nueva.

| Archivo | Qué define | Qué **no** es |
|---------|------------|---------------|
| [`/public/design/hero-reference.webp`](../public/design/hero-reference.webp) | Espacio, iluminación, composición y ambiente del hero | No es la UI final. No contiene el layout que implementaremos. |
| [`/public/design/design-board.webp`](../public/design/design-board.webp) | Paleta, tipografía, formas, iconografía, cards, botones, gradientes | No es una maqueta a copiar píxel a píxel |
| [`/public/design/responsive-reference.webp`](../public/design/responsive-reference.webp) | Layout, jerarquía visual y comportamiento entre vistas | El contenido comercial que muestra es maqueta, no dato real |

Regla asociada: estas imágenes son **referencia**, no assets de UI. No deben usarse como
fondo ni como contenido de la web salvo que una SPEC lo indique explícitamente.

---

## 2. Dirección visual

### Light-first

El principio estructural. Las superficies son **blancas o casi blancas**, con lavados de
color pastel muy diluidos. El color no vive en los fondos, vive en acentos: iconos,
badges, ilustración, el logo.

- El fondo por defecto es claro. Siempre.
- No existe modo oscuro en esta fase, ni superficies oscuras como recurso de diseño.
- El negro no se usa como fondo. `#1A1A2E` existe **solo como color de texto**.
- Un bloque oscuro a ancho completo es señal de que algo se ha desviado de la dirección.

### Aire y respiración

La referencia del hero es deliberadamente **vacía en su mitad izquierda y central**. Ese
vacío no es un defecto de la imagen: es el espacio donde vive la interfaz.

- El espacio en blanco es un elemento de diseño, no espacio desaprovechado.
- Los bloques de contenido se apoyan en zonas tranquilas, nunca sobre la parte más
  ocupada de una fotografía.
- Antes de añadir un elemento decorativo, comprobar si el aire estaba haciendo un trabajo mejor.

### Alegría contenida

La marca es divertida; la interfaz es tranquila. La diversión se expresa en color,
ilustración y forma. No en interacciones ruidosas ni en movimiento constante.

---

## 3. Composición

- **Jerarquía en tres niveles por sección:** titular, apoyo, acción. Si aparece un cuarto nivel, la sección hace demasiado.
- **Una idea por sección.** Cada bloque responde a una única pregunta del usuario.
- **Alineación a la izquierda** para bloques de texto largo; centrado reservado a titulares de sección cortos.
- **Contenido sobre fotografía** solo en zonas de baja actividad visual y siempre con separación de legibilidad (ver §5).
- **Formas orgánicas como separadores** entre secciones, en lugar de líneas rectas o divisores duros.
- **Retícula flexible:** las tarjetas se agrupan en 2, 3 o 4 columnas según contenido, nunca forzando huecos vacíos para cuadrar la retícula.

---

## 4. Iluminación

La luz es el rasgo más característico de la referencia y debe preservarse.

- **Luz natural, direccional y lateral.** En la referencia entra por un ventanal a la izquierda.
- **Alta exposición, sin quemar.** Luminoso pero con detalle en los blancos.
- **Sombras suaves y largas**, con difusión amplia y bordes indefinidos.
- **Temperatura cálida** en la luz, que equilibra los azules y violetas de la marca y aporta el carácter mediterráneo.
- **Nunca luz artificial de color.** Sin focos de escena, sin *rim light* de neón, sin destellos.
- Los reflejos existen (suelo pulido, cristal de las máquinas) pero son sutiles y difusos, nunca especulares y duros.

---

## 5. Fotografía

- Interiores reales, luminosos y ventilados. Plantas naturales, textiles, madera clara.
- Presencia humana ocasional y natural. Gestos cotidianos, nunca poses de catálogo.
- Textiles doblados y cestas de colores: aportan color real sin necesidad de filtros.
- **Sin filtros de color agresivos.** Corrección natural, saturación moderada.
- Encuadres con aire; se evita el plano cerrado y saturado de objetos.
- Cuando el texto se superpone a una fotografía, la legibilidad se resuelve con una
  **superficie clara translúcida** (blanco con transparencia y desenfoque), nunca con un
  velo negro. Un *scrim* oscuro sobre foto contradice la dirección light-first.

---

## 6. Tratamiento de burbujas

Las burbujas son el motivo distintivo y el mayor riesgo estético del proyecto. Reglas:

- **Escasas.** Pocas, grandes y bien colocadas antes que muchas y pequeñas. La densidad tiene tope por breakpoint (ver [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)).
- **Muy transparentes.** Se insinúan. Una burbuja opaca deja de ser una burbuja.
- **Iridiscentes, no de color plano.** Rastro suave de violeta, cian y rosa en el borde.
- **Con borde definido y relleno vacío.** El volumen lo dan el rim light y un brillo especular pequeño, no un relleno sólido.
- **Movimiento lento y ascendente**, con deriva lateral orgánica. Nunca trayectorias rectas ni velocidad constante perceptible.
- **Nunca sobre texto.** Ni por detrás con opacidad suficiente para reducir contraste. La legibilidad manda siempre.
- **Nunca interactivas** en esta fase. No capturan puntero ni foco, y son invisibles para lectores de pantalla.
- **Nunca junto al logo.** El logo ya contiene burbujas; sumar más produce ruido visual. Ver §9.
- Se desactivan por completo con `prefers-reduced-motion: reduce`.

Anti-patrón concreto: un campo de partículas cubriendo el viewport. Eso es un salvapantallas,
no una identidad.

---

## 7. Gradientes

- **Lavados pastel, no rampas saturadas.** El gradiente aparece como una neblina de color sobre blanco.
- Transiciones **suaves y de recorrido largo**; sin bandas ni cortes perceptibles.
- **Multi-hue permitido** (violeta → rosa → cian → melocotón) siempre en baja saturación.
- Se usan en: fondos de sección, formas orgánicas, murales, superficies decorativas.
- **No se usan** en: texto, iconos, bordes de campos de formulario, ni fondos que deban alojar texto pequeño.
- Un gradiente nunca debe reducir el contraste del texto que lo cubre por debajo del mínimo exigido.

---

## 8. Formas orgánicas

- Blobs y curvas irregulares como fondo y separación entre secciones.
- Bordes redondeados generosos en todo elemento de interfaz. La marca no tiene esquinas duras.
- Las formas se **solapan y se cortan** entre sí, creando profundidad sin sombras marcadas.
- Se inspiran en el mural de la referencia: ondas de color que atraviesan la pared.
- Sin geometría técnica: nada de hexágonos, retículas visibles, líneas de circuito ni patrones isométricos.

---

## 9. Presupuesto de saturación

Regla operativa que evita que la dirección se degrade en la práctica.

**El logo consume todo el presupuesto de saturación de la página.**

El logo es, con mucha diferencia, el objeto más saturado de la marca: burbujas azules y
violetas intensas y un rayo naranja de alto contraste. Es correcto que sea así, porque es
el punto focal.

La consecuencia es que **todo lo demás se mantiene pastel y contenido**. Si la interfaz
intenta igualar la intensidad del logo, el resultado agregado es precisamente la estética
de discoteca que este documento prohíbe, aunque cada elemento aislado parezca defendible.

Corolarios:

- Un elemento saturado por zona visual, como máximo.
- Los acentos de color se usan en superficies pequeñas: iconos, badges, indicadores.
- Si el logo y un bloque saturado compiten en el mismo espacio, el bloque cede.
- No se colocan burbujas decorativas junto al logo.

**Ejemplo de lo que no se debe hacer.** La versión anterior del logo del proyecto tenía un
cuadrado negro con un estallido de arcoíris a máxima saturación. Concentraba a la vez
cuatro anti-patrones: exceso de negro, saturación sin control, resplandor y estética de
casino. Ese archivo ha sido retirado y sirve como referencia negativa explícita.

---

## 10. Relación entre contenido e imagen

- La imagen **acompaña**, el contenido **manda**. Si compiten, la imagen se atenúa.
- Las fotografías no llevan texto crítico encima si puede evitarse; es preferible situarlo en una superficie contigua.
- Cuando la superposición es necesaria: superficie clara translúcida con desenfoque, y verificación de contraste real, no estimada.
- Las imágenes decorativas llevan `alt=""` y `aria-hidden`; solo las informativas describen contenido.
- Ninguna información existe **solo** en una imagen. Precios, horarios y pasos van siempre en texto real, por accesibilidad, SEO y traducibilidad.

---

## 11. Tratamiento de espacios vacíos

- El vacío es intencionado. No se rellena por incomodidad.
- El espacio vertical entre secciones es amplio y consistente; marca el ritmo de lectura.
- En pantallas grandes el contenido tiene ancho máximo y el aire crece a los lados, en lugar de estirarse hasta los bordes.
- Un vacío es correcto si al eliminarlo la página se lee peor. Ese es el único test.

---

## 12. Responsive

La dirección visual debe sobrevivir al cambio de tamaño. Lo que cambia es la
**composición**, no la identidad.

| | Mobile | Tablet | Desktop |
|---|--------|--------|---------|
| Fotografía de fondo | Encuadre recortado a la zona útil, o sustituida por lavado de color | Encuadre parcial | Escena completa |
| Burbujas | Mínimas | Moderadas | Presencia plena, siempre contenida |
| Formas orgánicas | Simplificadas, 1-2 por vista | Intermedias | Completas y solapadas |
| Densidad de contenido | Una columna, ritmo vertical | 2 columnas donde aporte | Hasta 3-4 columnas |
| Aire | Reducido pero presente | Intermedio | Generoso |

Reglas transversales:

- **Móvil primero.** Se diseña la vista estrecha y se enriquece hacia arriba, no al contrario.
- Lo decorativo es lo primero que se sacrifica al reducir espacio. El contenido nunca.
- En móvil el hero **no** debe requerir scroll para mostrar su titular y su CTA.
- La fotografía de fondo no debe deformarse nunca; se recorta manteniendo proporción.
- Ningún texto por debajo de 16px en cuerpo, en ningún breakpoint.

---

## 13. Anti-patrones

Lista explícita. La aparición de cualquiera de estos elementos indica desviación de la dirección:

- Fondos negros o muy oscuros, o superficies oscuras a ancho completo
- Neón, resplandor, *bloom*, `box-shadow` de color saturado
- *Glassmorphism* oscuro; velos negros sobre fotografía
- Gradientes saturados al 100% de opacidad
- Campos de partículas densos; burbujas sobre texto
- Estética *sci-fi*: HUD, retículas técnicas, líneas de circuito, monoespaciada decorativa
- Iluminación de escenario: focos de color, contraluces intensos, destellos
- Morado sobre negro como combinación dominante
- Sombras duras y de alto contraste
- Tipografía condensada, técnica o excesivamente geométrica
- Animación continua que no responde a intención del usuario
- Esquinas vivas en elementos de interfaz

---

## 14. Cómo validar una pantalla

Antes de considerar terminada una vista:

1. ¿El fondo dominante es claro?
2. ¿Hay como máximo un elemento saturado por zona visual?
3. ¿Se lee todo el texto sin esfuerzo, con contraste verificado?
4. ¿Alguna burbuja se solapa con texto o control?
5. ¿Funciona en móvil sin perder el titular ni el CTA?
6. ¿Sigue leyéndose bien con el movimiento desactivado?
7. Entornando los ojos: ¿la impresión es *luminoso y limpio* o *oscuro y ruidoso*?

Si la pregunta 7 falla, ninguna de las demás compensa.

---

*Última actualización: agosto 2026*
