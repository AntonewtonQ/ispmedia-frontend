"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle } from "lucide-react";

export interface Notificacao {
  id: number;
  conteudo: string;
  dataEnvio: string;
  tipo: "PRIVILEGIO_EDITOR" | "ALTERACAO_DESCRICAO" | "NOVO_UPLOAD";
  estado: "PENDENTE" | "LIDA";
}

export default function NotificacoesPage() {
  const { token } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);

  async function fetchNotificacoes() {
    try {
      const query = new URLSearchParams();
      if (filtroEstado) query.append("estado", filtroEstado);
      if (filtroTipo) query.append("tipo", filtroTipo);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notificacoes?${query.toString()}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar notificações");
      const data = await res.json();
      setNotificacoes(data);
    } catch (err) {
      setErro("Erro ao carregar notificações");
    }
  }

  useEffect(() => {
    if (token) fetchNotificacoes();
  }, [token, filtroEstado, filtroTipo]);

  async function marcarComoLida(id: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notificacoes/${id}/lida`,
        {
          method: "PUT",
          headers: { Authorization: `${token}` },
        }
      );
      if (!res.ok) throw new Error();
      fetchNotificacoes();
    } catch {
      alert("Erro ao marcar como lida");
    }
  }

  async function deletarNotificacao(id: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notificacoes/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `${token}` },
        }
      );
      if (!res.ok) throw new Error();
      fetchNotificacoes();
    } catch {
      alert("Erro ao deletar notificação");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="LIDA">Lidas</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos os Tipos</option>
            <option value="PRIVILEGIO_EDITOR">Privilégio de Editor</option>
            <option value="ALTERACAO_DESCRICAO">Alteração de Descrição</option>
            <option value="NOVO_UPLOAD">Novo Upload</option>
          </select>
        </div>
      </div>

      {erro && <p className="text-red-500">{erro}</p>}

      <div className="space-y-4">
        {notificacoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma notificação encontrada.</p>
        ) : (
          notificacoes.map((n) => (
            <Card key={n.id} className="bg-gray-50 border">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-base font-medium text-gray-800">
                    {n.tipo.replace("_", " ")}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{n.conteudo}</p>
                </div>
                <div className="flex gap-2">
                  {n.estado === "PENDENTE" && (
                    <Button size="sm" onClick={() => marcarComoLida(n.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Marcar como lida
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletarNotificacao(n.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-gray-400">
                {new Date(n.dataEnvio).toLocaleString("pt-PT")}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
