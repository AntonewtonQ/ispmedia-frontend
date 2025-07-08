export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'EDITOR' | 'VISITANTE';
  dataInscricao: string;
}
