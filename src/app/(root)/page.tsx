// app/page.tsx ou pages/index.tsx
import AlbumList from "@/components/Albumlist";
import ArtistaList from "@/components/Artistalist";
import Musicalist from "@/components/Musicalist";

export default async function Home() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-between px-4 py-12 font-sans">
      <section className="w-full max-w-5xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          Bem-vindo à{" "}
          <span className="underline decoration-black">ISPmedia.ao</span>
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          A plataforma de música angolana que conecta artistas e fãs.
        </p>

        <div className="space-y-16">
          <ArtistaList />
          <AlbumList />
          <Musicalist />
        </div>
      </section>

      <footer className="mt-20 w-full text-center text-sm text-gray-500 border-t pt-6">
        © {new Date().getFullYear()} <strong>ISPmedia.ao</strong>. Todos os
        direitos reservados.
      </footer>
    </main>
  );
}
