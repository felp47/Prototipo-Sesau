import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Acesso a Medicamentos" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function AcessoMedicamentosPage() {
  return <SectionRoute href="/farmacia/acesso-medicamentos" />;
}
