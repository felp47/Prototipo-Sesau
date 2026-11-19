import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { PortariasDiario } from "../../../components/services/ouvidoria";

export const metadata: Metadata = { title: "Portarias e Diário Oficial" };

export default function PortariasEDiarioPage() {
  return (
    <ItemRoute href="/institucional/transparencia-ouvidoria/portarias-e-diario">
      <PortariasDiario />
    </ItemRoute>
  );
}
