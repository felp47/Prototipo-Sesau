import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryHub } from "../components/category-page";
import { findCategory } from "../lib/site-map";

export const metadata: Metadata = { title: "Vigilância Sanitária" };

export default function VigilanciaSanitariaPage() {
  const category = findCategory("/vigilancia-sanitaria");
  if (!category) notFound();
  return <CategoryHub category={category} />;
}
