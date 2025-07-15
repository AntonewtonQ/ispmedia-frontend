"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Album } from "@/models/Album";

interface Props {
  album: Album;
  token: string | null;
  onSuccess: (albumAtualizado: Album) => void;
  onClose: () => void;
}

export function EditAlbumModal({ album, token, onSuccess, onClose }: Props) {
  const [open, setOpen] = useState(true);
  const [titulo, setTitulo] = useState(album.titulo);
  const [descricao, setDescricao] = useState(album.descricao);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:1024/api/albums/${album.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ titulo, descricao }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar álbum");

      const atualizado = await res.json();
      onSuccess(atualizado);
      setOpen(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado";
      setErro(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Álbum</DialogTitle>
          <DialogDescription>
            Altere o título e a descrição do álbum.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
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
