# Interface Design System

## Direction

PetSOS deve parecer amigável, calmo e protetor. Interface clara, sem dark theme, com navegação principal por abas reais para fluxos centrais: mapa, denúncias, notificações e perfil.

## Palette

- Background: `#FFF6EC`
- Surface: `#FFFFFF`
- Surface soft: `#FFE8C8`
- Border: `#F0D8BF`
- Primary/action: `#FF9F1C`
- Primary button variant: `#FF8C42`
- Text primary: `#272A3A`
- Text muted: `#8D7D78`

## Depth

Preferir superfícies claras com bordas quentes e sombras sutis. Evitar sombras fortes em navegação. Botão central da tab bar usa presença por forma, cor e borda branca, não por sombra.

## Spacing

Base visual: 4px. Usar múltiplos de 4 para gaps, padding e separação. Conteúdo de telas com padding horizontal 16-18px.

## Navigation Pattern

Itens principais devem ser tabs reais em `app/(tabs)`, não páginas empilhadas. Rotas antigas podem redirecionar para aba equivalente para compatibilidade.

Tab bar:
- Sem labels visíveis.
- Ícones com `accessibilityLabel` quando forem botões custom.
- Haptic `soft` em troca de aba.
- Ação central de criar denúncia usa ícone de pata, base laranja, borda branca e animação curta de press.

## Screen Pattern

Telas de aba usam header interno no conteúdo, não `Stack.Screen` com botão voltar. Header interno:
- Título grande `28/900`, cor `#272A3A`
- Subtítulo `14/20`, cor `#8D7D78`

## Interaction

Botões principais devem ter feedback tátil via `useHapticPress` ou `useHaptics`. Ações destrutivas precisam de confirmação antes de executar.
