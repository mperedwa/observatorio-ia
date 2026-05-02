import Link from 'next/link';

const items = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#instituciones', label: 'Instituciones' },
  { href: '/#legislacion', label: 'Legislación' },
  { href: '/#indicadores', label: 'Indicadores' },
  { href: '/#recursos', label: 'Recursos' },
  { href: '/#acerca', label: 'Acerca de' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-bold text-lg text-institucional-900">Observatorio IA</span>
          <span className="text-sm text-slate-500 hidden sm:inline">Costa Rica</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-700">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="hover:text-institucional-700 transition-colors">
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
