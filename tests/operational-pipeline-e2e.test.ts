/**
 * Contrato operativo de Fase 5C: una corrida puede producir señales,
 * propuestas e issues, pero ninguna capa genera una ficha o aplica un cambio.
 */
import { describe, expect, it } from 'vitest';
import inventoryJson from '../src/data/json/monitoreo.json';
import type { InventarioMonitoreo } from '../src/data/monitoreo';
import {
  buildEvidenceProposal,
  type ClassifiedItem,
} from '../scripts/classify-vs-repo';
import { buildScrapeReviewBody } from '../scripts/create-scrape-review-issue';
import {
  buildBody as buildLegislationBody,
  selectAsambleaReport,
} from '../scripts/create-legislacion-update-issue';
import { buildMonitoringDueReport } from '../scripts/check-monitoring-due';
import { buildMonitoringIssueBody } from '../scripts/create-monitoring-review-issue';

describe('pipeline operativo completo sin mutaciones automáticas', () => {
  it('lleva una señal nueva hasta una propuesta no verificada y una tarea auditable', () => {
    const item: ClassifiedItem = {
      bucket: 'nuevo',
      reason: 'score 8, institución conocida, sin match en repo',
      institucionId: 'ins',
      candidate: {
        source: 'google-news',
        candidate: {
          titulo: '[ins · medio.example] INS anuncia un posible sistema predictivo',
          url: 'https://medio.example/senal',
        },
        classification: {
          score: 8,
          tipo: 'proyecto-nuevo',
          resumen: 'La nota secundaria describe un posible sistema predictivo.',
          tags: ['ins', 'seguros'],
        },
      },
    };
    const proposal = buildEvidenceProposal(item);
    expect(proposal).not.toBeNull();

    const body = buildScrapeReviewBody({
      classifiedAt: '2026-08-21T12:10:00.000Z',
      sourceRanAt: '2026-08-21T12:00:00.000Z',
      totalDeduped: 1,
      totalRaw: 1,
      counts: {
        ya_existe: 0,
        ruido: 0,
        nuevos: 1,
        revisar: 0,
        propuestas_evidencia: 1,
      },
      nuevos: [{
        titulo: item.candidate.candidate.titulo,
        url: item.candidate.candidate.url,
        source: item.candidate.source,
        score: item.candidate.classification?.score ?? null,
      }],
      evidenceProposals: [proposal!],
    }, 'e2e-run');

    expect(body).toContain('scrape-review:e2e-run');
    expect(body).toContain('propuestas no verificadas');
    expect(body).toContain('Candidato nuevo');
    expect(body).toContain('No crean proyectos');
    expect(body).not.toContain('stub-nuevos');
  });

  it('convierte el reporte consolidado legislativo en alerta, no en update aplicado', () => {
    const report = selectAsambleaReport({
      reports: [{
        scraper: 'asamblea',
        ranAt: '2026-08-21T12:00:00.000Z',
        fetched: 7,
        matched: 7,
        changes: [{
          scraper: 'asamblea',
          dataset: 'legislacion',
          kind: 'update',
          id: '23.919',
          field: 'comision',
          before: { es: 'Derechos Humanos', en: 'Human Rights' },
          after: { es: 'Ciencia, Tecnología y Educación', en: 'Science, Technology and Education' },
          rationale: 'Una señal secundaria difiere del catálogo.',
          sourceUrl: 'https://delfino.cr/asamblea/proyecto/23919',
          scrapedAt: '2026-08-21T12:00:01.000Z',
        }],
        candidates: [],
        notes: [],
      }],
    });

    expect(report).not.toBeNull();
    const body = buildLegislationBody(report!, 'e2e-legislation');
    expect(body).toContain('contrasta la señal con una fuente primaria');
    expect(body).toContain('push y despliegue requieren autorización separada');
  });

  it('convierte la fecha editorial en recordatorio sin registrar una revisión', () => {
    const report = buildMonitoringDueReport(
      inventoryJson as InventarioMonitoreo,
      '2026-08-21',
      7,
    );
    const body = buildMonitoringIssueBody(report, report.items);

    expect(report.items.map(({ id }) => id)).toEqual(['legislacion-ia']);
    expect(body).toContain('no implica que haya ocurrido un cambio');
    expect(body).toContain('no cambian proyectos, expedientes, indicadores ni fechas');
  });
});
