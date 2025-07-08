// app/artistas/[id]/page.tsx
import { notFound } from "next/navigation";

type Params = { params: { id: string } };

export default async function ArtistaDetalhePage({ params }: Params) {
  const res = await fetch(`http://localhost:1024/api/artistas/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();

  const artista = await res.json();

  const albunsRes = await fetch(
    `http://localhost:1024/api/artistas/${params.id}/albuns`
  );
  const musicasRes = await fetch(
    `http://localhost:1024/api/artistas/${params.id}/musicas`
  );
  const albuns = albunsRes.ok ? await albunsRes.json() : [];
  const musicas = musicasRes.ok ? await musicasRes.json() : [];

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-5xl font-extrabold text-center mb-6">
        {artista.nome}
      </h1>

      {artista.imagemUrl && (
        <div className="w-full max-h-[450px] overflow-hidden rounded-2xl shadow-lg mb-8">
          <img
            src={artista.imagemUrl}
            alt={artista.nome}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500 ease-in-out"
          />
        </div>
      )}

      <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
        {artista.biografia}
      </p>

      {/* Álbuns */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2 border-gray-200">
          Álbuns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albuns.map((album: any) => (
            <div
              key={album.id}
              className="bg-white shadow hover:shadow-lg rounded-xl p-4 border border-gray-100 transition duration-300"
            >
              <h3 className="text-xl font-bold">{album.titulo}</h3>
              <p className="text-sm text-gray-600 mt-2">{album.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Músicas */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2 border-gray-200">
          Músicas
        </h2>
        <ul className="space-y-4">
          {musicas.map((musica: any) => (
            <li
              key={musica.id}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="text-lg font-medium">{musica.titulo}</span>
                <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                  {musica.compositor} • {musica.duracao}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
