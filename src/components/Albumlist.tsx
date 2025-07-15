"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Album } from "@/models/Album";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AlbumList() {
  const [albuns, setAlbuns] = useState<Album[]>([]);

  async function fetchAlbuns() {
    try {
      const response = await fetch("http://localhost:1024/api/albums");
      if (!response.ok) {
        throw new Error("Erro ao buscar álbuns");
      }
      const data = await response.json();
      setAlbuns(data);
    } catch (error) {
      console.error("Erro ao buscar álbuns:", error);
    }
  }

  useEffect(() => {
    fetchAlbuns();
  }, []);

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold text-center mb-10">Álbuns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {albuns.map((album) => (
          <Card
            key={album.id}
            className="bg-white shadow-sm hover:shadow-md transition"
          >
            {album.uploadId && (
              <Image
                src={
                  album.uploadId
                    ? `http://localhost:1024/files/${album.uploadId}`
                    : ""
                }
                alt={album.titulo}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-t-md grayscale"
              />
            )}
            <CardHeader>
              <CardTitle className="text-xl">{album.titulo}</CardTitle>
              <CardDescription className="text-gray-700">
                {album.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Conteúdo adicional, se desejar */}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
