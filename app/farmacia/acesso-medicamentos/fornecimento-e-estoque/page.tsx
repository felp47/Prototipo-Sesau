import type { Metadata } from "next";
import { StitchFrame } from "../../../components/stitch-frame";

export const metadata: Metadata = { title: "Fornecimento e Estoque" };

/** Tela "Remédios nos Postos": onde retirar cada medicamento. */
export default function FornecimentoEEstoquePage() {
  return <StitchFrame src="/telas/rem_dios_nos_postos_sesau_cama_ari/code.html" title="Fornecimento e Estoque" />;
}
