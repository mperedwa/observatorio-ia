import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const workflow = (name: string) => readFileSync(
  join(process.cwd(), '.github/workflows', name), 'utf8',
);

describe('Telegram del Observatorio desactivado por defecto', () => {
  it('omite el envío de clasificación sin un opt-in explícito', () => {
    expect(workflow('scrape.yml')).toContain(
      "- name: Notify Telegram (clasificación vs repo)\n        if: ${{ vars.OBSERVATORIO_TELEGRAM_ENABLED == 'true' }}",
    );
  });

  it.each(['enia', 'ilia', 'oecd'])('mantiene el monitor %s sin entregarle credenciales de Telegram', (name) => {
    const yaml = workflow(`${name}-watch.yml`);
    for (const key of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) {
      expect(yaml).toContain(
        key + ": ${{ vars.OBSERVATORIO_TELEGRAM_ENABLED == 'true' && secrets." + key + " || '' }}",
      );
      expect(yaml).not.toContain(key + ': ${{ secrets.' + key + ' }}');
    }
    expect(yaml).toContain(`run: npm run watch:${name}`);
    expect(yaml).toContain(`scraper-runs/${name}-state.json`);
    expect(yaml).toContain('schedule:');
  });
});
