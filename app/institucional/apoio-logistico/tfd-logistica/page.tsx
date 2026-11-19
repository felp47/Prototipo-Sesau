import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { TfdManager } from "../../../components/services/apoio-logistico";

export const metadata: Metadata = { title: "TFD Logística Municipal" };

export default function TfdLogisticaPage() {
  return (
    <ItemRoute href="/institucional/apoio-logistico/tfd-logistica">
      <TfdManager />
    </ItemRoute>
  );
}
