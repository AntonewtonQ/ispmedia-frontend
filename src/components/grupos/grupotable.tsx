"use client";

import React, { useEffect, useState } from "react";
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
import { Grupo } from "@/models/Grupo";
import { Trash2 } from "lucide-react";
import { GerirMembrosModal } from "./gerirmembrosmodal";
import { EditGrupoModal } from "./editgroupmodal";
import { GerirEditoresModal } from "./gerireditoresmodal";
import { useRouter } from "next/navigation";

interface Props {
  termoPesquisa: string;
}

const GrupoTable = ({ termoPesquisa }: Props) => {
  const router = useRouter();
  const { token } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [meuId, setMeuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [grupoParaGerir, setGrupoParaGerir] = useState<Grupo | null>(null);
  const [grupoParaEditar, setGrupoParaEditar] = useState<Grupo | null>(null);
  const [grupoParaEditor, setGrupoParaEditor] = useState<Grupo | null>(null);

  useEffect(() => {
    async function fetchGrupos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grupos`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar grupos");
        const data = await res.json();
        setGrupos(data);
      } catch (error) {
        setErro("Erro ao carregar grupos");
      } finally {
        setLoading(false);
      }
    }

    async function fetchMe() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao obter usuário logado");
        const user = await res.json();
        setMeuId(user.user.id);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar usuário logado");
      }
    }

    if (token) {
      fetchGrupos();
      fetchMe();
    }
  }, [token]);

  const gruposFiltrados = grupos.filter((g) =>
    g.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  function determinarStatus(
    grupo: Grupo
  ): "OWNER" | "EDITOR" | "MEMBRO" | "PENDENTE" {
    if (meuId === null) return "PENDENTE";
    if (grupo.ownerId === meuId) return "OWNER";
    if (grupo.editores.some((e) => e.usuarioId === meuId)) return "EDITOR";
    const membro = grupo.membros.find((m) => m.usuarioId === meuId);
    if (membro?.status === "ACEITO") return "MEMBRO";
    if (membro?.status === "PENDENTE") return "PENDENTE";
    return "PENDENTE";
  }

  async function aceitarConvite(grupoId: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grupos/${grupoId}/aceitar`,
        {
          method: "POST",
          headers: { Authorization: `${token}` },
        }
      );
      if (!res.ok) throw new Error("Erro ao aceitar convite");

      // Recarrega os grupos
      const novaLista = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grupos`,
        {
          headers: { Authorization: `${token}` },
        }
      ).then((res) => res.json());
      setGrupos(novaLista);
    } catch (err) {
      alert("Erro ao aceitar convite");
    }
  }

  async function handleDeletarGrupo(grupoId: number) {
    const confirmar = confirm("Tem certeza que deseja eliminar este grupo?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grupos/${grupoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao eliminar grupo");

      setGrupos((prev) => prev.filter((g) => g.id !== grupoId));
    } catch (error) {
      alert("Erro ao eliminar grupo");
    }
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      {erro && <p className="text-red-500 p-4">{erro}</p>}
      {loading || meuId === null ? (
        <p className="p-4">Carregando grupos...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gruposFiltrados.map((grupo) => {
              const status = determinarStatus(grupo);
              return (
                <TableRow key={grupo.id}>
                  <TableCell className="font-semibold">
                    <Button
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/grupos/${grupo.id}`)
                      }
                    >
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell>{grupo.nome}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-gray-700">
                    {grupo.descricao}
                  </TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell className="space-x-2">
                    {status === "OWNER" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setGrupoParaGerir(grupo)}
                        >
                          Gerir membros
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setGrupoParaEditor(grupo)}
                        >
                          Editores
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setGrupoParaEditar(grupo)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletarGrupo(grupo.id)}
                        >
                          <Trash2 />
                        </Button>
                      </>
                    )}
                    {(status === "EDITOR" || status === "MEMBRO") && (
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/grupos/${grupo.id}`)
                        }
                      >
                        Ver grupo
                      </Button>
                    )}
                    {status === "PENDENTE" && (
                      <Button
                        size="sm"
                        onClick={() => aceitarConvite(grupo.id)}
                      >
                        Aceitar convite
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {grupoParaGerir && (
        <GerirMembrosModal
          grupoId={grupoParaGerir.id}
          open={!!grupoParaGerir}
          onClose={() => setGrupoParaGerir(null)}
        />
      )}
      {grupoParaEditar && (
        <EditGrupoModal
          grupo={grupoParaEditar}
          token={token}
          onClose={() => setGrupoParaEditar(null)}
          onSuccess={() => {
            setGrupoParaEditar(null);
            setGrupos((prev) =>
              prev.map((g) =>
                g.id === grupoParaEditar.id
                  ? {
                      ...g,
                      nome: grupoParaEditar.nome,
                      descricao: grupoParaEditar.descricao,
                    }
                  : g
              )
            );
          }}
        />
      )}
      {grupoParaEditor && (
        <GerirEditoresModal
          grupoId={grupoParaEditor.id}
          open={!!grupoParaEditor}
          onClose={() => setGrupoParaEditor(null)}
        />
      )}
    </div>
  );
};

export default GrupoTable;
