import { Artista } from "./Artista";
import { Critica } from "./Critica";
import { Musica } from "./Musica";

export interface Album {
  id: number;
  titulo: string;
  genero: string;
  dataLancamento: string;
  artistaId: number;
  descricao?: string;
  uploadId?: number;
  artista?: Artista;
  musicas?: Musica[];
  criticas?: Critica[];
}
