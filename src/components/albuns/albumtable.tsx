"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Album } from "@/models/Album"; // Certifique-se que o caminho está correto
import { EditAlbumModal } from "./editalbummodal";
import { AlbumCard } from "./cardalbum";

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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Lista de Álbuns</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando álbuns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Álbuns</h1>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {albunsFiltrados.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            {termoPesquisa
              ? `Nenhum álbum encontrado para "${termoPesquisa}"`
              : "Nenhum álbum encontrado"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {albunsFiltrados.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onEdit={(album) => setAlbumParaEditar(album)}
              onDelete={() => handleDelete(album.id)}
            />
          ))}
        </div>
      )}

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
