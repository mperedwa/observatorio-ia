'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Mantiene el idioma del documento correcto durante navegación cliente.
 * La exportación estática recibe además el atributo final en postbuild.
 */
export function DocumentLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = pathname?.startsWith('/en') ? 'en' : 'es';
  }, [pathname]);

  return null;
}
