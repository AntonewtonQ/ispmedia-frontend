"use client";

import { useEffect, useState } from "react";
import { Playlist } from "@/models/Playlist";
import { Input } from "@/components/ui/input";
import { AddPlaylistModal } from "@/components/playlist/addplaylistmodal";
import PlaylistTable from "@/components/playlist/playlisttable";
import { useAuth } from "@/context/AuthContext";

export default function PlaylistPage() {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/playlists`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        if (!res.ok) throw new Error("Erro ao carregar playlists");

        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        setErro("Erro ao buscar playlists");
      }
    }

    if (token) fetchPlaylists();
  }, [token]);

  const playlistsFiltradas = playlists.filter((p) =>
    p.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <AddPlaylistModal
          onSuccess={(nova) => setPlaylists((prev) => [...prev, nova])}
        />
      </div>

      <Input
        placeholder="Pesquisar por nome"
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
        className="w-64"
      />

      {erro && <p className="text-red-500">{erro}</p>}

      <PlaylistTable
        playlists={playlistsFiltradas}
        setPlaylists={setPlaylists}
        termoPesquisa={termoPesquisa}
      />
    </div>
  );
}
