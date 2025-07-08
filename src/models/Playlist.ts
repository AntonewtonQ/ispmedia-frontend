import { Musica } from "./Musica";

export interface Playlist {
  id: number;
  nome: string;
  publica: boolean;
  usuarioId: number;
  musicas: Musica[];
}
