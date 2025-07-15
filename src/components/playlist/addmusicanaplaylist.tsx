"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Musica } from "@/models/Musica";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
  playlistId: number;
  onClose: () => void;
  onSuccess: () => void;
  open: boolean;
}

export function AdicionarMusicasNaPlaylistModal({
  playlistId,
  onClose,
  onSuccess,
  open,
}: Props) {
  const { token } = useAuth();
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMusicas() {
      try {
        const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/musicas", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const data = await res.json();
        setMusicas(data);
      } catch {
        setErro("Erro ao carregar músicas");
      }
    }

    if (open) fetchMusicas();
  }, [open, token]);

  async function adicionarMusica(musicaId: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/musicas/${musicaId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao adicionar música à playlist");

      onSuccess();
    } catch (err) {
      alert("Erro ao adicionar música.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Músicas à Playlist</DialogTitle>
        </DialogHeader>

        {erro && <p className="text-red-500">{erro}</p>}

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {musicas.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center border p-2 rounded-md"
            >
              <div>
                <strong>{m.titulo}</strong> — {m.compositor} ({m.duracao}s)
              </div>
              <Button size="sm" onClick={() => adicionarMusica(m.id)}>
                Adicionar
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
