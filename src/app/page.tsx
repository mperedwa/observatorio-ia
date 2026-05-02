import { Hero } from '@/components/Hero';
import { InstitucionesGrid } from '@/components/InstitucionesGrid';
import { Legislacion } from '@/components/Legislacion';
import { Indicadores } from '@/components/Indicadores';
import { Recursos } from '@/components/Recursos';
import { Acerca } from '@/components/Acerca';

export default function Home() {
  return (
    <>
      <Hero />
      <InstitucionesGrid />
      <Legislacion />
      <Indicadores />
      <Recursos />
      <Acerca />
    </>
  );
}
