import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { VisaManager } from "../../../components/services/vigilancia";

export const metadata: Metadata = { title: "Renovação de Alvará" };

export default function RenovacaoDeAlvaraPage() {
  return (
    <ItemRoute href="/vigilancia-sanitaria/servicos/renovacao-de-alvara">
      <VisaManager tipo="alvara" />
    </ItemRoute>
  );
}
