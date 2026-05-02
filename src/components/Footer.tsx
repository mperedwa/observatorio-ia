import type { Dictionary } from '@/i18n/dictionaries';

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-600 flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <p className="font-semibold text-slate-900">{t.footer.titulo}</p>
          <p className="mt-1">{t.footer.tagline}</p>
        </div>
        <div className="text-xs text-slate-500">
          <p>{t.footer.ultimaActualizacion}</p>
          <p className="mt-1">{t.footer.fuentes}</p>
        </div>
      </div>
    </footer>
  );
}
