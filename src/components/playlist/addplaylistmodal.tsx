"use client";

import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Playlist } from "@/models/Playlist";

interface Props {
  onSuccess?: (nova: Playlist) => void;
}

export function AddPlaylistModal({ onSuccess }: Props) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [visibilidade, setVisibilidade] = useState<"PUBLICA" | "PRIVADA">(
    "PUBLICA"
  );
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ nome, descricao, visibilidade }),
      });

      if (!res.ok) throw new Error("Erro ao criar playlist");

      const novaPlaylist: Playlist = await res.json();
      setNome("");
      setDescricao("");
      setVisibilidade("PUBLICA");
      setOpen(false);
      onSuccess?.(novaPlaylist);
    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Nova Playlist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Playlist</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova playlist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Nome da playlist"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Visibilidade
            </label>
            <select
              value={visibilidade}
              onChange={(e) =>
                setVisibilidade(e.target.value as "PUBLICA" | "PRIVADA")
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="PUBLICA">Pública</option>
              <option value="PRIVADA">Privada</option>
            </select>
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
