"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Playlist } from "@/models/Playlist";
import { useEffect, useState } from "react";

interface Props {
  musicaId: number;
}

export function GerirPlaylistsDaMusicaModal({ musicaId }: Props) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !token) return;

    async function fetchPlaylists() {
      setErro(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/playlists`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        if (!res.ok) throw new Error();
        const data: Playlist[] = await res.json();
        setPlaylists(data);

        // Marcar playlists que já contêm a música
        const selecionadasIds = new Set<number>();
        for (const p of data) {
          if (p.musicas?.some((m) => m.id === musicaId)) {
            selecionadasIds.add(p.id);
          }
        }
        setSelecionadas(selecionadasIds);
      } catch {
        setErro("Erro ao carregar playlists");
      }
    }

    fetchPlaylists();
  }, [open, token, musicaId]);

  async function toggleMusicaNaPlaylist(
    playlistId: number,
    adicionar: boolean
  ) {
    const metodo = adicionar ? "POST" : "DELETE";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/musicas/${musicaId}`,
        {
          method: metodo,
          headers: { Authorization: `${token}` },
        }
      );
      if (!res.ok) throw new Error();

      setSelecionadas((prev) => {
        const copy = new Set(prev);
        if (adicionar) {
          copy.add(playlistId);
        } else {
          copy.delete(playlistId);
        }
        return copy;
      });
    } catch {
      alert("Erro ao atualizar playlist");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Gerir Playlists</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerir Playlists da Música</DialogTitle>
        </DialogHeader>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <div className="space-y-2">
          {playlists.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhuma playlist encontrada.
            </p>
          )}
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center gap-2">
              <Checkbox
                checked={selecionadas.has(playlist.id)}
                onCheckedChange={(checked) =>
                  toggleMusicaNaPlaylist(playlist.id, Boolean(checked))
                }
              />
              <span>{playlist.nome}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
