import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";
import { StitchFrame } from "../../components/stitch-frame";

export const metadata: Metadata = { title: "Transparência e Ouvidoria" };

/** Índice da seção (Ouvidoria SUS e Portarias e Diário têm páginas próprias) + Carta de Serviços */
export default function TransparenciaOuvidoriaPage() {
  return (
    <SectionRoute href="/institucional/transparencia-ouvidoria">
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <StitchFrame src="/telas/portal_da_sa_de_sesau_cama_ari_home/code.html" title="Carta de Serviços ao Cidadão de Camaçari" only={["carta-servicos"]} />
      </div>
    </SectionRoute>
  );
}
