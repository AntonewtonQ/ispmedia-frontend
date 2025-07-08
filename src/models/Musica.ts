export interface Musica {
  id: number;
  titulo: string;
  duracao: string; // "mm:ss"
  compositor: string;
  albumId: number;
  artistaId: number;
  uploadId?: number;
  musicaId?:number;
}
