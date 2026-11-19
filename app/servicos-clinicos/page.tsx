import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryHub } from "../components/category-page";
import { findCategory } from "../lib/site-map";

export const metadata: Metadata = { title: "Serviços Clínicos" };

export default function ServicosClinicosPage() {
  const category = findCategory("/servicos-clinicos");
  if (!category) notFound();
  return <CategoryHub category={category} />;
}
