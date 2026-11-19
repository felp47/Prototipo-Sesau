import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { CentrosCaps } from "../../../components/services/clinicos";

export const metadata: Metadata = { title: "Centros CAPS" };

export default function CentrosCapsPage() {
  return (
    <ItemRoute href="/servicos-clinicos/atencao-psicossocial/centros-caps">
      <CentrosCaps />
    </ItemRoute>
  );
}
