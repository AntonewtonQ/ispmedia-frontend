"use client";

import React, { useState } from "react";
import Artistatable from "@/components/artistas/artistatable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { AddArtistaModal } from "@/components/artistas/addartistamodal";

const ArtistaPage = () => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Artistas</h1>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Pesquisar artista..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full md:w-64"
          />
          <AddArtistaModal />
        </div>
      </div>

      <Artistatable termoPesquisa={termoPesquisa} />
    </div>
  );
};

export default ArtistaPage;
