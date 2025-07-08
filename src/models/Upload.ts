export interface Upload {
  id: number;
  nomeArquivo: string;
  tipo: string; // ex: "mp3", "mp4"
  tamanho: number; // bytes
  url: string;
  musicaId?: number;
  donoId: number;
}
