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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function AddArtistaModal({ onSuccess }: { onSuccess?: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      console.log("Token:", token); // <-- Verifique se o token está sendo passado corretamente
      const res = await fetch("http://localhost:1024/api/artistas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // <-- ESSENCIAL
        },
        body: JSON.stringify({ nome, genero, descricao }),
      });

      if (!res.ok) throw new Error("Erro ao criar artista");

      setNome("");
      setDescricao("");
      setGenero("");
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Adicionar Artista</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Artista</DialogTitle>
          <DialogDescription>
            Preencha os dados do artista e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block mb-1 font-medium">Nome</label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gênero</label>
            <Input
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Descrição</label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              required
            />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
