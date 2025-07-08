// components/Navbar.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg">ISPMedia</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/funcionalidades">Funcionalidades</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => console.log("abrir login")}
            >
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              className="cursor-pointer"
              onClick={() => console.log("abrir registo")}
            >
              Registar-se
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
