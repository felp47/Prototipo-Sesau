import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Acesso e Funcionamento" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function AcessoFuncionamentoPage() {
  return <SectionRoute href="/institucional/acesso-funcionamento" />;
}
