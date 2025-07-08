"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";

export const UserNavbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-black hover:underline"
        >
          ISPmedia.ao
        </Link>
        <ul className="hidden md:flex gap-4 text-sm text-gray-700">
          <li>
            <Link href="/dashboard/artistas" className="hover:underline">
              Artistas
            </Link>
          </li>
          <li>
            <Link href="/dashboard/musicas" className="hover:underline">
              Músicas
            </Link>
          </li>
          <li>
            <Link href="/dashboard/grupos" className="hover:underline">
              Grupos
            </Link>
          </li>
          <li>
            <Link href="/dashboard/albuns" className="hover:underline">
              Álbuns
            </Link>
          </li>
          <li>
            <Link href="/dashboard/playlists" className="hover:underline">
              Playlists
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/notificacoes")}
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/perfil")}
        >
          <User className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};
