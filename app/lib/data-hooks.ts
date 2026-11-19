"use client";

import { useCallback } from "react";
import {
  DEMO_USER,
  SEED_CASTRACOES,
  SEED_DENUNCIAS,
  SEED_MANIFESTACOES,
  SEED_TFD,
  SEED_VISA,
  SEED_VOLUNTARIOS,
  type AgendamentoCastracao,
  type DenunciaZoonose,
  type Manifestacao,
  type Perfil,
  type SolicitacaoTfd,
  type SolicitacaoVisa,
  type Voluntario,
} from "./mock-data";
import { useCollection, usePersistentState } from "./store";
import { onlyDigits } from "./validators";

/* Sessão simulada do cidadão (sem autenticação real) */
const NO_SESSION: Perfil | null = null;

export function useSession() {
  const [perfil, setPerfil] = usePersistentState<Perfil | null>("sessao", NO_SESSION);
  const login = useCallback((dados: Perfil) => setPerfil(dados), [setPerfil]);
  const loginDemo = useCallback(() => setPerfil(DEMO_USER), [setPerfil]);
  const logout = useCallback(() => setPerfil(null), [setPerfil]);
  const update = useCallback((patch: Partial<Perfil>) => setPerfil((current) => (current ? { ...current, ...patch } : current)), [setPerfil]);
  return { perfil, cpf: perfil ? onlyDigits(perfil.cpf) : "", login, loginDemo, logout, update };
}

/* Coleções — cada uma com prefixo de protocolo e status inicial */
export const useManifestacoes = () => useCollection<Manifestacao>("manifestacoes", SEED_MANIFESTACOES, "OUV", "Registrada");
export const useVoluntarios = () => useCollection<Voluntario>("voluntarios", SEED_VOLUNTARIOS, "VOL", "Inscrição recebida");
export const useTfd = () => useCollection<SolicitacaoTfd>("tfd", SEED_TFD, "TFD", "Em análise");
export const useSolicitacoesVisa = () => useCollection<SolicitacaoVisa>("visa", SEED_VISA, "VISA", "Protocolado");
export const useCastracoes = () => useCollection<AgendamentoCastracao>("castracoes", SEED_CASTRACOES, "CAS", "Confirmado");
export const useDenuncias = () => useCollection<DenunciaZoonose>("zoonoses", SEED_DENUNCIAS, "ZOO", "Recebida");

export const STATUS_EDITAVEIS: Record<string, string[]> = {
  manifestacoes: ["Registrada"],
  voluntarios: ["Inscrição recebida"],
  tfd: ["Em análise"],
  visa: ["Protocolado"],
  castracoes: ["Confirmado"],
  zoonoses: ["Recebida"],
};
