"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useCastracoes,
  useDenuncias,
  useManifestacoes,
  useSession,
  useSolicitacoesVisa,
  useTfd,
  useVoluntarios,
} from "../../lib/data-hooks";
import { BAIRROS, DEMO_USER, UNIDADES, type Perfil } from "../../lib/mock-data";
import { claimUnownedRecords, resetAllData } from "../../lib/store";
import { formatDate, formatDateTime, isValidCns, isValidCpf, isValidEmail, isValidPhone, maskCns, maskCpf, maskPhone, onlyDigits, todayIso } from "../../lib/validators";
import { usePortal } from "../portal-provider";
import { StatusBadge } from "../records/status-badge";
import { FormAlert, SelectField, TextField } from "../ui/form-fields";
import { Button, ConfirmDialog } from "../ui/modal";
import { ServiceCard } from "./service-card";

const EMPTY: Perfil = { nome: "", cpf: "", cns: "", nascimento: "", telefone: "", email: "", endereco: "", bairro: "", unidadeReferencia: "" };

function validatePerfil(p: Perfil): Partial<Record<keyof Perfil, string>> {
  const e: Partial<Record<keyof Perfil, string>> = {};
  if (p.nome.trim().split(/\s+/).length < 2) e.nome = "Informe nome e sobrenome.";
  if (!isValidCpf(p.cpf)) e.cpf = "CPF inválido. Confira os 11 dígitos.";
  if (p.cns && !isValidCns(p.cns)) e.cns = "O Cartão SUS deve ter 15 dígitos.";
  if (!p.nascimento) e.nascimento = "Campo obrigatório.";
  else if (p.nascimento > todayIso()) e.nascimento = "A data de nascimento não pode ser futura.";
  if (!isValidPhone(p.telefone)) e.telefone = "Informe um telefone com DDD.";
  if (!isValidEmail(p.email)) e.email = "Informe um e-mail válido.";
  if (p.endereco.trim().length < 5) e.endereco = "Informe o endereço completo.";
  if (!p.bairro) e.bairro = "Selecione o bairro.";
  return e;
}

/** Formulário de dados cadastrais: usado para entrar (cadastro simulado) e para atualização cadastral */
export function PerfilForm({ mode, onDone }: { mode: "login" | "update"; onDone?: () => void }) {
  const { perfil, login, update } = useSession();
  const { notify } = usePortal();
  const [values, setValues] = useState<Perfil>(perfil ?? EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Perfil, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (key: keyof Perfil) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validatePerfil(values);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`form[data-perfil] [name="${first}"]`)?.focus());
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (mode === "login" || !perfil) {
        login(values);
        claimUnownedRecords(onlyDigits(values.cpf));
        notify(`Bem-vindo(a), ${values.nome.split(" ")[0]}! Seus dados foram salvos neste navegador.`);
      } else {
        update(values);
        notify("Dados cadastrais atualizados com sucesso.");
      }
      setSaving(false);
      setSaved(true);
      onDone?.();
    }, 450);
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form data-perfil noValidate onSubmit={submit} className="flex flex-col gap-space-md">
      {hasErrors && <FormAlert tone="error">Corrija os campos destacados para continuar.</FormAlert>}
      {saved && mode === "update" && !hasErrors && <FormAlert tone="success">Cadastro atualizado em {formatDateTime(new Date().toISOString())}.</FormAlert>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <TextField className="md:col-span-2" label="Nome completo" name="nome" value={values.nome} onChange={set("nome")} required error={errors.nome} autoComplete="name" />
        <TextField label="CPF" name="cpf" value={values.cpf} onChange={set("cpf")} mask={maskCpf} inputMode="numeric" required error={errors.cpf} />
        <TextField label="Cartão SUS (CNS)" name="cns" value={values.cns} onChange={set("cns")} mask={maskCns} inputMode="numeric" error={errors.cns} help="Opcional — 15 dígitos." />
        <TextField label="Data de nascimento" name="nascimento" type="date" value={values.nascimento} onChange={set("nascimento")} required error={errors.nascimento} />
        <TextField label="Telefone" name="telefone" type="tel" value={values.telefone} onChange={set("telefone")} mask={maskPhone} inputMode="numeric" required error={errors.telefone} />
        <TextField className="md:col-span-2" label="E-mail" name="email" type="email" value={values.email} onChange={set("email")} required error={errors.email} autoComplete="email" />
        <TextField label="Endereço" name="endereco" value={values.endereco} onChange={set("endereco")} required error={errors.endereco} autoComplete="street-address" />
        <SelectField label="Bairro" name="bairro" value={values.bairro} onChange={set("bairro")} required error={errors.bairro} options={BAIRROS.map((b) => ({ value: b, label: b }))} />
        <SelectField
          className="md:col-span-2"
          label="Unidade de saúde de referência"
          name="unidadeReferencia"
          value={values.unidadeReferencia}
          onChange={set("unidadeReferencia")}
          options={UNIDADES.filter((u) => u.tipo !== "Farmácia de referência").map((u) => ({ value: u.nome, label: `${u.nome} (${u.bairro})` }))}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {mode === "update" && perfil && (
          <Button variant="secondary" onClick={() => { setValues(perfil); setErrors({}); }} disabled={saving}>
            Descartar alterações
          </Button>
        )}
        <Button type="submit" icon={mode === "login" ? "login" : "save"} loading={saving}>
          {saving ? "Salvando..." : mode === "login" ? "Entrar" : "Salvar dados"}
        </Button>
      </div>
    </form>
  );
}

