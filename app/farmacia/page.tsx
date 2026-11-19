import type { Metadata } from "next";
import { StitchFrame } from "../components/stitch-frame";

export const metadata: Metadata = { title: "Farmácia e Insumos Especiais" };

export default function FarmaciaPage() {
  return <StitchFrame src="/telas/3.0_farm_cia_e_insumos_especiais_sesau_cama_ari/code.html" title="Farmácia e Insumos Especiais" />;
}
