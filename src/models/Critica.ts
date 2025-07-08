import { Usuario } from "./Usuario";

export interface Critica {
  id: number;
  albumId: number;
  usuarioId: number;
  pontuacao: number; // de 0 a 10
  comentario?: string;
  
}
