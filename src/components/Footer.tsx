export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-600 flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <p className="font-semibold text-slate-900">Observatorio IA Costa Rica</p>
          <p className="mt-1">Datos públicos. Iniciativa independiente.</p>
        </div>
        <div className="text-xs text-slate-500">
          <p>Última actualización: mayo 2026</p>
          <p className="mt-1">Fuentes: instituciones públicas de Costa Rica + ILIA (CEPAL).</p>
        </div>
      </div>
    </footer>
  );
}
