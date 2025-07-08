"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Artista } from "@/models/Artista";

const DashboardPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [artists, setArtistas] = useState<Artista[]>([]);

  useEffect(() => {
    if (token === null) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 500); // espera um pouco para dar tempo ao useEffect do AuthContext
      return () => clearTimeout(timeout);
    }
  }, [token]);

  useEffect(() => {
    async function fetchArtistas() {
      try {
        const response = await fetch("http://localhost:1024/api/artistas");
        if (!response.ok) throw new Error("Erro ao buscar artistas");
        const data = await response.json();
        setArtistas(data);
      } catch (error) {
        console.error("Erro ao buscar artistas:", error);
      }
    }
    fetchArtistas();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((artist) => (
            <Card key={artist.id} className="shadow">
              <CardHeader>
                <CardTitle>{artist.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>ID: {artist.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
