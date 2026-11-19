import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { RedesApoio } from "../../../components/services/clinicos";

export const metadata: Metadata = { title: "Redes de Apoio Emocional" };

export default function RedesDeApoioPage() {
  return (
    <ItemRoute href="/servicos-clinicos/atencao-psicossocial/redes-de-apoio">
      <RedesApoio />
    </ItemRoute>
  );
}
