"use client";

import { useEffect, useState } from "react";
import { Musica } from "@/models/Musica";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Musicalist() {
  const [musicas, setMusicas] = useState<Musica[]>([]);

  async function fetchMusicas() {
    try {
      const response = await fetch("http://localhost:1024/api/musicas");
      if (!response.ok) {
        throw new Error("Erro ao buscar músicas");
      }
      const data = await response.json();
      setMusicas(data);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
    }
  }

  useEffect(() => {
    fetchMusicas();
  }, []);

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold text-center mb-10">Músicas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {musicas.map((musica) => (
          <Card
            key={musica.id}
            className="bg-white shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle className="text-xl">{musica.titulo}</CardTitle>
              <CardDescription className="text-gray-700">
                Duração: {musica.duracao}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800">
                Compositor: {musica.compositor}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
