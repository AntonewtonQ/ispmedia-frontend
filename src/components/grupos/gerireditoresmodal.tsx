"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
  grupoId: number;
  open: boolean;
  onClose: () => void;
}

interface Editor {
  id: number;
  usuarioId: number;
  usuario: {
    id: number;
    nome: string;
  };
}

export function GerirEditoresModal({ grupoId, open, onClose }: Props) {
  const { token } = useAuth();
  const [editores, setEditores] = useState<Editor[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchEditores() {
      try {
        const res = await fetch(
          `http://localhost:1024/api/grupos/${grupoId}/editors`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await res.json();
        setEditores(data);
      } catch {
        setErro("Erro ao carregar editores");
      }
    }
    fetchEditores();
  }, [open, grupoId, token]);

  async function adicionarEditor() {
    setErro(null);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:1024/api/grupos/${grupoId}/editors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ usuarioId: Number(usuarioId) }),
        }
      );
      if (!res.ok) throw new Error("Erro ao adicionar editor");
      const novo = await res.json();
      setEditores((prev) => [...prev, novo]);
      setUsuarioId("");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removerEditor(editorId: number) {
    try {
      const res = await fetch(
        `http://localhost:1024/api/grupos/${grupoId}/editors/${editorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (!res.ok) throw new Error();
      setEditores((prev) => prev.filter((e) => e.id !== editorId));
    } catch {
      alert("Erro ao remover editor");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gerir Editores do Grupo</DialogTitle>
          <DialogDescription>
            Adicione ou remova editores (co-owners) do grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="ID do usuário"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            />
            <Button onClick={adicionarEditor} disabled={loading}>
              Adicionar
            </Button>
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div>
            <h4 className="font-semibold mb-2">Editores:</h4>
            <ul className="space-y-1 text-sm">
              {editores.map((e) => (
                <li key={e.id} className="flex justify-between">
                  <span>{e.usuario.nome}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removerEditor(e.id)}
                  >
                    Remover
                  </Button>
                </li>
              ))}
              {editores.length === 0 && <li>Nenhum editor ainda.</li>}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
