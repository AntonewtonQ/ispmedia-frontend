import { Usuario } from "./Usuario";

export interface Grupo {
  id: number;
  nome: string;
  descricao: string;
  ownerId: number;
  owner: Usuario;
  membros: { usuarioId: number; status: "ACEITO" | "PENDENTE" | "RECUSADO" }[];
  editores: { usuarioId: number }[];
}
