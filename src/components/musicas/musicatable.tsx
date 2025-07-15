"use client";

import React, { useEffect, useState } from "react";
import { Musica } from "@/models/Musica";
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
import { EditMusicaModal } from "./editarmusicamodal";
import { Upload } from "@/models/Upload";

interface MusicaTableProps {
  termoPesquisa: string;
}

const MusicaTable = ({ termoPesquisa }: MusicaTableProps) => {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [musicaParaEditar, setMusicaParaEditar] = useState<Musica | null>(null);
  const { token } = useAuth();
  const [uploads, setUploads] = useState<Record<number, Upload>>({});

  async function getUpload(id: number) {
    if (uploads[id]) return uploads[id]; // já foi buscado

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      setUploads((prev) => ({ ...prev, [id]: data }));
      return data;
    } catch {
      console.error("Erro ao buscar upload");
      return null;
    }
  }

  useEffect(() => {
    if (!token) return; // aguarda token

    async function fetchMusicas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/musicas`);
        if (!res.ok) throw new Error("Erro ao buscar músicas");
        const data = await res.json();
        setMusicas(data);

        // Buscar uploads de forma assíncrona
        const uploadIds = data
          .map((m: any) => m.uploadId)
          .filter((id: any): id is number => typeof id === "number");

        const uniqueIds = Array.from(new Set(uploadIds));
        await Promise.all(uniqueIds.map((id) => getUpload(Number(id))));
      } catch (error) {
        setErro("Erro ao carregar músicas");
      } finally {
        setLoading(false);
      }
    }

    fetchMusicas();
  }, [token]);

  async function handleEliminar(id: number) {
    const confirmar = confirm("Tem certeza que deseja eliminar esta música?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/musicas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao eliminar música");

      setMusicas((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      alert("Erro ao eliminar música");
    }
  }

  const musicasFiltradas = musicas.filter((m) =>
    m.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Músicas</h1>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Compositor</TableHead>
              <TableHead>Ações</TableHead>
              <TableHead>Reproduzir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {musicasFiltradas.map((musica) => (
              <TableRow key={musica.id}>
                <TableCell>{musica.id}</TableCell>
                <TableCell>{musica.titulo}</TableCell>
                <TableCell>{musica.duracao}</TableCell>
                <TableCell>{musica.compositor}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setMusicaParaEditar(musica)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEliminar(musica.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
                <TableCell>
                  {musica.uploadId && uploads[musica.uploadId]?.nomeArquivo ? (
                    <audio
                      controls
                      src={`${process.env.NEXT_PUBLIC_FILES_URL}/${
                        uploads[musica.uploadId].nomeArquivo
                      }`}
                      className="w-48"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sem ficheiro</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {musicaParaEditar && (
        <EditMusicaModal
          musica={musicaParaEditar}
          token={token}
          onClose={() => setMusicaParaEditar(null)}
          onSuccess={() => {
            setMusicaParaEditar(null);
            setLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/musicas`)
              .then((res) => res.json())
              .then((data) => setMusicas(data))
              .finally(() => setLoading(false));
          }}
        />
      )}
    </div>
  );
};

export default MusicaTable;
