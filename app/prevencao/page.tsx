import type { Metadata } from "next";
import { StitchFrame } from "../components/stitch-frame";

export const metadata: Metadata = { title: "Prevenção e Imunização" };

export default function PrevencaoPage() {
  return <StitchFrame src="/telas/1.0_preven_o_e_imuniza_o_sesau_cama_ari/code.html" title="Prevenção e Imunização" />;
}
