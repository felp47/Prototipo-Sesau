import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/legal-page";

export const metadata: Metadata = { title: "Privacidade e LGPD" };

export default function PrivacidadePage() {
  return (
    <LegalPage
      icon="shield_person"
      title="Privacidade e LGPD"
      description="Como os dados informados no Portal da Saúde são tratados, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      sections={[
        {
          heading: "Quais dados são coletados",
          body: <p>Nome, CPF, Cartão SUS, data de nascimento, contatos e endereço informados em “Minha Conta”, além dos dados dos formulários de manifestação, solicitação e agendamento.</p>,
        },
        {
          heading: "Onde os dados ficam armazenados",
          body: (
            <p>
              Nesta versão de demonstração, todos os dados ficam no armazenamento local (localStorage) do seu navegador. Nada é enviado a servidores da Prefeitura ou de terceiros.
            </p>
          ),
        },
        {
          heading: "Como apagar seus dados",
          body: (
            <p>
              Em <Link href="/minha-conta" className="font-bold text-brand-purple-base hover:text-brand-purple-dark">Minha Conta</Link> use “Restaurar dados de demonstração”, ou limpe os dados de
              navegação deste site no seu navegador.
            </p>
          ),
        },
        {
          heading: "Preferências de acessibilidade",
          body: <p>O tamanho da fonte e o alto contraste escolhidos também ficam salvos apenas neste navegador.</p>,
        },
      ]}
    />
  );
}
