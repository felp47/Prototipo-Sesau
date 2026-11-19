import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { ManifestacoesManager, ConsultaProtocolo } from "../../../components/services/ouvidoria";

export const metadata: Metadata = { title: "Ouvidoria SUS" };

export default function OuvidoriaSusPage() {
  return (
    <ItemRoute href="/institucional/transparencia-ouvidoria/ouvidoria-sus">
      <ManifestacoesManager />
      <ConsultaProtocolo />
    </ItemRoute>
  );
}
