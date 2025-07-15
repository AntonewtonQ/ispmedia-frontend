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
import { useEffect, useState } from "react";
import { Musica } from "@/models/Musica";

interface Props {
  musica: Musica;
  token: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditMusicaModal({ musica, token, onClose, onSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState("");
  const [compositor, setCompositor] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setTitulo(musica.titulo);
    setDuracao(musica.duracao);
    setCompositor(musica.compositor);
  }, [musica]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:1024/api/musicas/${musica.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ titulo, duracao, compositor }),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar música");

      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro inesperado";
      setErro(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Música</DialogTitle>
          <DialogDescription>
            Altere os dados da música e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block mb-1 font-medium">Título</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Duração</label>
            <Input
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Compositor</label>
            <Input
              value={compositor}
              onChange={(e) => setCompositor(e.target.value)}
              required
            />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
