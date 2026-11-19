import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { AtualizacaoCadastral } from "../../../components/services/conta";

export const metadata: Metadata = { title: "Atualização Cadastral SUS" };

export default function AtualizacaoCadastralPage() {
  return (
    <ItemRoute href="/institucional/acesso-funcionamento/atualizacao-cadastral">
      <AtualizacaoCadastral />
    </ItemRoute>
  );
}
