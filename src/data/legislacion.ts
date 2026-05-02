export type EstadoLey = 'en-comision' | 'primer-debate' | 'segundo-debate' | 'archivado' | 'aprobada';

export interface Expediente {
  numero: string;
  titulo: string;
  resumen: string;
  estado: EstadoLey;
  comision: string;
  presentado: string;
  fuenteUrl: string;
}

export const expedientes: Expediente[] = [
  {
    numero: '23.771',
    titulo: 'Ley para Regular la Inteligencia Artificial en Costa Rica',
    resumen: 'Marco general para regular el desarrollo, uso y aplicación de IA en CR. Crea la Autoridad Reguladora de IA (ARIA). Bloqueado por oposición de CAMTIC y otros actores del ecosistema.',
    estado: 'en-comision',
    comision: 'Ciencia, Tecnología y Educación',
    presentado: '2023',
    fuenteUrl: 'https://www.asamblea.go.cr/',
  },
  {
    numero: '23.919',
    titulo: 'Sandbox regulatorio para IA',
    resumen: 'Crea espacios controlados de experimentación regulatoria para tecnologías emergentes de IA. Modelo similar a sandboxes financieros del sector fintech.',
    estado: 'en-comision',
    comision: 'Ciencia, Tecnología y Educación',
    presentado: '2024',
    fuenteUrl: 'https://www.asamblea.go.cr/',
  },
  {
    numero: '24.484',
    titulo: 'Marco regulatorio adaptativo de IA basado en riesgo',
    resumen: 'Propone clasificación escalonada por nivel de riesgo (similar a EU AI Act). Versión más reciente y técnicamente robusta de los tres expedientes.',
    estado: 'en-comision',
    comision: 'Ciencia, Tecnología y Educación',
    presentado: '2025',
    fuenteUrl: 'https://www.asamblea.go.cr/',
  },
];
