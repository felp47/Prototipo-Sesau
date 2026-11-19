import type { Metadata } from "next";
import { StitchFrame } from "../../../components/stitch-frame";

export const metadata: Metadata = { title: "Últimas Notícias" };

/** Bloco de notícias e campanhas em vigor da tela 1.0 Prevenção. */
export default function UltimasNoticiasPage() {
  return <StitchFrame src="/telas/1.0_preven_o_e_imuniza_o_sesau_cama_ari/code.html" title="Últimas Notícias" hide={["bloco-1-1", "bloco-1-3", "requisitos-vacina"]} />;
}
