import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { VoluntariosManager } from "../../../components/services/apoio-logistico";

export const metadata: Metadata = { title: "Inscrição de Voluntários" };

export default function InscricaoDeVoluntariosPage() {
  return (
    <ItemRoute href="/institucional/apoio-logistico/inscricao-de-voluntarios">
      <VoluntariosManager />
    </ItemRoute>
  );
}
