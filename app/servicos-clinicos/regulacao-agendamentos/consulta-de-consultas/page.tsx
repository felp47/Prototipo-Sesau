import type { Metadata } from "next";
import { ItemRoute } from "../../../components/category-page";
import { ConsultaConsultas } from "../../../components/services/clinicos";

export const metadata: Metadata = { title: "Consulta de Consultas" };

export default function ConsultaDeConsultasPage() {
  return (
    <ItemRoute href="/servicos-clinicos/regulacao-agendamentos/consulta-de-consultas">
      <ConsultaConsultas />
    </ItemRoute>
  );
}
