import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { ZoonosesManager } from "../../../components/services/vigilancia";

export const metadata: Metadata = { title: "Controle de Zoonoses" };

export default function ControleDeZoonosesPage() {
  return (
    <ItemRoute href="/vigilancia-sanitaria/servicos-veterinarios/controle-de-zoonoses">
      <ZoonosesManager />
    </ItemRoute>
  );
}
