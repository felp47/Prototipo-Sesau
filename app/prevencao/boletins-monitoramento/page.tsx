import type { Metadata } from "next";
import { StitchFrame } from "../../components/stitch-frame";

export const metadata: Metadata = { title: "Boletins e Monitoramento" };

export default function BoletinsMonitoramentoPage() {
  return <StitchFrame src="/telas/1.0_preven_o_e_imuniza_o_sesau_cama_ari/code.html" title="Boletins e Monitoramento" hide={["bloco-1-2", "bloco-1-3"]} />;
}
