"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  grupoId: number;
  open: boolean;
  onClose: () => void;
}

interface Membro {
  usuarioId: number;
  grupoId: number;
  status: string;
  usuario: {
    id: number;
    nome: string;
  };
}

export function GerirMembrosModal({ grupoId, open, onClose }: Props) {
  const { token } = useAuth();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function fetchMembros() {
      try {
        const res = await fetch(`http://localhost:1024/api/grupos/${grupoId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await res.json();
        setMembros(data.membros);
      } catch {
        setErro("Erro ao carregar membros");
      }
    }
    fetchMembros();
  }, [open, grupoId, token]);

  async function handleConvidar() {
    if (!usuarioId) return;
    setLoading(true);
    setErro(null);
    try {
      console.log("Convidando usuário:", grupoId, usuarioId);
      const res = await fetch(
        `http://localhost:1024/api/grupos/${grupoId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ usuarioId: Number(usuarioId) }),
        }
      );

      if (!res.ok) throw new Error("Erro ao convidar usuário");

      setUsuarioId("");
      const atualizado = await res.json();
      setMembros((prev) => [...prev, atualizado]);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gerir Membros do Grupo</DialogTitle>
          <DialogDescription>
            Convide novos membros e visualize o status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="ID do usuário a convidar"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            />
            <Button onClick={handleConvidar} disabled={loading}>
              Convidar
            </Button>
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div>
            <h4 className="font-semibold mb-2">Membros:</h4>
            <ul className="space-y-1 text-sm">
              {membros.map((m) => (
                <li key={m.usuarioId} className="flex justify-between">
                  <span>
                    {m.usuario?.nome ?? `Usuário #${m.usuarioId}`} —{" "}
                    <em>{m.status}</em>
                  </span>
                </li>
              ))}
              {membros.length === 0 && <li>Nenhum membro ainda.</li>}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
