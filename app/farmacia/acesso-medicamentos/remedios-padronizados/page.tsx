import type { Metadata } from "next";
import { StitchFrame } from "../../../components/stitch-frame";

export const metadata: Metadata = { title: "Remédios Padronizados (REMUME)" };

/** Consulta de medicamentos padronizados da tela 3.0 Farmácia. */
export default function RemediosPadronizadosPage() {
  return <StitchFrame src="/telas/3.0_farm_cia_e_insumos_especiais_sesau_cama_ari/code.html" title="Remédios Padronizados (REMUME)" hide={["bloco-insumos"]} />;
}
