import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryHub } from "../components/category-page";
import { findCategory } from "../lib/site-map";

export const metadata: Metadata = { title: "Institucional" };

export default function InstitucionalPage() {
  const category = findCategory("/institucional");
  if (!category) notFound();
  return <CategoryHub category={category} />;
}
