"use client";

import React, { useEffect, useState } from "react";
import { Artista } from "@/models/Artista";
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
import { toast } from "sonner";
import { EditArtistaModal } from "./editarmodal";
import { Pencil, Trash2 } from "lucide-react";

interface AlbunsMusicas {
  albuns: string[];
  musicas: string[];
}
interface ArtistatableProps {
  termoPesquisa: string;
}

const Artistatable = ({ termoPesquisa }: ArtistatableProps) => {
  const { token } = useAuth();
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detalhes, setDetalhes] = useState<Record<number, AlbunsMusicas>>({});
  const [artistaParaEditar, setArtistaParaEditar] = useState<Artista | null>(
    null
  );

  useEffect(() => {
    async function fetchArtistas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artistas`);
        if (!res.ok) throw new Error("Erro ao buscar artistas");
        const data = await res.json();
        setArtistas(data);
      } catch (error) {
        setErro("Erro ao carregar artistas");
      } finally {
        setLoading(false);
      }
    }

    fetchArtistas();
  }, []);

  const toggleExpand = async (artistaId: number) => {
    if (expanded === artistaId) {
      setExpanded(null);
      return;
    }

    if (!detalhes[artistaId]) {
      try {
        const [albunsRes, musicasRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/artistas/${artistaId}/albuns`
          ).then((res) => res.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/artistas/${artistaId}/musicas`
          ).then((res) => res.json()),
        ]);

        setDetalhes((prev) => ({
          ...prev,
          [artistaId]: {
            albuns: albunsRes.map((a: any) => a.titulo),
            musicas: musicasRes.map((m: any) => m.titulo),
          },
        }));
      } catch {
        console.error("Erro ao buscar detalhes");
      }
    }

    setExpanded(artistaId);
  };

  const artistasFiltrados = artistas.filter((a) =>
    a.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  async function handleEliminar(id: number) {
    const confirmar = confirm("Tem certeza que deseja eliminar este artista?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artistas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao eliminar artista");

      setArtistas((prev) => prev.filter((a) => a.id !== id));
      toast.success("Artista eliminado com sucesso!");
    } catch (error) {
      toast.error("Erro ao eliminar artista");
    }
  }
  function handleEditar(artista: Artista) {
    setArtistaParaEditar(artista);
  }

  if (loading) return <p className="p-4">Carregando artistas...</p>;
  if (erro) return <p className="text-red-500 p-4">{erro}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Artistas</h1>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artistasFiltrados.map((artista) => (
              <React.Fragment key={artista.id}>
                <TableRow>
                  <TableCell>{artista.id}</TableCell>
                  <TableCell>{artista.nome}</TableCell>
                  <TableCell>{artista.genero}</TableCell>
                  <TableCell className="max-w-[250px] truncate text-gray-700">
                    {artista.descricao}
                  </TableCell>
                  <TableCell>
                    {new Date(artista.dataCriacao).toLocaleDateString("pt-PT")}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpand(artista.id)}
                    >
                      {expanded === artista.id ? "Fechar" : "Detalhes"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditar(artista)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEliminar(artista.id)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>

                {expanded === artista.id && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="bg-gray-50 text-sm text-gray-800"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold mb-1">Álbuns:</p>
                          <ul className="list-disc list-inside">
                            {detalhes[artista.id]?.albuns?.map((a, i) => (
                              <li key={i}>{a}</li>
                            )) || <li>Nenhum álbum</li>}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Músicas:</p>
                          <ul className="list-disc list-inside">
                            {detalhes[artista.id]?.musicas?.map((m, i) => (
                              <li key={i}>{m}</li>
                            )) || <li>Nenhuma música</li>}
                          </ul>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {artistaParaEditar && (
          <EditArtistaModal
            artista={artistaParaEditar}
            token={token}
            onClose={() => setArtistaParaEditar(null)}
            onSuccess={() => {
              setArtistaParaEditar(null);
              // refetch para manter sincronizado
              setLoading(true);
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/artistas`)
                .then((res) => res.json())
                .then((data) => setArtistas(data))
                .finally(() => setLoading(false));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Artistatable;
