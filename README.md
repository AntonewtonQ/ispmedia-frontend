

# 🎵 Plataforma Multimédia Interativa

Este projeto é uma plataforma completa para gestão e interação com conteúdos multimídia, como músicas, álbuns, playlists, críticas e perfis de usuários. Ele oferece uma interface moderna, intuitiva e responsiva, voltada para descoberta, curadoria e avaliação de obras musicais.

---

## 🚀 Funcionalidades

### ✅ Autenticação e Perfil
- Login com email e senha.
- Armazenamento seguro de token (`localStorage`).
- Perfil do usuário com nome, email, tipo e data de inscrição.
- Logout com limpeza automática da sessão.

### 🎤 Artistas
- Cadastro de artistas com nome e gerenciamento completo (CRUD).
- Listagem e pesquisa dinâmica.

### 💿 Álbuns
- Criação de álbuns com imagem de capa (upload de arquivo).
- Visualização de detalhes com:
  - Título, descrição e data de lançamento.
  - Artista vinculado.
  - Músicas contidas (com player).
  - Críticas dos usuários.

### 🎶 Músicas
- Cadastro de músicas com:
  - Título, duração e compositor.
  - Associação com artista e álbum.
  - Upload de ficheiros de áudio.
- Página de detalhes com player e botão para gerenciar playlists.

### 📝 Críticas
- Criação de críticas em álbuns:
  - Pontuação (1–10) e comentário.
- Edição e remoção permitidas somente ao autor.
- Renderização de críticas com nome do usuário.

### 📁 Uploads
- Upload de arquivos de áudio e imagem com gerenciamento via `uploadId`.
- Player de áudio embutido com base no nome do ficheiro.

### 📚 Playlists
- CRUD completo de playlists:
  - Nome, descrição e visibilidade (`PÚBLICA` ou `PRIVADA`).
- Página de detalhes:
  - Informações da playlist.
  - Listagem de músicas com player e botão de exclusão.
  - Adição de músicas à playlist via modal.

---

## 🧩 Componentes e Modais

- `AddPlaylistModal` – Criação de playlists.
- `EditPlaylistModal` – Edição rápida.
- `AdicionarMusicasNaPlaylistModal` – Escolha múltipla de músicas.
- `GerirPlaylistsDaMusicaModal` – Gerencia playlists da música.
- `AddMusicaModal` – Reutilizável para novos álbuns ou geral.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [Next.js 14](https://nextjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [TailwindCSS](https://tailwindcss.com/)
  - [Shadcn/UI](https://ui.shadcn.com/)
  - [Lucide Icons](https://lucide.dev/)

- **Backend** (conectado):
  - REST API com autenticação JWT.
  - Endpoints para álbuns, artistas, músicas, uploads, playlists e críticas.
  - Prisma ORM + PostgreSQL.

---

## 📂 Estrutura de Pastas

src/
├── app/
│   ├── dashboard/
│   │   ├── albuns/
│   │   ├── artistas/
│   │   ├── musicas/
│   │   ├── playlists/
│   │   ├── perfil/
│   │   └── ...
├── components/
│   ├── playlist/
│   ├── musica/
│   ├── ui/
│   └── ...
├── context/
│   └── AuthContext.tsx
├── models/
├── styles/
└── utils/


## 📌 Instruções de Uso

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Configure variáveis de ambiente

Crie o arquivo `.env.local` com:

```
NEXT_PUBLIC_API_URL=http://localhost:1024/api
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

------

## ✅ Roadmap Futuro

-  Página pública para navegação de álbuns e playlists.
-  Sistema de notificações.
-  Compartilhamento de playlists.
-  Módulo de administração.

------

## 📄 Licença

Este projeto é de código aberto e está licenciado sob os termos da [MIT License](https://chatgpt.com/g/g-p-685c9664080881918b40a833ac9d135e-pro/c/LICENSE).