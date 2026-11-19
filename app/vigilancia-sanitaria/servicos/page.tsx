import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Serviços de Vigilância Sanitária" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function ServicosPage() {
  return <SectionRoute href="/vigilancia-sanitaria/servicos" />;
}
