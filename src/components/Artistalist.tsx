"use client";

import { useEffect, useState } from "react";
import { Artista } from "@/models/Artista";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ArtistaList() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchArtistas() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/artistas`
        );
        if (!response.ok) throw new Error("Erro ao buscar artistas");
        const data = await response.json();
        setArtistas(data);
      } catch (error) {
        console.error("Erro ao buscar artistas:", error);
      }
    }

    fetchArtistas();
  }, []);

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold text-center mb-10">
        Artistas em Destaque
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {artistas.map((artista) => (
          <Card
            key={artista.id}
            onClick={() => router.push(`/artistas/${artista.id}`)}
            className="bg-white shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-xl">{artista.nome}</CardTitle>
              {artista.descricao && (
                <CardDescription className="text-gray-700 line-clamp-3">
                  {artista.descricao}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800">
                Gênero: {artista.genero || "Não especificado"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
