"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MusicaTable from "@/components/musicas/musicatable";
import { AddMusicaModal } from "@/components/musicas/addmusicamodal";

const MusicaPage = () => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Músicas</h1>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Pesquisar música..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full md:w-64"
          />
          <AddMusicaModal onSuccess={() => setRefreshKey((k) => k + 1)} />
        </div>
      </div>

      <MusicaTable termoPesquisa={termoPesquisa} key={refreshKey} />
    </div>
  );
};

export default MusicaPage;
