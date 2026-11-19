import type { Metadata } from "next";
import { PageHero } from "../components/category-page";
import { MinhaConta } from "../components/services/conta";

export const metadata: Metadata = { title: "Minha Conta" };

export default function MinhaContaPage() {
  return (
    <>
      <PageHero
        icon="account_circle"
        badge="Área do cidadão"
        title="Minha Conta"
        description="Acompanhe em um só lugar suas manifestações, agendamentos e solicitações feitas no portal."
      />
      <section className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl w-full">
        <MinhaConta />
      </section>
    </>
  );
}
