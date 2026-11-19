import type { Metadata } from "next";
import { StitchFrame } from "../../../components/stitch-frame";

export const metadata: Metadata = { title: "Mapa de Postos de Saúde" };

/** Tela "Postos de Saúde" do Stitch. */
export default function MapaDePostosPage() {
  return <StitchFrame src="/telas/postos_de_sa_de_sesau_cama_ari/code.html" title="Mapa de Postos de Saúde" />;
}
