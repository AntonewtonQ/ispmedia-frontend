import { Album } from "./Album";
import { Musica } from "./Musica";

export interface Artista {
  id: number;
  nome: string;
  descricao?: string;
  genero?: string;
  criadoPor: number; // ID do usuário
  dataCriacao: string; // Data de criação no formato ISO 8601
  albums?: Album[]; // IDs dos álbuns associados
  musicas?: Musica[]; // IDs das músicas associadas
}
