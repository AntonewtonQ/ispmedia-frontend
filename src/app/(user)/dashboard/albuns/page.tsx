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
import { CardSim, Grid2x2, List, Menu } from "lucide-react";

export default function AlbumPage() {
  const { token } = useAuth();
  const [albuns, setAlbuns] = React.useState<Album[]>([]);
  const [termoPesquisa, setTermoPesquisa] = React.useState("");
  const [albumParaEditar, setAlbumParaEditar] = useState<Album | null>(null);

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
      </div>

      <AlbumTable
        albuns={albunsFiltrados}
        setAlbuns={setAlbuns}
        termoPesquisa={termoPesquisa}
      />

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
