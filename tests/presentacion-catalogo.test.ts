import { describe, expect, it } from 'vitest';
import { proyectos } from '../src/data/proyectos';
import {
  formatearFechaCatalogo,
  obtenerCapaCatalogo,
  obtenerFechaReferencia,
  resumirInstitucionCatalogo,
} from '../src/data/presentacion-catalogo';

describe('presentación del catálogo', () => {
  it('deriva las tres capas de una institución desde sus fichas', () => {
    const ccss = proyectos.filter((proyecto) => proyecto.institucionId === 'ccss');
    expect(resumirInstitucionCatalogo(ccss)).toEqual({
      total: 7,
      verificado: 1,
      seguimiento: 3,
      ecosistema: 3,
    });
  });

  it('usa la fecha explícita que corresponde a la fase', () => {
    const lidia = proyectos.find((proyecto) => proyecto.id === 'ccss-lidia');
    const aida = proyectos.find((proyecto) => proyecto.id === 'ccss-aida');
    expect(lidia && obtenerFechaReferencia(lidia)).toEqual({
      fecha: '2023',
      tipo: 'inicio-piloto',
    });
    expect(aida && obtenerFechaReferencia(aida)).toEqual({
      fecha: '2025-11-11',
      tipo: 'anuncio',
    });
  });

  it('clasifica sin recurrir al estado legacy', () => {
    const tribu = proyectos.find((proyecto) => proyecto.id === 'hacienda-tribu-cr');
    expect(tribu && obtenerCapaCatalogo(tribu)).toBe('ecosistema');
  });

  it('formatea fechas parciales sin inventar precisión', () => {
    expect(formatearFechaCatalogo('2026', 'es')).toBe('2026');
    expect(formatearFechaCatalogo('2026-07', 'es')).toBe('julio de 2026');
    expect(formatearFechaCatalogo('2026-07-10', 'en')).toBe('Jul 10, 2026');
  });
});
