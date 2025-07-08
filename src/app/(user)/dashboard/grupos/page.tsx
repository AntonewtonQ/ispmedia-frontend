"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddGrupoModal } from "@/components/grupos/addgroupmodal";
import GrupoTable from "@/components/grupos/grupotable";

const GrupoPage = () => {
  const [termo, setTermo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            placeholder="Pesquisar grupo..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <AddGrupoModal onSuccess={() => setRefreshKey((k) => k + 1)} />
        </div>
      </div>
      <GrupoTable termoPesquisa={termo} key={refreshKey} />
    </div>
  );
};

export default GrupoPage;
