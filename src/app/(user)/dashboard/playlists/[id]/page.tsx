"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Playlist } from "@/models/Playlist";
import { Musica } from "@/models/Musica";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdicionarMusicasNaPlaylistModal } from "@/components/playlist/addmusicanaplaylist";
import { Trash2 } from "lucide-react";

interface Upload {
  id: number;
  nomeArquivo: string;
}

interface PlaylistMusica {
  id: number;
  musicaId: number;
  playlistId: number;
}

export default function PlaylistDetalhesPage() {
  const { token } = useAuth();
  const params = useParams();
  const playlistId = Number(params.id);

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<number, Upload>>({});
  const [musicasDetalhadas, setMusicasDetalhadas] = useState<
    Record<number, Musica>
  >({});
  const [openAdicionarModal, setOpenAdicionarModal] = useState(false);
  const [removendoMusicaId, setRemovendoMusicaId] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch(
          `http://localhost:1024/api/playlists/${playlistId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar playlist");
        const data = await res.json();
        setPlaylist(data);

        const uploadsMap: Record<number, Upload> = {};
        const detalhesMap: Record<number, Musica> = {};

        await Promise.all(
          data.musicas.map(async (m: PlaylistMusica) => {
            const musicaRes = await fetch(
              `http://localhost:1024/api/musicas/${m.musicaId}`,
              {
                headers: { Authorization: `${token}` },
              }
            );
            if (musicaRes.ok) {
              const musica = await musicaRes.json();
              detalhesMap[m.musicaId] = musica;

              if (musica.uploadId) {
                const uploadRes = await fetch(
                  `http://localhost:1024/api/uploads/${musica.uploadId}`,
                  {
                    headers: { Authorization: `${token}` },
                  }
                );
                if (uploadRes.ok) {
                  const file = await uploadRes.json();
                  uploadsMap[musica.uploadId] = file;
                }
              }
            }
          })
        );

        setMusicasDetalhadas(detalhesMap);
        setUploads(uploadsMap);
      } catch {
        setErro("Erro ao carregar detalhes da playlist");
      }
    }

    if (token) fetchPlaylist();
  }, [playlistId, token]);

  async function handleRemoverMusica(musicaId: number) {
    const confirmar = confirm(
      "Deseja realmente remover esta música da playlist?"
    );
    if (!confirmar) return;
    setRemovendoMusicaId(musicaId);

    try {
      const res = await fetch(
        `http://localhost:1024/api/playlists/${playlistId}/musicas/${musicaId}`,
        {
          method: "DELETE",
          headers: { Authorization: `${token}` },
        }
      );

      if (!res.ok) throw new Error("Erro ao remover música da playlist");

      const reloadRes = await fetch(
        `http://localhost:1024/api/playlists/${playlistId}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      if (reloadRes.ok) {
        const reloadData = await reloadRes.json();
        setPlaylist(reloadData);
        // Recarregar detalhes
        setMusicasDetalhadas({});
        setUploads({});
      }
    } catch {
      alert("Erro ao remover música da playlist");
    } finally {
      setRemovendoMusicaId(null);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {erro && <p className="text-red-500">{erro}</p>}

      {playlist && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{playlist.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-700">
                {playlist.descricao || "Sem descrição"}
              </p>
              <p className="text-sm text-gray-500">
                Visibilidade:{" "}
                <span className="font-medium">{playlist.visibilidade}</span>
              </p>
              <p className="text-sm text-gray-500">
                Criada por:{" "}
                <strong>
                  {playlist.usuario?.nome || `Usuário #${playlist.usuarioId}`}
                </strong>
              </p>
              <p className="text-sm text-gray-500">
                Total de músicas: <strong>{playlist.musicas.length}</strong>
              </p>
            </CardContent>
          </Card>

          <Button className="mt-4" onClick={() => setOpenAdicionarModal(true)}>
            + Adicionar Músicas
          </Button>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Músicas na Playlist</h2>
            {playlist.musicas.length > 0 ? (
              <ul className="space-y-3">
                {playlist.musicas.map((ref) => {
                  const m = musicasDetalhadas[ref.musicaId!];
                  return (
                    <li
                      key={ref.musicaId}
                      className="border rounded-md p-4 bg-gray-50 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <strong>{m?.titulo || "(sem título)"}</strong> —{" "}
                              {m?.compositor || "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {m?.duracao || 0}s
                              </span>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleRemoverMusica(ref.musicaId!)
                                }
                                disabled={removendoMusicaId === ref.musicaId}
                              >
                                {removendoMusicaId === ref.musicaId ? (
                                  "Removendo..."
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          {m?.uploadId && uploads[m.uploadId] ? (
                            <audio
                              controls
                              src={`http://localhost:1024/files/${
                                uploads[m.uploadId].nomeArquivo
                              }`}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-sm text-gray-400">
                              Sem ficheiro de áudio
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma música nesta playlist.</p>
            )}
          </div>

          <AdicionarMusicasNaPlaylistModal
            open={openAdicionarModal}
            playlistId={playlist.id}
            onClose={() => setOpenAdicionarModal(false)}
            onSuccess={() => window.location.reload()}
          />
        </>
      )}
    </div>
  );
}
