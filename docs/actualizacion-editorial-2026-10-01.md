# Actualización editorial, 1 de octubre de 2026

Estado: implementado y validado; Mario autorizó commit, push y despliegue tras la revisión legislativa.

## Alcance aprobado

Consolidar los informes de 20 y 27 de septiembre contrastados con fuentes primarias. La fecha del corte indica cuándo se revisó la evidencia, no una fecha nueva de lanzamiento. No es una revisión exhaustiva de todo el catálogo ni de legislación o indicadores.

1. Añadir seis fichas: INVU Vincent, SBD Auditoría, Cartago MuniBot, MICITT asistente virtual, La Unión R.O.D.U y Salud/CCSS/IAFA Dejar de Fumar y Vapear.
2. Confirmar categoría de Cartago y MICITT mediante documentación técnica y comprobación funcional. Mantener seguimiento si no se resuelve la operación de IA.
3. Añadir cuatro registros institucionales y tipos explícitos para municipalidades y órganos públicos, sin clasificar el Consejo Rector del SBD como institución autónoma por defecto.
4. Matizar exclusivamente la nota IFAM `enia-4-1-3-02`: evidencia municipal adyacente, sin atribuir cumplimiento ni correspondencia institucional.
5. Actualizar historial, conteos derivados, API y release nueva. Preservar las releases anteriores.
6. Validar schemas, pruebas, build, export bilingüe y revisión independiente del diff.

## Decisiones y exclusiones

- INVU: solicitud 17/09, publicación 18/09. Contrato USD 6.360 por 12 meses, aprobación en trámite; no operación acreditada.
- SBD Auditoría: contrato notificado 25/09 por CRC 22.477.800,67, tres meses; orden de inicio registrada. No sumar orden de pedido al monto contractual ni usar CRC 49 millones como gasto ejecutado.
- R.O.D.U y Salud: servicio documentado, técnica de IA no determinada. Operación del servicio no equivale a operación de IA confirmada.
- Salud: informe de gestión cerrado en enero de 2026; no trasladar automáticamente el estado de mantenimiento a septiembre.
- ICE bot: noticia histórica de diciembre de 2024 con fecha discordante en portal. No publicar horizonte 2026–2027 inferido.
- SBD jurídico y Santa Ana: investigación pendiente, sin alta automática.
- BCR Auditoría: antecedente de capacitación, no adquisición de sistema. No reintroducirlo como adopción.
- Brete: ya existe, sin duplicación. ICE/OIJ y AyA: sin reclasificación.
- No renovar fechas de frentes no revisados para ocultar vencimientos. Mantener la agenda honesta.
- Cambios previos del pipeline del 25/09 quedan separados; este lote no los publica.

## Fuentes de contratación verificadas

- INVU: https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260902382&cartelSeq=00
- SBD Auditoría: https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260803608&cartelSeq=00
- SBD jurídico, pendiente: https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260802614&cartelSeq=00

## Control de publicación

La preparación local no implica publicación. Antes de desplegar: revisar diff, confirmar conteos finales, preservar snapshots históricos, obtener GO y verificar sitio/API en producción. No cerrar issues de agenda por una preparación local.

## Resultado y revisión independiente

- 38 iniciativas, 16 instituciones: 9 verificadas, 13 en seguimiento y 16 de ecosistema.
- MuniBot y MICITT cumplen el contrato de adopción verificada: técnica documentada en fuente oficial, ejecución institucional y respuesta funcional puntual.
- MuniBot: consulta neutra sobre horario municipal respondida el 01/10. Se verificó el iframe desde el HTML oficial porque el portal bloqueó la navegación automatizada. La respuesta de horario no coincidía plenamente con el pie del portal: se conserva como pregunta de calidad, no como dato corroborado.
- MICITT: consulta neutra sobre dónde consultar la ENIA respondida desde el widget del sitio oficial. No se enviaron datos personales ni trámites.
- Revisión independiente de fuentes confirmó estados/montos SICOP y cautela IFAM. Se retiró de SBD el presupuesto referencial no respaldado por el expediente principal citado.
- Los 32 proyectos anteriores permanecen intactos; no se duplicaron Brete ni Vincent entre informes.
- API R14: nuevo snapshot y descargas. Ningún archivo de R8 a R13 modificado.
- `validate-data`, 122 pruebas y lint aprobados. Build: 177 páginas generadas; auditoría estática: 175 HTML, 172 localizados, paridad ES/EN.
- Agenda: cantidades ajustadas. En una petición posterior se revisaron los siete expedientes legislativos y se registró una revisión sin modificaciones al catálogo, con limitaciones expresas de acceso y antigüedad documental. Próximo control 8 de octubre. No equivale a certificación actual de sus estados; véase `revision-legislativa-2026-10-01.md`.
- La base de conocimiento de la organización no está configurada. Se conservan decisiones y fuentes en este documento local y en las fichas, sin crear un servicio nuevo.

## Dónde comprobar la preparación

- `/es/proyectos/` y `/en/proyectos/`: seis altas y filtros por evidencia.
- `/es/proyectos/cartago-munibot/` y `/es/proyectos/micitt-asistente-virtual/`: nuevas verificadas.
- `/es/proyectos/invu-vincent-ai/`, `/es/proyectos/sbd-ia-auditoria/`, `/es/proyectos/la-union-rodu/`, `/es/proyectos/salud-dejar-fumar-vapear/`: seguimiento.
- `/es/instituciones/`: cuatro instituciones nuevas y tipos bilingües.
- `/es/enia/`: nota IFAM sin atribución de cumplimiento.
- `/es/historial/`: tres entradas del corte y agenda honesta.
- `/api/`: corte R14, contadores, fuentes, descargas y schemas.
