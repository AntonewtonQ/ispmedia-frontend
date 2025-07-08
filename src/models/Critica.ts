export interface Critica {
  id: number;
  albumId: number;
  usuarioId: number;
  nota: number; // de 0 a 10
  comentario?: string; // máximo 300 caracteres
  data: string;
}
