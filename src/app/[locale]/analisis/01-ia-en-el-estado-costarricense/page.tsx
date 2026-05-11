import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { locales, type Locale } from '@/i18n/config';

const ARTICLE = {
  slug: '01-ia-en-el-estado-costarricense',
  serie: 'Estado y Algoritmo',
  numero: 'N.° 01',
  fecha: '2026-05-11',
  fechaLargaEs: '11 de mayo de 2026',
  fechaLargaEn: 'May 11, 2026',
  autor: 'Mario Pérez Edwards',
  tituloEs:
    'IA en el Estado costarricense: 20 proyectos, 7 instituciones, y las preguntas que nadie ha respondido todavía',
  tituloEn:
    'AI in the Costa Rican State: 20 projects, 7 institutions, and the questions no one has answered yet',
  descripcionEs:
    'Análisis del primer inventario sistemático de proyectos de IA en el sector público costarricense: lo que existe, lo que retorna, lo que está detenido, y lo que falta coordinar.',
  descripcionEn:
    'Analysis of the first systematic inventory of AI projects in the Costa Rican public sector: what exists, what delivers returns, what is stalled, and what coordination is still missing.',
};

export function generateStaticParams() {
  // Article is Spanish-only at this time; only generate the /es path.
  return [{ locale: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'es') return {};
  const titulo = `${ARTICLE.tituloEs} — Observatorio IA Costa Rica`;
  return {
    title: titulo,
    description: ARTICLE.descripcionEs,
    authors: [{ name: ARTICLE.autor }],
    openGraph: {
      title: ARTICLE.tituloEs,
      description: ARTICLE.descripcionEs,
      url: `https://observatorioia.org/es/analisis/${ARTICLE.slug}/`,
      siteName: 'Observatorio IA Costa Rica',
      locale: 'es_CR',
      type: 'article',
      publishedTime: `${ARTICLE.fecha}T12:00:00-06:00`,
      authors: [ARTICLE.autor],
      images: [
        {
          url: 'https://observatorioia.org/comparte-assets/es/og-analisis-1200x630.png',
          width: 1200,
          height: 630,
          alt: ARTICLE.tituloEs,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ARTICLE.tituloEs,
      description: ARTICLE.descripcionEs,
      images: [
        'https://observatorioia.org/comparte-assets/es/og-analisis-1200x630.png',
      ],
    },
    alternates: {
      canonical: `/es/analisis/${ARTICLE.slug}/`,
    },
  };
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-institucional-700 hover:text-institucional-900 underline decoration-institucional-200 hover:decoration-institucional-700 underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  if (locale !== 'es') notFound();
  const lc: Locale = 'es';

  return (
    <article className="bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-12">
          <Breadcrumb
            locale={lc}
            items={[
              { label: 'Inicio', href: `/${lc}/` },
              { label: 'Análisis', href: `/${lc}/analisis/` },
              { label: `${ARTICLE.serie} ${ARTICLE.numero}` },
            ]}
          />
          <p className="mt-6 text-sm font-medium uppercase tracking-wider text-institucional-700">
            {ARTICLE.serie} · {ARTICLE.numero}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-balance leading-tight">
            {ARTICLE.tituloEs}
          </h1>
          <p className="mt-6 text-lg text-slate-600 text-pretty">
            {ARTICLE.descripcionEs}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{ARTICLE.autor}</span>
            <span aria-hidden>·</span>
            <time dateTime={ARTICLE.fecha}>{ARTICLE.fechaLargaEs}</time>
            <span aria-hidden>·</span>
            <span>Observatorio IA Costa Rica</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <div className="space-y-6 text-slate-800 leading-relaxed">
          <p>
            El debate sobre inteligencia artificial en el gobierno costarricense suele
            ocurrir en dos registros que no se hablan entre sí. El primero es el registro
            del entusiasmo oficial: presentaciones de estrategias nacionales,
            declaraciones de liderazgo regional, referencias a Singapur y Estonia. El
            segundo es el escepticismo crónico de quienes llevan años observando
            anuncios sin resultados: más comités que código, más planes que producción.
          </p>
          <p>
            Los veinte proyectos documentados en el primer inventario sistemático del
            Observatorio IA Costa Rica no encajan bien en ninguna de las dos
            narrativas. Lo que revelan es algo más matizado: un ecosistema con
            capacidades técnicas reales, resultados medibles en casos específicos, y
            una ausencia casi total de coordinación institucional.
          </p>
          <p>
            Este artículo desempaca ese inventario. El propósito no es celebrar ni
            denunciar, sino entender la estructura de lo que existe, qué condiciones lo
            hicieron posible, y qué dice sobre la capacidad del Estado costarricense
            para escalar.
          </p>
        </div>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="inventario"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            1. El inventario: qué se midió y cómo
          </h2>
          <p>
            El primer inventario sistemático del{' '}
            <ExtLink href="https://observatorioia.org">
              Observatorio IA Costa Rica
            </ExtLink>{' '}
            documentó <strong>veinte proyectos de inteligencia artificial en producción
            o con estado verificado</strong> en siete instituciones del sector público
            costarricense.
          </p>
          <p>Los criterios de inclusión fueron tres:</p>
          <ol className="list-decimal pl-6 space-y-2 marker:text-institucional-700 marker:font-semibold">
            <li>
              <strong>Fuente pública verificable</strong>: comunicado oficial,
              declaración institucional, o cobertura periodística con datos confirmados
              por la institución.
            </li>
            <li>
              <strong>Institución del sector público costarricense</strong>: gobierno
              central, autónomas, o semiautónomas.
            </li>
            <li>
              <strong>Sistema que funciona o tiene estado documentado</strong>: no
              basta el anuncio; se requiere evidencia de operación o de estado actual
              (incluidos proyectos detenidos o con problemas documentados).
            </li>
          </ol>
          <p>
            Este criterio excluye deliberadamente proyectos en fase de piloto sin datos
            públicos, iniciativas del sector privado, y proyectos universitarios sin
            convenio con entidades públicas. La cifra de veinte es, por lo tanto, un
            piso, no un techo. El inventario sigue en construcción.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="retorno-documentado"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            2. Los dos casos de retorno documentado
          </h2>
          <p>
            De los veinte proyectos, dos tienen el nivel más alto de evidencia: retorno
            económico documentado públicamente por la propia institución.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mt-8">
            Poder Judicial: siete años sin titular
          </h3>
          <p>
            El{' '}
            <ExtLink href="https://transparencia.poder-judicial.go.cr/index.php/declaracion-de-uso-de-inteligencia-artificial">
              chatbot de atención ciudadana del Poder Judicial
            </ExtLink>{' '}
            lleva funcionando desde 2018. En ese momento, ninguna institución del
            gobierno central usaba &ldquo;inteligencia artificial&rdquo; en sus
            comunicados de prensa. El sistema no llegó por una directiva del MICITT ni
            por un mandato de la Estrategia Nacional. Lo construyeron internamente, sin
            proveedor externo.
          </p>
          <p>
            La continuación del proyecto fue el modelo de predicción presupuestaria
            para gestión de cobros judiciales, implementado en 2019. El sistema se
            extendió progresivamente a más de 60 centros de gestión y tiene un{' '}
            <ExtLink href="https://pj.poder-judicial.go.cr/index.php/component/content/article/760-poder-judicial-implementa-inteligencia-artificial-para-disminuir-circulante-en-materia-cobratoria">
              ahorro acumulado documentado de más de ₡100 millones
            </ExtLink>
            .
          </p>
          <p>
            En 2024, el impacto operacional se hizo más visible: el Poder Judicial{' '}
            <ExtLink href="https://observador.cr/sistema-de-inteligencia-artificial-judicial-ya-aplica-en-cobro-judicial/">
              procesó ₡5,245 millones en cobros judiciales
            </ExtLink>{' '}
            sin que ningún funcionario revisara manualmente cada pago. El sistema
            clasifica casos, prioriza cobros según probabilidad de recuperación, y
            genera reportes automáticamente.
          </p>
          <p>
            Lo que hace relevante este caso no es solo el número. Es la condición que
            lo hizo posible: el Poder Judicial tenía un sistema de gestión de
            expedientes con datos estructurados y de calidad suficiente para entrenar
            el modelo. La IA no construyó la infraestructura de datos; aprovechó una
            que ya existía.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mt-8">
            Ministerio de Hacienda: sobre la facturación electrónica
          </h3>
          <p>
            El caso del Ministerio de Hacienda sigue la misma lógica. En 2025, un{' '}
            <ExtLink href="https://actualidadtributaria.com/?action=news-view&id=2002">
              detector de anomalías sobre el flujo de facturas electrónicas recuperó
              ₡8,000 millones en evasión fiscal
            </ExtLink>
            .
          </p>
          <p>
            La facturación electrónica en Costa Rica tiene cobertura amplia: el sistema
            de facturación electrónica 4.4 de Hacienda procesa aproximadamente 3
            millones de comprobantes diarios, según declaró el Ministro Rudolf Lucke
            (vía actualidadtributaria.com). Esa infraestructura preexistente fue la
            condición habilitante del detector de fraude.
          </p>
          <p>
            La observación estructural que emerge de estos dos casos es simple pero con
            consecuencias de política importantes:{' '}
            <strong>
              el retorno de la IA en el gobierno depende menos del modelo que se use y
              más de la calidad de los datos y sistemas que lo preceden
            </strong>
            . Las instituciones que no tienen esa base no pueden saltarse el paso. En
            Costa Rica, muchas todavía no la tienen.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="ccss"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            3. El caso más urgente: CCSS
          </h2>
          <p>
            Si el Poder Judicial y Hacienda representan lo que ya funciona, la CCSS
            representa tanto lo que ya funciona como lo que podría funcionar y está
            detenido.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mt-8">
            Lo que funciona: dos proyectos con datos públicos
          </h3>
          <p>
            En mayo de 2026, la CCSS activó un{' '}
            <ExtLink href="https://www.teletica.com/nacional/ccss-implementa-herramienta-de-inteligencia-artificial-en-intento-por-bajar-listas-de-espera_408381">
              bot que cruza el Expediente Digital Único en Salud (EDUS) con el Registro
              Civil
            </ExtLink>{' '}
            para depurar las listas de espera quirúrgica. El problema que resuelve es
            concreto: las listas de espera incluyen pacientes fallecidos, pacientes que
            ya fueron atendidos por otro medio, y duplicados. La depuración manual era
            lenta e incompleta.
          </p>
          <p>
            Entre 2023 y el primer trimestre de 2026, el sistema ayudó a resolver
            367,403 pacientes y limpiar 136,774 casos de la lista. La tasa de
            depuración bajó de 31.2% a 18.2%.
          </p>
          <p>
            El segundo proyecto es LIDIA, un modelo de machine learning{' '}
            <ExtLink href="https://observador.cr/inteligencia-artificial-en-la-ccss-plan-piloto-en-la-clinica-clorito-picado-identifica-a-130-pacientes-con-diabetes/">
              desarrollado en la Clínica Clorito Picado
            </ExtLink>{' '}
            sobre más de un millón de expedientes en EDUS. LIDIA identifica pacientes
            con diabetes tipo 2 en riesgo con 95% de precisión, lo que permite
            intervención preventiva antes de que el paciente llegue a una complicación
            costosa. El{' '}
            <ExtLink href="https://www.teletica.com/salud/los-obstaculos-de-lidia-sistema-de-ia-de-la-ccss-para-crecer_377250">
              modelo cuesta ₡130 millones
            </ExtLink>
            , aproximadamente USD 250,000.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mt-8">
            Lo que está detenido: tres modelos, ₡390 millones
          </h3>
          <p>
            Hay tres modelos adicionales diseñados para detectar cáncer de mama,
            enfermedades pulmonares y síndrome coronario agudo sobre el mismo dataset
            de EDUS. Los tres están parados por falta de presupuesto. El costo total
            para activarlos es de aproximadamente ₡390 millones (3 × ₡130 millones),{' '}
            <ExtLink href="https://www.teletica.com/salud/los-obstaculos-de-lidia-sistema-de-ia-de-la-ccss-para-crecer_377250">
              según reportó Teletica
            </ExtLink>{' '}
            en su investigación sobre los obstáculos del programa LIDIA. Esa cifra
            representa menos del 0.02% del presupuesto ordinario de la CCSS.
          </p>
          <p>
            La decisión de mantener esos modelos inactivos merece el mismo nivel de
            escrutinio que cualquier decisión de política sanitaria. Si el costo de
            activarlos es verificablemente menor que el costo de una complicación
            evitable por caso detectado tardíamente, la justificación de la no-acción
            requiere argumentación explícita. Esa argumentación no existe en el
            dominio público.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="vacio-institucional"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            4. El vacío institucional
          </h2>
          <p>
            El contexto de estos proyectos es una arquitectura institucional en
            construcción con partes significativas aún ausentes.
          </p>
          <p>
            La{' '}
            <ExtLink href="https://micitt.go.cr/el-sector-informa/micitt-presento-estrategia-nacional-de-inteligencia-artificial-enia">
              Estrategia Nacional de Inteligencia Artificial (ENIA) 2024-2027
            </ExtLink>{' '}
            del MICITT prometió un Centro Nacional de Excelencia en IA. Costa Rica fue
            el primer país de Centroamérica en tener una política nacional de IA, lo
            que merece reconocimiento.
          </p>
          <p>
            El centro no existe. Acumula dos años de retraso y no tiene presupuesto
            público asignado. Mientras tanto, la{' '}
            <ExtLink href="https://ciodd.ucr.ac.cr/ciodd-lidera-taller-internacional-sobre-inteligencia-artificial-etica-en-la-universidad-de-costa-rica-en-el-marco-del-proyecto-ethical-ia">
              UCR hace investigación ética en IA con financiamiento europeo (Erasmus+)
            </ExtLink>{' '}
            y el{' '}
            <ExtLink href="https://dplnews.com/costa-rica-impulsa-investigacion-y-desarrollo-en-inteligencia-artificial/">
              CeNAT propone LaNIA con apoyo del BID
            </ExtLink>
            . Cada institución del Estado construye sus propios sistemas sin
            obligación formal de coordinar con el MICITT ni de compartir aprendizajes
            con otras instituciones.
          </p>
          <p>
            El Poder Judicial inventó su propio marco de gobernanza porque nadie más
            lo hizo. Es el{' '}
            <ExtLink href="https://transparencia.poder-judicial.go.cr/index.php/declaracion-de-uso-de-inteligencia-artificial">
              único que ha publicado formalmente lineamientos para el uso de IA
              generativa interna
            </ExtLink>
            , según información pública disponible. El resto del Estado no tiene
            ninguno.
          </p>
          <p>
            El resultado práctico es que los aprendizajes del Poder Judicial (cómo
            entrenar modelos sobre datos judiciales, cómo manejar privacidad, qué
            errores se cometen en producción) no están disponibles para la CCSS. Los
            aprendizajes de la CCSS con LIDIA no están disponibles para el MEP. Cada
            institución parte de cero.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="estructura"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            5. Lo que la estructura del inventario revela
          </h2>
          <p>
            Vistos en conjunto, los veinte proyectos documentados tienen tres
            características comunes que merecen atención:
          </p>
          <p>
            <strong>
              Primera: todos los proyectos con retorno documentado operan sobre
              infraestructura de datos preexistente.
            </strong>{' '}
            La IA no reemplaza la infraestructura; la amplifica. Esto sugiere que la
            prioridad para las instituciones sin proyectos de IA no debería ser empezar
            con IA, sino completar la digitalización básica de sus operaciones.
          </p>
          <p>
            <strong>
              Segunda: la iniciativa proviene de equipos técnicos internos, no de
              mandatos centralizados.
            </strong>{' '}
            El Poder Judicial, la CCSS, y Hacienda desarrollaron capacidades propias
            antes de que existiera una estrategia nacional. Eso es robusto en el
            sentido de que no depende de la estabilidad política, pero es frágil en el
            sentido de que depende de la existencia de equipos técnicos específicos que
            pueden cambiar con cada administración.
          </p>
          <p>
            <strong>
              Tercera: la ausencia de coordinación produce duplicación y vacíos
              simultáneamente.
            </strong>{' '}
            Tres modelos de la CCSS están detenidos por ₡390 millones mientras el
            Estado costarricense gasta en proyectos de IA menos maduros en otras
            instituciones. Sin un inventario compartido, nadie tiene la visión completa
            para hacer esa comparación.
          </p>
        </section>

        <hr className="my-12 border-slate-200" />

        <section className="space-y-5">
          <h2
            id="que-sigue"
            className="text-2xl sm:text-3xl font-bold text-slate-900 scroll-mt-24"
          >
            6. Qué sigue en el Observatorio
          </h2>
          <p>
            Este primer número del inventario es un punto de partida, no un estado
            final. Las preguntas abiertas que van a guiar los próximos números:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-institucional-700">
            <li>
              <strong>¿Cuál es el costo total de los proyectos activos?</strong> El
              retorno está documentado para Poder Judicial y Hacienda. El costo de
              inversión no tiene la misma transparencia.
            </li>
            <li>
              <strong>
                ¿Qué instituciones tienen la infraestructura de datos para el siguiente
                proyecto?
              </strong>{' '}
              MEP, SUTEL, y las municipalidades tienen datos. La pregunta es si tienen
              la estructura para usarlos.
            </li>
            <li>
              <strong>¿Cuándo se activan los tres modelos de LIDIA?</strong> La
              decisión de presupuesto tiene fecha. El seguimiento también.
            </li>
          </ul>
          <p>
            El inventario acepta correcciones y adiciones. Si usted trabaja en una
            institución pública con un proyecto de IA que no está documentado, o tiene
            información que modifica alguna de las cifras aquí presentadas, el canal
            es abierto.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-600 space-y-3">
          <p>
            <strong className="text-slate-900">Mario Pérez Edwards</strong> es analista
            de políticas de inteligencia artificial y fundador del Observatorio IA
            Costa Rica.
          </p>
          <p className="italic">
            Estado y Algoritmo se publica quincenalmente. Datos del catálogo al 8 de
            mayo de 2026.
          </p>
          <p>
            <Link
              href={`/${lc}/`}
              className="text-institucional-700 hover:underline"
            >
              Observatorio IA Costa Rica
            </Link>{' '}
            — observatorioia.org
          </p>
        </footer>
      </div>
    </article>
  );
}
