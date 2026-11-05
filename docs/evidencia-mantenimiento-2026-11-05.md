# Evidencia del mantenimiento, 5 de noviembre de 2026

Consulta: 2026-11-05. Este documento registra alcance y límites; no certifica ejecución donde la fuente solo declara intención o contratación. Mario revisó y autorizó publicar este lote el 5 de noviembre de 2026.

## Control de versiones

- Producción consultada antes de publicar: [manifest](https://www.observatorioia.org/api/index.json), release `2026-10-29-r17`. La API conservaba 42 iniciativas, 10 verificadas, 16 en seguimiento y 16 de ecosistema, en 19 instituciones.
- Base comprometida del lote: `acb14835023861e60874d31af866e133b45bde6e`, que únicamente retiró envíos directos a Telegram sobre la base editorial R17. La variable `OBSERVATORIO_TELEGRAM_ENABLED` está en `false`; cuatro emisores requieren activación explícita. No se borraron secretos ni se desactivaron monitores.
- Lote R18 aprobado: las mismas 42 iniciativas y 19 instituciones; ChatbotPJ cambia de capa, dejando 11 verificadas y 15 en seguimiento. Se preservan las releases R8–R17. La publicación se verifica después del push con el manifest y el despliegue asociados al commit, sin inferirla de la preparación local.

## Cambios con fuente primaria

### ILIA 2026

Emisores: CENIA y CEPAL. El [portal oficial](https://indicelatam.cl/) identifica la cuarta edición y 20 países. La [gráfica original del ranking](https://indicelatam.cl/wp-content/uploads/2026/10/ilx-svg/ranking-ilia-2026.svg) devuelve HTTP 200 y publica Chile 71,4; Brasil 68,4; Uruguay 67,0; Colombia 56,8; Costa Rica 56,0. Costa Rica ocupa el quinto puesto de 20; la diferencia respecto de Chile es 15,4. Se conserva la precisión de un decimal de la gráfica, sin atribuir centésimas no publicadas.

SHA-256 de la gráfica consultada: `a1d53a45869e584d16f7af9eb43514f7efdf0537f3969c6667c8329aa802f527`.

La [comunicación oficial de CEPAL](https://www.cepal.org/es/comunicados/ilia-2026-america-latina-caribe-debe-apropiarse-la-inteligencia-artificial-generar-valor), publicada el 20 de octubre de 2026, describe cambios metodológicos y de cobertura. La consulta del sitio de CEPAL devolvió 403, aunque su contenido oficial pudo recuperarse mediante el buscador. El enlace de descarga de CENIA redirige a la [ficha del informe](https://www.cepal.org/es/publicaciones/90413-indice-latinoamericano-inteligencia-artificial-ilia-2026), también bloqueada; no se recuperó ni se certifica lectura del PDF completo.

Decisión: actualizar las superficies vigentes a 2026 y conservar `ilia2025` y los artículos fechados. Mostrar los cinco primeros de 20, no un ranking nacional de adopciones gubernamentales. No derivar progreso temporal ni actualizar presupuestos regionales a partir de este índice.

### ChatbotPJ

Emisor: Poder Judicial de Costa Rica. [Declaración de uso de IA](https://transparencia.poder-judicial.go.cr/index.php/declaracion-de-uso-de-inteligencia-artificial), sección «Chatbot Institucional (ChatbotPJ)», sin fecha de publicación visible. Identifica NLP para reconocer intenciones, entrenamiento con preguntas frecuentes y atención institucional continua. El [portal judicial](https://pj.poder-judicial.go.cr/) enlaza al [servicio](https://chatbotpj.azurewebsites.net/); ambos devolvieron HTTP 200 y el servicio mostró su interfaz y bienvenida. No se enviaron consultas ni se midió precisión.

Decisión: reclasificar la ficha existente como verificada, en fase operativa, sobre declaración técnica y ejecución institucional documentadas. Conservar 2018 como inicio histórico y las métricas de 2019 como históricas. No inferir proveedor, arquitectura detallada, controles de datos o calidad actual. Actualizar también el resumen institucional.

### Vincent, INVU

Emisores: INVU y SICOP. [Expediente 2026PX-000032-0005800001](https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260902382&cartelSeq=00), sección 5.1 Contrato, recuperada directamente con HTTP 200. Contrato `0432026002600015-00`, VLEX NETWORKS, S.L., USD 6.360, 12 meses, fecha de contrato 15/10/2026, estado «Contrato notificado».

Decisión: corregir el trámite pendiente de aprobación. Mantener seguimiento y fase planificada: no se recuperó activación de licencias, recepción conforme ni prueba de uso. No atribuir este contrato al chatbot ENIA ni a planificación territorial.

## Cobertura del catálogo en seguimiento

Se revisaron las fuentes de las 16 fichas que estaban en seguimiento en R17 y se hicieron búsquedas dirigidas. Una fuente inaccesible no equivale a ausencia de novedades. Solo las dos fichas anteriores cambian de contenido; las fechas individuales de las demás no se renuevan sin nueva evidencia.

| Ficha | Fuente principal consultada | Resultado y límite |
| --- | --- | --- |
| ChatbotPJ | Declaración y portal judicial citados arriba | Técnica identificada y operación institucional documentada; propuesta de reclasificación. |
| AIDA | [CCSS, noticia institucional](https://aissfa.ccss.sa.cr/noticias/noticia?v=101282054203) | Falló recuperación directa. No se acredita un avance ni se infiere cierre. |
| Depuración de listas | [CCSS, noticia institucional](https://www.ccss.sa.cr/noticias/noticia?v=752326066172) | Falló recuperación directa. Sin nueva evidencia técnica suficiente para reclasificar. |
| Logística CCSS | [CRHoy, 8 de abril](https://crhoy.com/nacionales/ccss-activa-medidas-por-conflicto-en-medio-oriente-pakistan-y-afganistan-son-clave-para-insumos/) | Accesible, pero sigue siendo prensa; no resuelve la técnica ni el componente institucional. |
| Infoyasistencia | [Hacienda](https://infoyasistencia.hacienda.go.cr/) | Portal accesible, sin nueva arquitectura de IA. El estado de una interfaz no demuestra retiro definitivo. |
| Chat facilitadores | [CONAMAJ / Poder Judicial](https://pj.poder-judicial.go.cr/index.php/component/content/article/2317-agenda-conamaj-2026-vitrina-de-aplicaciones-de-inteligencia-artificial-en-sector-justicia) | Demostración con LLM; no acredita operación institucional posterior. |
| Reclamos médicos INS | [Boletín INS, diciembre 2024](https://www.grupoins.com/media/pyfkpyjz/bolet%C3%ADn-insignia-diciembre-2024.pdf) | Documento accesible; no nueva técnica o evaluación independiente localizada. |
| INVU territorial | [INVU Evoluciona](https://www.invu.go.cr/-/72-aniversario?inheritRedirect=true&redirect=%2Fhome) | Recuperación directa fallida. La declaración institucional indexada no identifica piloto. |
| SNE/Brete | [INA, AI-ASE-03-2025](https://www.ina.ac.cr/transparencia/Documentos%20compartidos/Informes%20Institucionales/Hist%C3%B3rico%20de%20los%20informes%20anuales%20de%20auditor%C3%ADa%20interna/2025/Informes_AS/AI-ASE-03-2025-Adenda_Convenio_MICITT-INA-MTSS-JD.pdf) | PDF accesible, sin entrega o uso acreditado del motor de IA posterior. |
| Vincent INVU | SICOP citado arriba | Contrato notificado; sin activación acreditada. |
| Auditoría SBD | [SICOP, 2026LD-000022-0002000001](https://www.sicop.go.cr/moduloPcont/pcont/ctract/es/CE_CEJ_ESQ002.jsp?cartelNo=20260803608&cartelSeq=00) | Mantiene contrato notificado del 25/09, ₡22.477.800,67 y tres meses. No se recuperó recepción conforme o uso. |
| R.O.D.U | [Municipalidad de La Unión](https://launion.go.cr/noticias/la-union-encabeza-informes-nacionales-en-infraestructura-y-desarrollo-urbano/) | Operación declarada; mezcla RPA e IA sin resolver técnica. |
| Dejar de Fumar y Vapear | [IAFA, programa vigente](https://iafa.go.cr/obtener-ayuda/chatbot/) | Acceso institucional presente, sin arquitectura técnica nueva. |
| Hello Brete | [MICITT, lanzamiento 13/04/2026](https://www.micitt.go.cr/el-sector-informa/plataforma-gratuita-hello-brete-permitira-capacitar-hasta-2-millones-de-personas) | Servicio educativo documentado; no nueva prueba del uso específico de IA contratado. |
| Asistente auditoría TEC | [TEC, presentación institucional](https://tec.ac.cr/medio-siglo-transparencia-control-auditoria-interna-tec-celebra-50-anos-trayectoria-servicio) | RAG declarado; sin recepción, pruebas institucionales o uso operativo nuevo acreditado. La compra de licencias detectada en el informe semanal no se fusiona con este asistente. |
| Votante Informado | [TSE, 12/12/2025](https://www.tse.go.cr/comunicado1120.html) | Operación electoral histórica documentada; continuidad y técnica sin resolver. |

## Legislación: revisión parcial

Se recuperaron los siete registros de Delfino: 23.771, 23.885, 23.919 y 24.484 figuran dictaminados; 24.875 en comisión; 25.171 rechazado; 25.379 presentado. Los registros secundarios no sustituyen el acto oficial. Persisten las discrepancias ya documentadas sobre comisión del 23.919 y trámite del 25.379.

En [Delfino, 25.171](https://delfino.cr/asamblea/proyecto/25171), «Rechazado» difiere del catálogo. [AsambleaTeRinde](https://www.asambleaterinde.com/proyecto/ley-de-proteccion-de-rasgos-personales-y-creaciones-artisticas-en-entornos-digitales?desde=proyectos), fuente alternativa no oficial, describe recomendación de rechazo por comisión el 21/10 y continuación ante Plenario. Otra nota secundaria del 20/10 habla de un informe de subcomisión rechazado. No son actos intercambiables ni acreditan por sí solos archivo definitivo.

No se recuperó la [consulta oficial del orden del día](https://consultassil3.asamblea.go.cr/frmOrdenDiaPlenario.aspx) ni un acto actual específico que cierre la discrepancia. La [consulta oficial histórica del 7 de abril](https://www.asamblea.go.cr/ca/Lists/cp/DispForm.aspx?ContentTypeId=0x01008922D325D4FE564292B03FD67DF003A7&ID=22860) tampoco certifica el estado de noviembre. Se mantiene el catálogo legislativo intacto y la agenda vencida: 01/10 → 08/10. Pendiente: acta/dictamen y etapa oficial de 25.171, más discrepancias 23.919 y 25.379.

## ENIA: control documental y búsquedas prioritarias, revisión parcial

Emisor: MICITT. [Portal de IA](https://www.micitt.go.cr/gobierno_digital/inteligencia_artificial) recuperado directamente con HTTP 200; el lector web tuvo acceso restringido. El [Plan publicado](https://www.micitt.go.cr/sites/default/files/2025-10/Plan%20de%20Acci%C3%B3n%20ENIA%20-%20Versi%C3%B3n%2011%20agosto%202025%20Versi%C3%B3n%20Publicaci%C3%B3n.pdf) conserva versión 11/08/2025 y SHA-256 `b6ae27e0e8de65943e409271a2dcfaf889e8cf5e76a0fd00e4c2b579ea113184`, igual al registro automático de octubre. Se conserva integridad de 129 registros fuente y 120 intervenciones únicas.

Se buscaron señales dirigidas de ICE/OIJ, AyA, IFAM, INDER, MTSS, PANI, CNE, INCOFER y CCSS SIES. No se acreditó nueva ejecución correspondiente a las intervenciones prioritarias. La IA interna Simón de PANI es distinta de la plataforma para población infantil de ENIA; un chatbot de una plataforma de cursos del MTSS tampoco demuestra ejecución de su meta institucional. No se verificaron integralmente las 120 intervenciones, por lo que las fechas del frente siguen 15/09 → 15/10, vencidas. No se modifican metas ni correspondencias ENIA.

## Cola separada de investigación

- [MICITT, cooperación con CPI, 28/10/2026](https://micitt.go.cr/el-sector-informa/costa-rica-fortalece-su-infraestructura-digital-mediante-cooperacion-en): propone GovOS y un agente nacional de servicios públicos, con integración gradual a Pura Vida Digital. El convenio marco no compromete financiamiento ni autoriza acceso automático a datos o sistemas. Es anuncio/cooperación, no operación demostrada. No se incorpora ni se fusiona con el asistente MICITT existente.
- Conservar preguntas abiertas de los 14 seguimientos sin reclasificación, especialmente aceptación SBD, activación Vincent, técnica R.O.D.U/Salud y continuidad TSE. Las fallas de acceso CCSS/INVU requieren reintento o documento alternativo primario.
- Completar validación primaria legislativa y cobertura de ejecución ENIA antes de mover sus fechas o cerrar issues.

La investigación semanal de ChatGPT y la automatización de recepción no se modificaron. Desactivar Telegram no equivale a detener ese seguimiento.
