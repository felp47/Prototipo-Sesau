import type { Metadata } from "next";
import { StitchFrame } from "../components/stitch-frame";

export const metadata: Metadata = { title: "Home (tema roxo — versão alternativa)" };

export default function HomeRoxoPage() {
  return <StitchFrame src="/telas/home_sesau_cama_ari_novo_tema_roxo/code.html" title="Home (tema roxo — versão alternativa)" />;
}
