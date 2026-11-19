import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Atenção Psicossocial" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function AtencaoPsicossocialPage() {
  return <SectionRoute href="/servicos-clinicos/atencao-psicossocial" />;
}
