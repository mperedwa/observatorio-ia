import { describe, expect, it } from 'vitest';
import inventoryJson from '../src/data/json/monitoreo.json';
import type { InventarioMonitoreo } from '../src/data/monitoreo';
import {
  isMonitoringIssueResolved,
  parseMonitoringMarkers,
  selectResolvedMonitoringIssues,
  type MonitoringIssue,
} from '../scripts/close-resolved-monitoring-issues';

const ISSUE_URL = 'https://github.com/mperedwa/observatorio-ia/issues/42';
const issue: MonitoringIssue = {
  number: 42,
  html_url: ISSUE_URL,
  body: '<!-- monitoring-review:v2:legislacion-ia:2026-08-28 -->',
};

function resolvedInventory(resultado: 'sin-cambios' | 'cambio-detectado' | 'cambio-publicado') {
  const inventory = structuredClone(inventoryJson) as InventarioMonitoreo;
  const front = inventory.frentes.find(({ id }) => id === 'legislacion-ia')!;
  front.fechaUltimaRevision = '2026-08-28';
  front.fechaProximaRevision = '2026-09-04';
  inventory.revisiones.unshift({
    id: 'revision-legislacion-2026-08-28',
    fecha: '2026-08-28',
    frenteId: 'legislacion-ia',
    resultado,
    resumen: { es: 'Revisión trazada.', en: 'Traceable review.' },
    fuenteUrl: front.fuenteUrl,
    issueUrl: ISSUE_URL,
    transiciones: resultado === 'sin-cambios' ? [] : [{
      objetoTipo: 'expediente',
      objetoId: '23.771',
      campo: 'estado',
      antes: 'en-comision',
      despues: 'dictaminado',
    }],
  });
  return inventory;
}

describe('cierre seguro de agenda editorial', () => {
  it('reconoce markers v2 y legacy', () => {
    expect(parseMonitoringMarkers(issue.body)).toEqual([
      { frenteId: 'legislacion-ia', fechaRevision: '2026-08-28' },
    ]);
    expect(parseMonitoringMarkers('<!-- monitoring-review:legislacion-ia:2026-08-28 -->')).toHaveLength(1);
  });

  it('cierra solo resultados finales vinculados al issue', () => {
    expect(isMonitoringIssueResolved(resolvedInventory('sin-cambios'), issue)).toBe(true);
    expect(isMonitoringIssueResolved(resolvedInventory('cambio-publicado'), issue)).toBe(true);
    expect(isMonitoringIssueResolved(resolvedInventory('cambio-detectado'), issue)).toBe(false);
  });

  it('no cierra sin avance de fecha ni con otro issueUrl', () => {
    const noAdvance = resolvedInventory('sin-cambios');
    noAdvance.frentes.find(({ id }) => id === 'legislacion-ia')!.fechaProximaRevision = '2026-08-28';
    expect(isMonitoringIssueResolved(noAdvance, issue)).toBe(false);

    const wrongIssue = resolvedInventory('sin-cambios');
    wrongIssue.revisiones[0].issueUrl = 'https://github.com/mperedwa/observatorio-ia/issues/99';
    expect(isMonitoringIssueResolved(wrongIssue, issue)).toBe(false);

    const staleReview = resolvedInventory('sin-cambios');
    staleReview.revisiones[0].fecha = '2026-08-27';
    expect(isMonitoringIssueResolved(staleReview, issue)).toBe(false);
  });

  it('selecciona únicamente issues comprobablemente resueltos', () => {
    const unresolved = { ...issue, number: 43, html_url: `${ISSUE_URL}0` };
    expect(selectResolvedMonitoringIssues(resolvedInventory('sin-cambios'), [issue, unresolved]))
      .toEqual([issue]);
  });
});
