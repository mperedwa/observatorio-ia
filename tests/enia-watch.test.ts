import { describe, expect, it } from 'vitest';
import { detectEniaSignals } from '../scrapers/enia-watch';

const HTML = `
  <html>
    <body>
      <main>
        <h1>Inteligencia Artificial</h1>
        <p>La Estrategia Nacional de Inteligencia Artificial, ENIA 2024-2027, orienta la política pública.</p>
        <p>El Plan de Acción ENIA organiza los compromisos interinstitucionales.</p>
        <a href="/files/Plan-de-Accion-ENIA-2025.pdf">Plan de Acción ENIA</a>
        <a href="/contacto">Contacto</a>
      </main>
      <script>window.dynamicNonce = "123";</script>
    </body>
  </html>
`;

describe('enia-watch', () => {
  it('extrae periodos, enlaces y texto relevante de forma estable', () => {
    const result = detectEniaSignals(HTML, 'https://micitt.example/ia');

    expect(result.strategyPeriods).toEqual(['2024-2027']);
    expect(result.planUrls).toEqual([
      'https://micitt.example/files/Plan-de-Accion-ENIA-2025.pdf',
    ]);
    expect(result.relevantLinks).toHaveLength(1);
    expect(result.relevantText).toHaveLength(2);
    expect(result.pageFingerprint).toMatch(/^[a-f0-9]{64}$/);
  });

  it('ignora scripts dinámicos al calcular la huella', () => {
    const first = detectEniaSignals(HTML, 'https://micitt.example/ia');
    const second = detectEniaSignals(
      HTML.replace('dynamicNonce = "123"', 'dynamicNonce = "999"'),
      'https://micitt.example/ia',
    );

    expect(second.pageFingerprint).toBe(first.pageFingerprint);
  });

  it('detecta un cambio real en el periodo de la estrategia', () => {
    const first = detectEniaSignals(HTML, 'https://micitt.example/ia');
    const second = detectEniaSignals(
      HTML.replace('2024-2027', '2028-2031'),
      'https://micitt.example/ia',
    );

    expect(second.strategyPeriods).toEqual(['2028-2031']);
    expect(second.pageFingerprint).not.toBe(first.pageFingerprint);
  });
});
