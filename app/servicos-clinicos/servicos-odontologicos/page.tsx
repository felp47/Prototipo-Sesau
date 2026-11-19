import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPage } from "../../components/category-page";
import { findSection } from "../../lib/site-map";
import { AgendaOdontomovel } from "../../components/services/clinicos";

export const metadata: Metadata = { title: "Serviços Odontológicos" };

export default function ServicosOdontologicosPage() {
  const match = findSection("/servicos-clinicos/servicos-odontologicos");
  if (!match) notFound();
  return (
    <SectionPage category={match.category} section={match.section}>
      <AgendaOdontomovel />
    </SectionPage>
  );
}
