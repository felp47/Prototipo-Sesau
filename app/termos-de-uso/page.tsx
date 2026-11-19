import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosDeUsoPage() {
  return (
    <LegalPage
      icon="gavel"
      title="Termos de Uso"
      description="Condições para utilização do Portal da Saúde da Secretaria Municipal da Saúde de Camaçari."
      sections={[
        {
          heading: "1. Finalidade do portal",
          body: <p>O portal reúne informações sobre os serviços do SUS em Camaçari e permite registrar manifestações, solicitações e agendamentos de forma simplificada.</p>,
        },
        {
          heading: "2. Protótipo sem integração",
          body: (
            <p>
              Nesta versão os registros não são enviados à Secretaria: ficam salvos apenas no navegador utilizado. Protocolos, situações e respostas exibidos são simulados. Para
              atendimento oficial, utilize a Central SESAU (71) 3621-6824 ou a Ouvidoria 136.
            </p>
          ),
        },
        {
          heading: "3. Responsabilidades do usuário",
          body: <p>O usuário se compromete a informar dados verdadeiros e a não utilizar os canais para fins ofensivos ou alheios aos serviços de saúde.</p>,
        },
        {
          heading: "4. Urgências",
          body: <p>O portal não deve ser usado para situações de urgência. Em caso de emergência ligue 192 (SAMU) ou procure a UPA 24h mais próxima.</p>,
        },
      ]}
    />
  );
}
