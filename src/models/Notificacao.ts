export interface Notificacao {
  id: number;
  usuarioId: number;
  mensagem: string;
  tipo: 'PROMOCAO_EDITOR' | 'ALTERACAO_DESCRICAO';
  estado: 'PENDENTE' | 'LIDA';
  dataCriacao: string;
}
