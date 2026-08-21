import { describe, expect, it } from 'vitest';
import { normalizeEstado } from '../scrapers/asamblea';

describe('normalización del monitor legislativo', () => {
  it('solo propone estados admitidos por el schema editorial', () => {
    expect(normalizeEstado('En comisión')).toBe('en-comision');
    expect(normalizeEstado('Dictaminado')).toBe('dictaminado');
    expect(normalizeEstado('Primer debate')).toBe('primer-debate');
    expect(normalizeEstado('Segundo debate')).toBe('segundo-debate');
    expect(normalizeEstado('Archivado')).toBe('archivado');
    expect(normalizeEstado('Aprobado')).toBe('aprobada');
  });

  it('no degrada un estado curado a la etiqueta secundaria “Presentado”', () => {
    expect(normalizeEstado('Presentado')).toBeNull();
  });
});
