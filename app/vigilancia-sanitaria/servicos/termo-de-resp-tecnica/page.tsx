import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { VisaManager } from "../../../components/services/vigilancia";

export const metadata: Metadata = { title: "Termo de Responsabilidade Técnica" };

export default function TermoDeRespTecnicaPage() {
  return (
    <ItemRoute href="/vigilancia-sanitaria/servicos/termo-de-resp-tecnica">
      <VisaManager tipo="rt" />
    </ItemRoute>
  );
}
