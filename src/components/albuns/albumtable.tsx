"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";
import { Album } from "@/models/Album";
import { EditAlbumModal } from "./editalbummodal";

interface AlbumTableProps {
  albuns?: Album[];
  setAlbuns?: React.Dispatch<React.SetStateAction<Album[]>>;
  termoPesquisa: string;
}

const AlbumTable = ({ termoPesquisa }: AlbumTableProps) => {
  const { token } = useAuth();
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [albumParaEditar, setAlbumParaEditar] = useState<Album | null>(null);

  useEffect(() => {
    async function fetchAlbuns() {
      try {
        const res = await fetch("http://localhost:1024/api/albums", {
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar álbuns");
        const data = await res.json();
        setAlbuns(data);
      } catch (error) {
        setErro("Erro ao carregar álbuns");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchAlbuns();
  }, [token]);

  async function handleDelete(id: number) {
    const confirmar = confirm("Deseja realmente apagar este álbum?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:1024/api/albums/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar álbum");

      setAlbuns((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Erro ao deletar álbum");
    }
  }

  const albunsFiltrados = albuns.filter((a) =>
    a.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Álbuns</h1>
      {erro && <p className="text-red-500">{erro}</p>}
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albunsFiltrados.map((album) => (
              <TableRow key={album.id}>
                <TableCell>{album.id}</TableCell>
                <TableCell>{album.titulo}</TableCell>
                <TableCell className="max-w-[300px] truncate text-gray-700">
                  {album.descricao}
                </TableCell>
                <TableCell>
                  {new Date(album.dataLancamento).toLocaleDateString("pt-PT")}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => setAlbumParaEditar(album)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(album.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {albumParaEditar && (
        <EditAlbumModal
          album={albumParaEditar}
          token={token}
          onClose={() => setAlbumParaEditar(null)}
          onSuccess={(albumAtualizado) => {
            setAlbumParaEditar(null);
            setAlbuns((prev) =>
              prev.map((a) =>
                a.id === albumAtualizado.id ? albumAtualizado : a
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default AlbumTable;
