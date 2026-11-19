import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Apoio Logístico" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function ApoioLogisticoPage() {
  return <SectionRoute href="/institucional/apoio-logistico" />;
}
