"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Grupo } from "@/models/Grupo";
import { Button } from "@/components/ui/button";

export default function GrupoPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrupo() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/grupos/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Erro ao carregar grupo");
        const data = await res.json();
        setGrupo(data);
      } catch (err) {
        setErro("Erro ao carregar grupo");
      }
    }

    if (token && id) fetchGrupo();
  }, [token, id]);

  if (erro) return <p className="text-red-500 p-4">{erro}</p>;
  if (!grupo) return <p className="p-4">Carregando grupo...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Grupo: {grupo.nome}</h1>
      <p className="text-gray-700">{grupo.descricao}</p>

      {/* Aqui você pode adicionar um botão para partilhar mídia */}
      <Button onClick={() => alert("Partilhar nova mídia")}>
        + Partilhar Mídia
      </Button>

      {/* E aqui a lista de mídias */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">Mídias Partilhadas</h2>
        <p className="text-gray-500 text-sm">
          (em breve você pode listar as mídias aqui)
        </p>
      </div>
    </div>
  );
}
