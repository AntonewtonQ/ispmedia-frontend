"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Album } from "@/models/Album";
import { Musica } from "@/models/Musica";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AlbumDetalhesPage() {
  const { token } = useAuth();
  const params = useParams();
  const albumId = Number(params.id);

  const [album, setAlbum] = useState<Album | null>(null);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [comentario, setComentario] = useState("");
  const [pontuacao, setPontuacao] = useState(5);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`http://localhost:1024/api/albums/${albumId}`, {
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar álbum");
        const data = await res.json();
        setAlbum(data);
      } catch {
        setErro("Erro ao carregar detalhes do álbum");
      }
    }

    async function fetchMusicas() {
      try {
        const res = await fetch(
          `http://localhost:1024/api/musicas?albumId=${albumId}`
        );
        const data = await res.json();
        setMusicas(data);
      } catch {
        setErro("Erro ao carregar músicas");
      }
    }

    if (token) {
      fetchAlbum();
      fetchMusicas();
    }
  }, [albumId, token]);

  async function handleCriticaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    try {
      const res = await fetch("http://localhost:1024/api/criticas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          albumId,
          pontuacao,
          comentario,
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar crítica");

      setComentario("");
      setPontuacao(5);
      alert("Crítica enviada com sucesso!");
    } catch {
      setErro("Erro ao enviar crítica");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {erro && <p className="text-red-500">{erro}</p>}
      {album && (
        <Card>
          <CardHeader>
            <CardTitle>{album.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{album.descricao}</p>
            <p className="text-sm text-gray-400">
              Lançado em{" "}
              {new Date(album.dataLancamento).toLocaleDateString("pt-PT")}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Músicas</h2>
        <ul className="list-disc list-inside space-y-1">
          {musicas.map((m) => (
            <li key={m.id}>
              {m.titulo} ({m.duracao}s) — {m.compositor}
            </li>
          ))}
          {musicas.length === 0 && (
            <p className="text-gray-500">Nenhuma música disponível.</p>
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Adicionar Crítica</h2>
        <form onSubmit={handleCriticaSubmit} className="space-y-4 max-w-lg">
          <Input
            type="number"
            min={1}
            max={5}
            value={pontuacao}
            onChange={(e) => setPontuacao(Number(e.target.value))}
            placeholder="Pontuação (1 a 5)"
          />
          <Textarea
            placeholder="Comentário"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <Button type="submit">Enviar crítica</Button>
        </form>
      </div>
    </div>
  );
}
