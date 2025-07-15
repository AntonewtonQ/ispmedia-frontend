"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Playlist } from "@/models/Playlist";
import { useAuth } from "@/context/AuthContext";

interface Props {
  playlist: Playlist;
  token?: string | null;
  onSuccess?: (playlistAtualizada: Playlist) => void;
  onClose: () => void;
}

export function EditPlaylistModal({ playlist, onSuccess, onClose }: Props) {
  const { token } = useAuth();
  const [nome, setNome] = useState(playlist.nome);
  const [descricao, setDescricao] = useState(playlist.descricao || "");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlist.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ nome, descricao }),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar playlist");

      const atualizada = await res.json();
      onSuccess?.(atualizada);
    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Playlist</DialogTitle>
          <DialogDescription>
            Altere as informações da sua playlist.
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
          />

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
