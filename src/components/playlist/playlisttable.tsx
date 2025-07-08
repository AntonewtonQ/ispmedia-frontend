"use client";

import React, { useEffect, useState } from "react";
import { Playlist } from "@/models/Playlist";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Menu, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { EditPlaylistModal } from "./editplaylistmodal";

interface PlaylistTableProps {
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  termoPesquisa: string;
}

export default function PlaylistTable({
  playlists,
  setPlaylists,
  termoPesquisa,
}: PlaylistTableProps) {
  const { token } = useAuth();
  const [playlistParaEditar, setPlaylistParaEditar] = useState<Playlist | null>(
    null
  );
  const router = useRouter();

  async function handleDelete(id: number) {
    const confirmar = confirm("Deseja realmente apagar esta playlist?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:1024/api/playlists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar playlist");

      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao deletar playlist");
    }
  }

  const filtradas = playlists.filter((p) =>
    p.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtradas.map((playlist) => (
            <TableRow
              key={playlist.id}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <TableCell>{playlist.id}</TableCell>
              <TableCell>{playlist.nome}</TableCell>
              <TableCell className="max-w-[300px] truncate text-gray-700">
                {playlist.descricao}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  onClick={() =>
                    router.push(`/dashboard/playlists/${playlist.id}`)
                  }
                  size="sm"
                >
                  <Menu />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setPlaylistParaEditar(playlist)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(playlist.id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {playlistParaEditar && (
        <EditPlaylistModal
          playlist={playlistParaEditar}
          token={token}
          onClose={() => setPlaylistParaEditar(null)}
          onSuccess={(atualizada) => {
            setPlaylistParaEditar(null);
            setPlaylists((prev) =>
              prev.map((p) => (p.id === atualizada.id ? atualizada : p))
            );
          }}
        />
      )}
    </div>
  );
}
