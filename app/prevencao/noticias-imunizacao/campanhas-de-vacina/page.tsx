import type { Metadata } from "next";
import { StitchFrame } from "../../../components/stitch-frame";

export const metadata: Metadata = { title: "Campanhas de Vacina" };

/** O que levar para se vacinar (tela 1.0 Prevenção). */
export default function CampanhasDeVacinaPage() {
  return <StitchFrame src="/telas/1.0_preven_o_e_imuniza_o_sesau_cama_ari/code.html" title="Campanhas de Vacina" hide={["bloco-1-1", "bloco-1-3", "noticias-vacinacao"]} />;
}
