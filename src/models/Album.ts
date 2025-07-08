export interface Album {
  id: number;
  titulo: string;
  genero: string;
  dataLancamento: string;
  artistaId: number;
  descricao?: string;
  uploadId?: number;
}
