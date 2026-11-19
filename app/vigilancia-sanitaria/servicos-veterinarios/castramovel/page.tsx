import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { CastramovelManager } from "../../../components/services/vigilancia";

export const metadata: Metadata = { title: "Castramóvel" };

export default function CastramovelPage() {
  return (
    <ItemRoute href="/vigilancia-sanitaria/servicos-veterinarios/castramovel">
      <CastramovelManager />
    </ItemRoute>
  );
}
