export const historialTranslations = {
  es: {
    kicker: 'Seguimiento editorial',
    titulo: 'Historial y monitoreo',
    intro:
      'Esta página muestra qué se revisa, con qué frecuencia y qué ocurrió en cada revisión. La bitácora conserva tanto los cambios publicados como las comprobaciones que terminaron sin cambios.',
    corte: 'Estado de la agenda al',
    resumen: {
      frentes: 'frentes monitoreados',
      revisiones: 'revisiones registradas',
      sinCambios: 'revisiones sin cambios',
      vencidas: 'revisiones vencidas',
    },
    politicaTitulo: 'Cómo funciona el monitoreo',
    agendaTitulo: 'Agenda de próximas revisiones',
    agendaSub:
      'La fecha se actualiza después de una revisión editorial completa. Una corrida automática, por sí sola, no equivale a verificar que nada cambió.',
    agendaCols: {
      frente: 'Frente',
      alcance: 'Alcance',
      cadencia: 'Cadencia',
      ultima: 'Última revisión',
      proxima: 'Próxima revisión',
      estado: 'Estado al corte',
    },
    estados: {
      'al-dia': 'Al día',
      'vence-hoy': 'Vence hoy',
      vencida: 'Vencida',
    },
    bitacoraTitulo: 'Bitácora de revisiones',
    bitacoraSub:
      'Cada entrada identifica el resultado de la revisión y las transiciones concretas cuando sí hubo un cambio.',
    resultados: {
      'cambio-detectado': 'Cambio detectado',
      'cambio-publicado': 'Cambio publicado',
      'sin-cambios': 'Revisado sin cambios',
    },
    transiciones: 'Transiciones registradas',
    sinValorAnterior: 'Sin registro previo',
    fuente: 'Ver fuente consultada',
    api: 'Consultar estos datos en la API pública',
    cambiosTitulo: 'Cambios publicados en el sitio',
    cambiosSub:
      'Este historial conserva el detalle editorial de las actualizaciones visibles del catálogo, la legislación, los indicadores y los recursos.',
    totalCambios: 'Total de cambios publicados',
  },
  en: {
    kicker: 'Editorial monitoring',
    titulo: 'History and monitoring',
    intro:
      'This page shows what is reviewed, how often and what happened during each review. The log preserves both published changes and checks that concluded with no changes.',
    corte: 'Schedule status as of',
    resumen: {
      frentes: 'monitored areas',
      revisiones: 'recorded reviews',
      sinCambios: 'reviews with no changes',
      vencidas: 'overdue reviews',
    },
    politicaTitulo: 'How monitoring works',
    agendaTitulo: 'Upcoming review schedule',
    agendaSub:
      'The date is updated after a complete editorial review. An automated run alone does not amount to verifying that nothing changed.',
    agendaCols: {
      frente: 'Area',
      alcance: 'Scope',
      cadencia: 'Cadence',
      ultima: 'Last review',
      proxima: 'Next review',
      estado: 'Status at cutoff',
    },
    estados: {
      'al-dia': 'On schedule',
      'vence-hoy': 'Due today',
      vencida: 'Overdue',
    },
    bitacoraTitulo: 'Review log',
    bitacoraSub:
      'Each entry identifies the review outcome and the specific transitions when a change occurred.',
    resultados: {
      'cambio-detectado': 'Change detected',
      'cambio-publicado': 'Change published',
      'sin-cambios': 'Reviewed with no changes',
    },
    transiciones: 'Recorded transitions',
    sinValorAnterior: 'No previous record',
    fuente: 'View reviewed source',
    api: 'Access these data through the public API',
    cambiosTitulo: 'Changes published on the site',
    cambiosSub:
      'This history preserves the editorial detail behind visible updates to the catalog, legislation, indicators and resources.',
    totalCambios: 'Total published changes',
  },
} as const;
