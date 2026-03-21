# 🐾 PetSOS — Frontend

Aplicativo mobile do **PetSOS**, uma plataforma colaborativa de denúncias de maus-tratos contra animais. Construído com **React Native + Expo**, organizado em monorepo junto ao backend Node.js + Express.

---

## 🗂️ Estrutura do Projeto

```
frontend/
├── app/
│   ├── (tabs)/
│   └── _layout.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
├── constants/
├── hooks/
├── scripts/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 📁 Descrição das Pastas

### `app/`
Coração da navegação do aplicativo. O Expo Router usa **file-based routing**, ou seja, cada arquivo dentro de `app/` vira automaticamente uma rota — sem precisar configurar navegação manualmente.

```
app/
├── (tabs)/                  # Grupo de rotas com navegação por abas
│   ├── _layout.tsx          # Define as abas e seus ícones
│   ├── index.tsx            # Tela inicial (ex: mapa de denúncias)
│   └── profile.tsx          # Tela de perfil do usuário
├── complaint/
│   ├── create.tsx           # Tela de criação de denúncia
│   ├── [id].tsx             # Tela de detalhes de uma denúncia
│   └── edit/[id].tsx        # Tela de edição de denúncia
└── _layout.tsx              # Layout raiz do app (navegação global)
```

> 📌 O `(tabs)` entre parênteses é uma convenção do Expo Router para agrupar rotas sem afetar a URL — as rotas dentro dele compartilham a barra de navegação inferior.

**Convenções de nomeação do Expo Router:**

| Convenção | Exemplo | Significado |
|---|---|---|
| `(nome)/` | `(tabs)/` | Grupo sem afetar a URL — usado para organizar rotas e compartilhar layouts |
| `[param].tsx` | `[id].tsx` | Rota dinâmica — o valor é acessado via `useLocalSearchParams()` |
| `_layout.tsx` | `_layout.tsx` | Define o layout compartilhado entre as rotas do mesmo nível |
| `+not-found.tsx` | `+not-found.tsx` | Tela exibida quando a rota acessada não existe (404) |

---

### `assets/`
Arquivos estáticos do aplicativo como imagens e fontes.

```
assets/
├── fonts/       # Fontes customizadas do app
└── images/      # Ícones, logo do PetSOS e imagens estáticas
```

> Nenhum arquivo de lógica deve existir aqui — apenas recursos visuais estáticos.

---

### `components/`
Componentes React Native reutilizáveis em várias telas do app. Cada componente deve ser independente e não conter regras de negócio.

```
components/
├── ComplaintCard.tsx        # Card de denúncia exibido na listagem
├── MapMarker.tsx            # Marcador customizado no mapa
├── PhotoPicker.tsx          # Seletor de fotos da galeria/câmera
└── ui/                      # Componentes genéricos de interface
    ├── Button.tsx
    ├── Input.tsx
    └── Modal.tsx
```

> 📌 Componentes específicos de uma única tela devem ficar na própria pasta da tela dentro de `app/`, não aqui.

---

### `constants/`
Valores fixos reutilizados em toda a aplicação, evitando strings e números mágicos espalhados pelo código.

```
constants/
├── Colors.ts        # Paleta de cores do PetSOS
├── Layout.ts        # Tamanhos, espaçamentos e breakpoints
└── Api.ts           # URLs base e endpoints da API do backend
```

**Exemplo:**
```ts
// constants/Api.ts
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const ENDPOINTS = {
  complaints: '/api/complaints',
  users: '/api/users',
};
```

---

### `hooks/`
Hooks customizados que encapsulam lógicas reutilizáveis entre componentes e telas.

```
hooks/
├── useComplaints.ts     # Busca, criação e manipulação de denúncias
├── useLocation.ts       # Captura de geolocalização do dispositivo
└── usePhotoUpload.ts    # Seleção e envio de fotos
```

**Exemplo:**
```ts
// Uso em qualquer tela
const { location, requestPermission } = useLocation();
const { complaints, createComplaint } = useComplaints();
```

> ✅ Regras de negócio e chamadas à API devem ficar nos hooks, mantendo as telas limpas e focadas apenas na UI.

---

### `scripts/`
Scripts utilitários usados durante o desenvolvimento. Não fazem parte do app em si.

```
scripts/
└── reset-project.js    # Limpa o projeto e recria a pasta app/ do zero (gerado pelo Expo)
```

> ⚠️ Esses scripts são executados via terminal e não são importados pelo app.

---

## 🚀 Como rodar localmente

```bash
# Na raiz do monorepo
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar o app
npx expo start
```

No terminal aparecerão as opções para abrir o app:

- **Expo Go** — escaneie o QR code no celular (mais rápido para testar)
- **Android Emulator** — requer Android Studio configurado
- **iOS Simulator** — requer Xcode (apenas macOS)

---

## 🔑 Variáveis de Ambiente (`.env.example`)

```env
# URL do backend
EXPO_PUBLIC_API_URL=http://localhost:3000
```

> 📌 No Expo, variáveis de ambiente expostas ao app **precisam** do prefixo `EXPO_PUBLIC_` para serem acessíveis no código.

---

## 📦 Dependências principais

| Pacote | Uso |
|---|---|
| `expo` | Framework base do app |
| `expo-router` | Navegação file-based |
| `react-native-maps` | Mapa interativo de denúncias |
| `expo-location` | Captura de geolocalização |
| `expo-image-picker` | Seleção de fotos da galeria/câmera |

---

## 🗺️ Roadmap por Sprint

| Sprint | Telas e funcionalidades | Status |
|---|---|---|
| Sprint 1 | Formulário de denúncia, upload de fotos, geolocalização, mapa | 🔲 Backlog |
| Sprint 2 | Filtros no mapa, detalhes da denúncia, colaboração | 🔲 Backlog |
| Sprint 3 | Histórico de atualizações, status da denúncia | 🔲 Backlog |
| Sprint 4 | Login, cadastro, logout, recuperação de senha | 🔲 Backlog |