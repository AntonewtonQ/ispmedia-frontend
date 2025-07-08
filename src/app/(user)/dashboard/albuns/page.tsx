"use client";

import React, { useState } from "react";
import AlbumTable from "@/components/albuns/albumtable";
import { AddAlbumModal } from "@/components/albuns/addalbummodal";
import { Album } from "@/models/Album";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlbumCard } from "@/components/albuns/cardalbum";
import { useAuth } from "@/context/AuthContext";
import { EditAlbumModal } from "@/components/albuns/editalbummodal";

export default function AlbumPage() {
  const { token } = useAuth();
  const [albuns, setAlbuns] = React.useState<Album[]>([]);
  const [termoPesquisa, setTermoPesquisa] = React.useState("");
  const [albumParaEditar, setAlbumParaEditar] = useState<Album | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = React.useState<
    "tabela" | "cards"
  >("tabela");

  const albunsFiltrados = albuns.filter((a) =>
    a.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Álbuns</h1>
        <AddAlbumModal
          onSuccess={(novoAlbum) => setAlbuns((prev) => [...prev, novoAlbum])}
        />
      </div>

      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="Pesquisar por título"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          className="w-64"
        />

        <ToggleGroup
          type="single"
          value={modoVisualizacao}
          onValueChange={(value) => {
            if (value) setModoVisualizacao(value as "tabela" | "cards");
          }}
        >
          <ToggleGroupItem value="tabela">Tabela</ToggleGroupItem>
          <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {modoVisualizacao === "tabela" ? (
        <AlbumTable
          albuns={albunsFiltrados}
          setAlbuns={setAlbuns}
          termoPesquisa={termoPesquisa}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albunsFiltrados.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onEdit={(albumEditado) => setAlbumParaEditar(albumEditado)}
              onDelete={async () => {
                const confirmar = confirm(
                  "Deseja realmente apagar este álbum?"
                );
                if (!confirmar) return;

                try {
                  const res = await fetch(
                    `http://localhost:1024/api/albums/${album.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `${token}`,
                      },
                    }
                  );

                  if (!res.ok) throw new Error("Erro ao deletar álbum");

                  setAlbuns((prev) => prev.filter((a) => a.id !== album.id));
                } catch {
                  alert("Erro ao deletar álbum");
                }
              }}
            />
          ))}
        </div>
      )}
      {albumParaEditar && (
        <EditAlbumModal
          album={albumParaEditar}
          token={token}
          onClose={() => setAlbumParaEditar(null)}
          onSuccess={(albumAtualizado) => {
            setAlbumParaEditar(null);
            setAlbuns((prev) =>
              prev.map((a) =>
                a.id === albumAtualizado.id ? albumAtualizado : a
              )
            );
          }}
        />
      )}
    </div>
  );
}
