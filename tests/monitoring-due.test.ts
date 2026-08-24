import { describe, expect, it } from 'vitest';
import inventoryJson from '../src/data/json/monitoreo.json';
import type { InventarioMonitoreo } from '../src/data/monitoreo';
import {
  businessDaysUntil,
  buildMonitoringDueReport,
  todayInCostaRica,
} from '../scripts/check-monitoring-due';
import {
  buildMonitoringIssueBody,
  monitoringMarker,
  legacyMonitoringMarker,
  selectUnrepresentedItems,
} from '../scripts/create-monitoring-review-issue';

const inventory = inventoryJson as InventarioMonitoreo;

describe('agenda operativa de monitoreo', () => {
  it('usa anticipación hábil por cadencia y evita alertar demasiado pronto', () => {
    const beforeWindow = buildMonitoringDueReport(inventory, '2026-08-26');
    const inWindow = buildMonitoringDueReport(inventory, '2026-08-27');

    expect(beforeWindow.items).toEqual([]);
    expect(inWindow.leadDays).toBeNull();
    expect(inWindow.leadPolicy.semanal).toBe(1);
    expect(inWindow.items[0]).toMatchObject({
      id: 'legislacion-ia',
      diasHabilesHastaVencimiento: 1,
      diasAnticipacionHabiles: 1,
    });
  });

  it('cuenta el siguiente lunes como un día hábil desde el viernes', () => {
    expect(businessDaysUntil('2026-08-28', '2026-08-31')).toBe(1);
    expect(businessDaysUntil('2026-08-31', '2026-08-28')).toBe(-1);
  });

  it('anticipa solo los frentes que vencen dentro de la ventana', () => {
    const report = buildMonitoringDueReport(
      inventory,
      '2026-08-21',
      7,
      '2026-08-21T12:00:00.000Z',
    );

    expect(report.items.map(({ id }) => id)).toEqual(['legislacion-ia']);
    expect(report.items[0]).toMatchObject({
      estado: 'proximo',
      diasHastaVencimiento: 7,
      fechaProximaRevision: '2026-08-28',
    });
  });

  it('distingue revisiones vencidas, de hoy y próximas', () => {
    const fixture = structuredClone(inventory);
    fixture.frentes = fixture.frentes.slice(0, 3);
    fixture.frentes[0].fechaProximaRevision = '2026-08-20';
    fixture.frentes[1].fechaProximaRevision = '2026-08-21';
    fixture.frentes[2].fechaProximaRevision = '2026-08-24';

    const report = buildMonitoringDueReport(fixture, '2026-08-21', 7);

    expect(report.counts).toEqual({ total: 3, vencidos: 1, venceHoy: 1, proximos: 1 });
    expect(report.items.map(({ estado }) => estado)).toEqual([
      'vencido',
      'vence-hoy',
      'proximo',
    ]);
  });

  it('usa la fecha civil de Costa Rica, no la fecha UTC', () => {
    expect(todayInCostaRica(new Date('2026-08-22T01:30:00.000Z'))).toBe('2026-08-21');
  });

  it('no repite un frente/fecha que ya tiene un issue abierto', () => {
    const report = buildMonitoringDueReport(inventory, '2026-08-21', 7);
    const item = report.items[0];
    const issues = [{ number: 10, body: `Pendiente\n${monitoringMarker(item)}` }];

    expect(selectUnrepresentedItems(report.items, issues)).toEqual([]);
  });

  it('reconoce el marcador anterior mientras #42 permanezca abierto', () => {
    const report = buildMonitoringDueReport(inventory, '2026-08-21', 7);
    const item = report.items[0];
    const issues = [{ number: 42, body: legacyMonitoringMarker(item) }];

    expect(selectUnrepresentedItems(report.items, issues)).toEqual([]);
  });

  it('el issue explica el proceso y nunca autoriza cambios automáticos', () => {
    const report = buildMonitoringDueReport(inventory, '2026-08-21', 7);
    const body = buildMonitoringIssueBody(report, report.items);

    expect(body).toContain(monitoringMarker(report.items[0]));
    expect(body).toContain('`sin-cambios`');
    expect(body).toContain('modo dry-run');
    expect(body).toContain('Mario no necesita actuar todavía');
    expect(body).toContain('Cerrar el issue solo después');
    expect(body).toContain('no cambian proyectos, expedientes, indicadores ni fechas');
  });
});
