/**
 * Datos registrales para textos legales.
 * [PLACEHOLDER: datos inventados a propósito — sustituir antes de publicar] (D-010, D-027)
 */

export const legalEntity = {
  /** Razón social ficticia; se nota inventada. */
  legalName: 'Lavandería Ejemplo Ficticia S.L.',
  /** CIF inventado (letra + 8 dígitos); no es un CIF real válido. */
  taxId: 'B12345678',
  registryNote:
    '[PLACEHOLDER: datos de inscripción mercantil inventados — no publicar sin sustituir]',
  /** Domicilio social: mismo local confirmado del negocio. */
  address: 'C. Virgen de la Cinta, 20, 41011 Sevilla',
} as const;
