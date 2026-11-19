import type { Metadata } from "next";
import { SectionRoute } from "../../components/category-page";

export const metadata: Metadata = { title: "Notícias e Imunização" };

/** Índice da seção: cada item do menu tem a sua própria página */
export default function NoticiasImunizacaoPage() {
  return <SectionRoute href="/prevencao/noticias-imunizacao" />;
}
