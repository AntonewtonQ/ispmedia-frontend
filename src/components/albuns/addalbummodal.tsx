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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Album } from "@/models/Album";

interface Props {
  onSuccess?: (albumCriado: Album) => void;
}

export function AddAlbumModal({ onSuccess }: Props) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [artistaId, setArtistaId] = useState("");
  const [dataLancamento, setDataLancamento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [artistas, setArtistas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchArtistas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artistas`);
        if (!res.ok) throw new Error("Erro ao buscar artistas");
        const data = await res.json();
        setArtistas(data);
      } catch {
        setErro("Erro ao carregar artistas");
      }
    }

    if (open) fetchArtistas();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      let uploadId: number | null = null;

      if (imagem) {
        const formData = new FormData();
        formData.append("file", imagem);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
          {
            method: "POST",
            headers: {
              Authorization: `${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Erro ao fazer upload da imagem");
        const uploadData = await uploadRes.json();
        uploadId = uploadData.id;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/albums`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          dataLancamento,
          artistaId: Number(artistaId),
          uploadId,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar álbum");

      const albumCriado = await res.json();
      setTitulo("");
      setDescricao("");
      setImagem(null);
      setArtistaId("");
      setDataLancamento("");
      setOpen(false);
      onSuccess?.(albumCriado);
    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Adicionar Álbum</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Álbum</DialogTitle>
          <DialogDescription>
            Preencha os dados do álbum e envie uma imagem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Título do álbum"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
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
          <Input
            type="date"
            value={dataLancamento}
            onChange={(e) => setDataLancamento(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files?.[0] || null)}
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar álbum"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
