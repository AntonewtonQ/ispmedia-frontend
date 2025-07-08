import { Musica } from "./Musica";
import { Usuario } from "./Usuario";

export interface Playlist {
  id: number;
  nome: string;
  descricao?: string;
  visibilidade: "PUBLICA" | "PRIVADA";
  usuarioId: number;
  usuario:Usuario;
  musicas: Musica[];
}
