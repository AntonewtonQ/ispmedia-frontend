"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">Usuário não autenticado.</p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nome:</p>
            <p className="text-lg font-medium">{user.nome}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tipo de usuário:</p>
            <p className="text-lg font-medium">{user.tipo}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Data de inscrição:</p>
            <p className="text-lg font-medium">
              {new Date(user.dataInscricao).toLocaleDateString("pt-PT")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
