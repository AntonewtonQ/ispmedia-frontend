"use client";

import { useEffect, useState } from "react";
import { Album } from "@/models/Album";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Upload {
  id: number;
  nomeArquivo: string;
  tipo: string;
  tamanho: number;
}

interface AlbumCardProps {
  album: Album;
  onEdit: (album: Album) => void;
  onDelete: () => void;
}

export function AlbumCard({ album, onEdit, onDelete }: AlbumCardProps) {
  const { token } = useAuth();
  const [upload, setUpload] = useState<Upload | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUpload() {
      if (!album.uploadId) return;

      try {
        const res = await fetch(
          `http://localhost:1024/api/uploads/${album.uploadId}`,
          {
            headers: token ? { Authorization: `${token}` } : {},
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar imagem do álbum");
        const data = await res.json();
        setUpload(data);
      } catch (error) {
        console.error("Erro ao buscar upload:", error);
      }
    }

    fetchUpload();
  }, [album.uploadId, token]);

  return (
    <Card
      onClick={() => router.push(`/dashboard/albuns/${album.id}`)}
      className="w-full max-w-sm shadow-md cursor-pointer"
    >
      <CardHeader className="p-0 h-40 overflow-hidden rounded-t-md">
        {upload?.nomeArquivo ? (
          <img
            src={`http://localhost:1024/files/${upload.nomeArquivo}`}
            alt={album.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-bold truncate">
          {album.titulo}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-3">{album.descricao}</p>
        <p className="text-xs text-gray-400">
          Lançado em{" "}
          {new Date(album.dataLancamento).toLocaleDateString("pt-PT")}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" onClick={() => onEdit(album)} variant="secondary">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={onDelete} variant="destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
