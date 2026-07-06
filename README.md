# PetSOS — Frontend Mobile

Aplicativo mobile do **PetSOS**, uma plataforma colaborativa para registrar, visualizar, acompanhar e moderar denúncias relacionadas a animais. O app é construído com **Expo Router + React Native** e consome a API do repositório `petsos-api`.

## O que o app faz

- Exibe denúncias em mapa com marcadores personalizados.
- Permite criar denúncias com fotos, localização, tipo de animal e tipo de ocorrência.
- Mostra lista e detalhe público de denúncias para usuários logados e convidados.
- Permite acompanhar denúncias, comentar, responder comentários e reportar conteúdo.
- Suporta voluntariado, evidências e validação de resolução.
- Possui login, cadastro, verificação de email, recuperação de senha e lembrar identificador.
- Possui perfil público/privado, edição de perfil, foto, descrição e localização.
- Exibe notificações, contador de não lidas e limpeza de notificações.
- Inclui fluxo administrativo para moderação de denúncias e comentários.

## Stack principal

| Tecnologia | Uso |
| --- | --- |
| Expo SDK 54 | Base do app mobile |
| Expo Router 6 | Navegação por arquivos |
| React 19 / React Native 0.81 | UI e runtime mobile |
| Firebase JS SDK | Autenticação no app |
| react-native-maps | Mapa, marcadores e rotas |
| expo-location | Localização do dispositivo |
| expo-image / expo-image-picker | Cache de imagem e seleção de fotos |
| expo-secure-store | Armazenamento seguro local |
| expo-haptics | Feedback tátil |
| Reanimated / Gesture Handler | Animações e interações |
| Zod / zxcvbn | Validação e força de senha |

## Estrutura do projeto

```txt
petsos/
  app/                 Rotas e telas Expo Router
  components/          Componentes reutilizáveis por domínio
  hooks/               Estado, cache e efeitos de tela
  services/            Cliente HTTP e serviços da API
  context/             Auth, notificações e estado global
  styles/              StyleSheets separados por tela/componente
  constants/           Opções, enums e tokens locais
  utils/               Helpers compartilhados
  assets/images/       Backgrounds, ícones e imagens
  docs/                Dashboard e documentação estática
```

## Fluxos principais

### Autenticação

- Login por email/username e senha.
- Cadastro com validação de username e criação de perfil no backend.
- Verificação de email via Firebase Auth.
- Recuperação de senha via email.
- Lembrar-me salva o último email ou username digitado.

### Denúncias

- Criação de denúncia com opção anônima.
- Upload de fotos e preview antes do envio.
- Localização automática ou seleção manual no mapa.
- Detalhe público acessível por convidados.
- Acompanhamento, voluntariado, comentários, respostas e evidências.

### Mapa

- Marcadores customizados.
- Popup com ações de ver detalhe e traçar rota.
- Rota desenhada dentro do mapa do app.
- Cache de tiles, batch loading e invalidação em tempo real.
- Debug visual de tiles controlado por variável de ambiente.

### Perfil e notificações

- Perfil público com resumo e denúncias acompanhadas.
- Edição de nome, foto, descrição e localização.
- Autocomplete de cidade/UF no perfil.
- Notificações com cache local e contador de não lidas.

## Otimizações implementadas

- Cache local com stale-while-revalidate para perfil, notificações e denúncias.
- Bootstrap inicial para preencher dados comuns rapidamente.
- Prefetch e cache de denúncias do mapa por tile.
- Uso de thumbnails em listas e marcadores.
- Cache de imagem com `expo-image`.
- Serviços de API separados por domínio para reduzir duplicação nas telas.

## Variáveis de ambiente

Crie um `.env` baseado em `.env.example`.

```env
EXPO_PUBLIC_API_URL=http://[IP]/api
EXPO_PUBLIC_UPLOAD_URL=http://[IP]:3030

EXPO_PUBLIC_MAP_TILE_DEBUG=false
EXPO_PUBLIC_APP_LOGS=false

EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_COLLECTION_PREFIX=dev_
```

Observações:

- Variáveis usadas no app Expo precisam do prefixo `EXPO_PUBLIC_`.
- A chave do OpenRouteService não deve ficar no frontend; as rotas são solicitadas ao backend.
- `EXPO_PUBLIC_MAP_TILE_DEBUG=true` ativa a camada visual de debug dos tiles.
- `EXPO_PUBLIC_APP_LOGS=true` ativa logs do app no console do Expo.

## Como rodar

```bash
npm install
npm start
```

Opções comuns:

```bash
npm run ios
npm run android
npm run web
npm run lint
```

## Documentação estática

Os arquivos em `docs/` podem ser hospedados como documentação pública:

- `docs/petsos_roadmap_dashboard.html`
- `docs/petsos_documentacao.html`
- `docs/petsos_frontend.html`
- `docs/petsos_backend.html`

Para hospedar no Vercel:

| Configuração | Valor |
| --- | --- |
| Framework Preset | `Other` |
| Root Directory | `docs` |
| Build Command | vazio |
| Output Directory | `.` |
| Install Command | vazio |

O arquivo `docs/index.html` é a entrada do site e redireciona para a documentação geral. O arquivo `docs/vercel.json` adiciona headers básicos de segurança para o deploy estático.

## Validação antes de PR

```bash
npm run lint
```

Para fluxos visuais, teste no Expo Go ou simulador, principalmente:

- login/cadastro/recuperação de senha;
- criação e detalhe de denúncia;
- mapa, popup de marcador e rota;
- comentários e reportes;
- perfil, edição de perfil e notificações.
