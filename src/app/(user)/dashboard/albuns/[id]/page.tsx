"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Album } from "@/models/Album";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { AddMusicaModal } from "@/components/musicas/addmusicamodal";

interface Upload {
  id: number;
  nomeArquivo: string;
}

interface MusicaWithUpload {
  id: number;
  titulo: string;
  duracao: string;
  compositor: string;
  uploadId: number | null;
}

export default function AlbumDetalhesPage() {
  const { token, user } = useAuth();
  const params = useParams();
  const albumId = Number(params.id);

  const [album, setAlbum] = useState<Album | null>(null);
  const [upload, setUpload] = useState<Upload | null>(null);
  const [comentario, setComentario] = useState("");
  const [pontuacao, setPontuacao] = useState(5);
  const [erro, setErro] = useState<string | null>(null);
  const [novaPontuacao, setNovaPontuacao] = useState<number>(5);
  const [novoComentario, setNovoComentario] = useState<string>("");

  const [uploadsMusicas, setUploadsMusicas] = useState<Record<number, Upload>>(
    {}
  );
  const [editando, setEditando] = useState(false);



  async function handleRemoverCritica(criticaId: number) {
    const confirmar = confirm("Tem certeza que deseja eliminar esta crítica?");
    if (!confirmar) return;

    try {
      const res = await fetch(
        `http://localhost:1024/api/criticas/${criticaId}`,
        {
          method: "DELETE",
          headers: { Authorization: `${token}` },
        }
      );

      if (!res.ok) throw new Error("Erro ao remover crítica");

      const atualizada = await fetch(
        `http://localhost:1024/api/albums/${albumId}`,
        {
          headers: { Authorization: `${token}` },
        }
      ).then((res) => res.json());

      setAlbum(atualizada);
    } catch {
      alert("Erro ao remover crítica");
    }
  }

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`http://localhost:1024/api/albums/${albumId}`, {
          headers: { Authorization: `${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar álbum");
        const data = await res.json();
        setAlbum(data);

        // Upload da imagem do álbum
        if (data.uploadId) {
          const uploadRes = await fetch(
            `http://localhost:1024/api/uploads/${data.uploadId}`,
            {
              headers: { Authorization: `${token}` },
            }
          );
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            setUpload(uploadData);
          }
        }

        // Uploads das músicas
        const musicasComUpload = data.musicas.filter(
          (m: MusicaWithUpload) => m.uploadId !== null
        );
        const uploadResults = await Promise.all(
          musicasComUpload.map((m: MusicaWithUpload) =>
            fetch(`http://localhost:1024/api/uploads/${m.uploadId}`, {
              headers: { Authorization: `${token}` },
            })
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          )
        );

        const uploadsMap: Record<number, Upload> = {};
        musicasComUpload.forEach((m: MusicaWithUpload, idx: number) => {
          if (uploadResults[idx] && m.uploadId) {
            uploadsMap[m.uploadId] = uploadResults[idx];
          }
        });

        setUploadsMusicas(uploadsMap);
      } catch {
        setErro("Erro ao carregar detalhes do álbum");
      }
    }

    if (token) fetchAlbum();
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
    <div className="p-6 space-y-8">
      {erro && <p className="text-red-500">{erro}</p>}

      {album && (
        <>
          {/* TOPO - Dados principais do álbum */}
          <Card className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="w-full md:w-64 h-64 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
              {upload?.nomeArquivo ? (
                <Image
                  src={`http://localhost:1024/files/${upload.nomeArquivo}`}
                  alt={album.titulo}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Sem imagem</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl">{album.titulo}</CardTitle>
              <p className="text-gray-700">{album.descricao}</p>
              <p className="text-sm text-gray-500">
                Lançado em{" "}
                {new Date(album.dataLancamento).toLocaleDateString("pt-PT")}
              </p>
              <p className="text-sm text-gray-500">
                Artista: <strong>{album.artista?.nome}</strong>
              </p>
            </div>
          </Card>

          {/* DUAS COLUNAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* COLUNA 1 — MÚSICAS */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xl font-semibold mb-3 ">Músicas</h2>
              <AddMusicaModal
                albumId={album.id}
                onSuccess={() => {
                  fetch(`http://localhost:1024/api/albums/${album.id}`, {
                    headers: { Authorization: `${token}` },
                  })
                    .then((res) => res.json())
                    .then((data) => setAlbum(data));
                }}
              />
              {album.musicas && album.musicas.length > 0 ? (
                <ul className="space-y-2">
                  {album.musicas.map((m) => (
                    <li
                      key={m.id}
                      className="border rounded p-3 bg-gray-50 space-y-1"
                    >
                      <div className="flex justify-between">
                        <span>
                          <strong>{m.titulo}</strong> — {m.compositor}
                        </span>
                        <span className="text-sm text-gray-500">
                          {m.duracao}s
                        </span>
                      </div>
                      {m.uploadId && uploadsMusicas[m.uploadId]?.nomeArquivo ? (
                        <audio
                          controls
                          src={`http://localhost:1024/files/${
                            uploadsMusicas[m.uploadId].nomeArquivo
                          }`}
                          className="w-full mt-1"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          Sem ficheiro de áudio
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma música disponível.</p>
              )}
            </div>

            {/* COLUNA 2 — CRÍTICAS */}
            <div className="">
              <h2 className="text-xl font-semibold mb-3">Críticas</h2>

              {album.criticas && album.criticas.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {album.criticas.map((critica) => {
                    const isAuthor = critica.usuarioId === user?.id;

                    async function handleAtualizarCritica() {
                      try {
                        const res = await fetch(
                          `http://localhost:1024/api/criticas/${critica.id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `${token}`,
                            },
                            body: JSON.stringify({
                              comentario: novoComentario,
                              pontuacao: novaPontuacao,
                            }),
                          }
                        );

                        if (!res.ok)
                          throw new Error("Erro ao atualizar crítica");

                        setEditando(false);
                        // Atualiza a lista completa
                        const atualizada = await fetch(
                          `http://localhost:1024/api/albums/${albumId}`,
                          {
                            headers: { Authorization: `${token}` },
                          }
                        ).then((res) => res.json());

                        setAlbum(atualizada);
                      } catch {
                        alert("Erro ao atualizar crítica");
                      }
                    }

                    async function handleRemoverCritica() {
                      const confirmar = confirm(
                        "Tem certeza que deseja eliminar esta crítica?"
                      );
                      if (!confirmar) return;

                      try {
                        const res = await fetch(
                          `http://localhost:1024/api/criticas/${critica.id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: `${token}`,
                            },
                          }
                        );

                        if (!res.ok) throw new Error("Erro ao remover crítica");

                        const atualizada = await fetch(
                          `http://localhost:1024/api/albums/${albumId}`,
                          {
                            headers: { Authorization: `${token}` },
                          }
                        ).then((res) => res.json());

                        setAlbum(atualizada);
                      } catch {
                        alert("Erro ao remover crítica");
                      }
                    }

                    return (
                      <li
                        key={critica.id}
                        className="border rounded-md p-3 bg-gray-50 space-y-1"
                      >
                        {editando ? (
                          <>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={novaPontuacao}
                              onChange={(e) =>
                                setNovaPontuacao(Number(e.target.value))
                              }
                            />
                            <Textarea
                              value={novoComentario}
                              onChange={(e) =>
                                setNovoComentario(e.target.value)
                              }
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={handleAtualizarCritica}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditando(false)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium">
                              <strong>Pontuação:</strong> {critica.pontuacao}/10
                            </p>
                            <p className="text-sm italic text-gray-600">
                              {critica.comentario}
                            </p>
                            <p className="text-xs text-gray-400">
                              por usuário #{critica.usuarioId}
                            </p>
                            {isAuthor && (
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => setEditando(true)}
                                >
                                  <Pencil />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={handleRemoverCritica}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 mb-4">
                  Nenhuma crítica enviada ainda.
                </p>
              )}

              <form
                onSubmit={handleCriticaSubmit}
                className="space-y-3 bg-white border rounded-md p-4"
              >
                <h3 className="font-semibold text-sm text-gray-600">
                  Adicionar Crítica
                </h3>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={pontuacao}
                  onChange={(e) => setPontuacao(Number(e.target.value))}
                  placeholder="Pontuação (1 a 10)"
                  required
                />
                <Textarea
                  placeholder="Comentário"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Enviar crítica
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