/* 2.1 — Atualização cadastral (na página Acesso e Funcionamento) */
export function AtualizacaoCadastral() {
  const { perfil } = useSession();
  return (
    <ServiceCard
      id="atualizacao-cadastral"
      icon="badge"
      title="Atualização Cadastral SUS"
      description={perfil ? "Mantenha seus dados atualizados para receber avisos de consultas e campanhas." : "Informe seus dados para se identificar no portal e manter o cadastro atualizado."}
    >
      <PerfilForm key={perfil?.cpf ?? "novo"} mode={perfil ? "update" : "login"} />
    </ServiceCard>
  );
}

/* Minha Conta — área do cidadão (simulada) */
export function MinhaConta() {
  const { perfil, cpf, loginDemo, logout } = useSession();
  const { notify } = usePortal();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const manifestacoes = useManifestacoes().items;
  const voluntarios = useVoluntarios().items;
  const tfd = useTfd().items;
  const visa = useSolicitacoesVisa().items;
  const castracoes = useCastracoes().items;
  const zoonoses = useDenuncias().items;

  if (!perfil) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-space-lg items-start">
        <ServiceCard id="entrar" icon="login" title="Entrar ou criar cadastro" description="Identifique-se com seus dados para acompanhar seus protocolos em um só lugar.">
          <PerfilForm mode="login" />
        </ServiceCard>
        <div className="bg-brand-purple-deep text-text-on-purple p-space-md rounded-xl shadow-md flex flex-col gap-3">
          <span className="font-headline-sm text-headline-sm font-bold">Acesso de demonstração</span>
          <p className="font-body-md text-body-md text-primary-fixed">
            Entre como {DEMO_USER.nome} para ver manifestações e agendamentos já cadastrados.
          </p>
          <Button
            variant="secondary"
            icon="person"
            onClick={() => {
              loginDemo();
              claimUnownedRecords(onlyDigits(DEMO_USER.cpf));
              notify(`Bem-vinda, ${DEMO_USER.nome.split(" ")[0]}!`);
            }}
          >
            Entrar com usuário de demonstração
          </Button>
          <p className="font-label-sm text-label-sm text-primary-fixed-dim">MVP: não há autenticação real. Os dados ficam apenas neste navegador.</p>
        </div>
      </div>
    );
  }

  const grupos = [
    { titulo: "Manifestações (Ouvidoria)", href: "/institucional/transparencia-ouvidoria/ouvidoria-sus", icon: "record_voice_over", itens: manifestacoes.map((r) => ({ ...r, label: `${r.tipo} — ${r.assunto}` })) },
    { titulo: "Solicitações de TFD", href: "/institucional/apoio-logistico/tfd-logistica", icon: "airport_shuttle", itens: tfd.map((r) => ({ ...r, label: `${r.especialidade} — ${r.cidadeDestino}` })) },
    { titulo: "Inscrições de voluntariado", href: "/institucional/apoio-logistico/inscricao-de-voluntarios", icon: "volunteer_activism", itens: voluntarios.map((r) => ({ ...r, label: r.area })) },
    { titulo: "Agendamentos do Castramóvel", href: "/vigilancia-sanitaria/servicos-veterinarios/castramovel", icon: "pets", itens: castracoes.map((r) => ({ ...r, label: `${r.nomeAnimal} (${r.especie})` })) },
    { titulo: "Visitas de endemias", href: "/vigilancia-sanitaria/servicos-veterinarios/controle-de-zoonoses", icon: "pest_control", itens: zoonoses.map((r) => ({ ...r, label: r.tipo })) },
    { titulo: "Vigilância sanitária", href: "/vigilancia-sanitaria/servicos", icon: "verified_user", itens: visa.map((r) => ({ ...r, label: `${r.tipo} — ${r.razaoSocial}` })) },
  ].map((g) => ({ ...g, itens: g.itens.filter((item) => item.ownerCpf === cpf) }));
  const total = grupos.reduce((sum, g) => sum + g.itens.length, 0);

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="bg-surface-card rounded-2xl shadow-sm p-space-lg flex flex-col md:flex-row md:items-center gap-space-md justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand-purple-base text-white flex items-center justify-center font-headline-md text-headline-md">
            {perfil.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="font-headline-sm text-headline-sm text-brand-purple-deep">{perfil.nome}</p>
            <p className="font-label-sm text-label-sm text-text-muted">
              CPF {maskCpf(perfil.cpf)} {perfil.cns && `· CNS ${maskCns(perfil.cns)}`} · Nascimento {formatDate(perfil.nascimento)}
            </p>
            <p className="font-label-sm text-label-sm text-text-muted">
              {perfil.endereco} — {perfil.bairro} · {maskPhone(perfil.telefone)} · {perfil.email}
            </p>
            {perfil.unidadeReferencia && <p className="font-label-sm text-label-sm text-brand-purple-base font-semibold">Unidade de referência: {perfil.unidadeReferencia}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/institucional/acesso-funcionamento/atualizacao-cadastral" className="h-11 px-space-md rounded-lg bg-surface-card text-brand-purple-deep border border-border-subtle hover:bg-brand-purple-soft font-label-md text-label-md inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Atualizar dados
          </Link>
          <Button variant="secondary" icon="logout" onClick={() => setConfirmLogout(true)}>
            Sair
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-headline-lg text-headline-lg text-brand-purple-deep">Meus protocolos</h2>
        <p className="font-body-md text-body-md text-text-muted">{total} {total === 1 ? "registro vinculado" : "registros vinculados"} ao seu CPF.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {grupos.map((g) => (
          <div key={g.titulo} className="bg-surface-card rounded-2xl shadow-sm p-space-md flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 font-label-lg text-label-lg text-brand-purple-deep">
                <span className="material-symbols-outlined text-brand-purple-vivid text-[22px]">{g.icon}</span>
                {g.titulo}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-purple-soft text-brand-purple-deep font-label-sm text-label-sm font-bold">{g.itens.length}</span>
            </div>
            {g.itens.length === 0 ? (
              <p className="font-label-sm text-label-sm text-text-muted">Nenhum registro.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {g.itens.slice(0, 4).map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface-canvas px-3 py-2">
                    <span className="min-w-0">
                      <span className="block font-label-md text-label-md truncate">{item.label}</span>
                      <span className="block font-label-sm text-label-sm text-text-muted">{item.protocolo}</span>
                    </span>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
            <Link href={g.href} className="mt-auto font-label-sm text-label-sm font-bold text-brand-purple-base hover:text-brand-purple-dark flex items-center gap-1">
              Gerenciar
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" icon="restart_alt" className="text-status-emergency hover:bg-status-emergency-bg" onClick={() => setConfirmReset(true)}>
          Restaurar dados de demonstração
        </Button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Sair da conta?"
        message="Seus registros continuam salvos neste navegador e voltam a aparecer quando você entrar novamente com o mesmo CPF."
        confirmLabel="Sair"
        tone="default"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          logout();
          setConfirmLogout(false);
          notify("Você saiu da sua conta.");
        }}
      />
      <ConfirmDialog
        open={confirmReset}
        title="Restaurar dados de demonstração?"
        message="Todos os registros criados neste navegador serão apagados e os dados iniciais do MVP serão restaurados. Esta ação não pode ser desfeita."
        confirmLabel="Restaurar"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAllData();
          setConfirmReset(false);
          notify("Dados de demonstração restaurados.");
        }}
      />
    </div>
  );
}
