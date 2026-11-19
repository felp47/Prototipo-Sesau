const SUCCESS = ["Respondida", "Confirmado", "Aprovado", "Aprovada", "Concluída", "Realizada", "Autorizada", "Agendada", "Inscrição aprovada", "Deferido"];
const WARNING = ["Em análise", "Aguardando vaga", "Aguardando documentos", "Em vistoria"];
const DANGER = ["Cancelada", "Cancelado", "Indeferido", "Esgotado"];

export function StatusBadge({ status }: { status: string }) {
  const tone = SUCCESS.includes(status)
    ? "bg-status-success-bg text-status-success"
    : WARNING.includes(status)
      ? "bg-status-warning-bg text-status-warning"
      : DANGER.includes(status)
        ? "bg-status-emergency-bg text-status-emergency"
        : "bg-brand-purple-soft text-brand-purple-deep";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${tone}`}>{status}</span>;
}
