import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Regulação e Agendamentos" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function RegulacaoAgendamentosPage() {
  return <SectionRoute href="/servicos-clinicos/regulacao-agendamentos" />;
}
