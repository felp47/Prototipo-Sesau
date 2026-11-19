import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { CronogramaCirurgias } from "../../../components/services/clinicos";

export const metadata: Metadata = { title: "Cronograma de Cirurgias" };

export default function CronogramaDeCirurgiasPage() {
  return (
    <ItemRoute href="/servicos-clinicos/regulacao-agendamentos/cronograma-de-cirurgias">
      <CronogramaCirurgias />
    </ItemRoute>
  );
}
