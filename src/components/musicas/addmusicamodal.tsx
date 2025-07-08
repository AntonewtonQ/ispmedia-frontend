"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onSuccess?: () => void;
  albumId?: number; // ⬅️ opcional, usado para adicionar diretamente a um álbum
}

export function AddMusicaModal({ onSuccess, albumId: propAlbumId }: Props) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState("");
  const [compositor, setCompositor] = useState("");
  const [artistaId, setArtistaId] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const [artistas, setArtistas] = useState<any[]>([]);
  const [albuns, setAlbuns] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const a1 = await fetch("http://localhost:1024/api/artistas");
        const a2 = await fetch("http://localhost:1024/api/albums");
        if (!a1.ok || !a2.ok) throw new Error("Erro ao buscar dados");
        const a1Data = await a1.json();
        const a2Data = await a2.json();
        setArtistas(a1Data);
        setAlbuns(a2Data);
      } catch {
        setErro("Erro ao carregar artistas e álbuns");
      }
    }

    if (open) fetchData();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      let uploadId: number | null = null;

      if (arquivo) {
        const formData = new FormData();
        formData.append("file", arquivo);

        const uploadRes = await fetch("http://localhost:1024/api/uploads", {
          method: "POST",
          headers: { Authorization: `${token}` },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Erro ao fazer upload do arquivo");

        const uploadData = await uploadRes.json();
        uploadId = uploadData.id;
      }

      const musicaRes = await fetch("http://localhost:1024/api/musicas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          titulo,
          duracao: Number(duracao),
          compositor,
          artistaId: Number(artistaId),
          albumId: propAlbumId ? Number(propAlbumId) : Number(albumId),
          uploadId,
        }),
      });

      if (!musicaRes.ok) throw new Error("Erro ao criar música");

      setTitulo("");
      setDuracao("");
      setCompositor("");
      setArtistaId("");
      setAlbumId("");
      setArquivo(null);
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Adicionar Música</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Música</DialogTitle>
          <DialogDescription>
            Preencha os dados e selecione o arquivo da música.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Duração (segundos)"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            required
          />
          <Input
            placeholder="Compositor"
            value={compositor}
            onChange={(e) => setCompositor(e.target.value)}
            required
          />
          <select
            value={artistaId}
            onChange={(e) => setArtistaId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione um artista</option>
            {artistas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
          {!propAlbumId && (
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione um álbum</option>
              {albuns.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titulo}
                </option>
              ))}
            </select>
          )}
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setArquivo(e.target.files?.[0] || null)}
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Música"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
