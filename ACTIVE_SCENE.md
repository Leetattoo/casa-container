# ACTIVE SCENE — CASA CONTRERAS

Estado ativo: **v1.17 STRUCTURAL / CONTAINER**.

## Cadeia obrigatória

`index.html` → `bootstrap-v16.js` →

1. `app-v09.js`
2. `patch-v10.js`
3. `patch-v15-reality.js`
4. `patch-v16-bughunt.js`
5. `patch-v16-finalize.js`
6. `patch-v17-spatial-audit.js`
7. `patch-v18-access-space.js`
8. `patch-v19-navigation-authority.js`
9. `patch-v20-navigation-preserve.js`
10. `patch-v21-interior-functional-fit.js`
11. `patch-v22-lightweight-realism.js`
12. `patch-v24-access-circulation.js`
13. `patch-v25-realism-upgrade.js` — visual only
14. `patch-v26-structural-container.js` — estrutura ativa do térreo/escadas/portas/container
15. `patch-v27-legacy-cleanup.js` — remove legado visível
16. `patch-v28-structural-realism.js` — realismo sobre a geometria v26
17. `patch-v29-heavy-qa.js` — QA final

## Regras que NÃO podem regredir

- Não substituir a cadeia por `app-v09.js` isolado.
- Não reativar `TERREO-V15` como composição final.
- Não reativar visualmente `ESCADAS-EXTERNAS-V16`.
- Não voltar a usar navegação que define altura apenas por X/Z.
- Não tornar visíveis novamente os acessos desenhados da v24; o recorte/colisão deles pode permanecer, mas a porta visível é v26.
- Não remover `patch-v26`, `v27`, `v28` ou `v29` sem portar integralmente suas correções.
- O commit regressivo `0b15f8741fe23e782305f3b5172d72f65cb0559d` não é base válida.

## Geometria protegida

- lote: 10,000 × 25,000 m
- corpo de cada pavimento: 7,076 × 6,058 m
- área interna aproximada antes das divisórias: 6,836 × 5,818 = 39,772 m²
- dois pavimentos habitáveis: ~79,544 m² internos antes das divisórias
- faixa central: 2,200 m fechada e útil
- escadas: 100% externas
- sacadas: externas à área habitável
- 1 unidade Three.js = 1 metro
- referência humana: 1,65 m; olhos visuais ~1,55 m

## Navegação v1.17

`patch-v20-navigation-preserve.js` continua sendo a autoridade de navegação e foi refeito para **engate por extremidade**.

- A escada inferior só engata ao entrar pelo primeiro degrau ou pelo patamar social.
- A escada superior só engata ao entrar pelo patamar social ou pelo patamar íntimo.
- Cruzar por baixo ou atravessar o meio da projeção da escada NÃO altera Y.
- O segundo lance está alinhado à geometria v26: `z≈4,92`, de `x≈3,05` a `x≈-1,65`.
- Eventos sintéticos `Digit1/2/3` legados são bloqueados, exceto o evento interno controlado de sincronização.
- A troca interna de pavimento preserva X/Z da câmera.
- `1/2/3` continuam atalhos manuais.

## Térreo v26

`patch-v26-structural-container.js` remove o `TERREO-V15` final e reconstrói o pilotis.

- eixo visual livre frente → fundos ~1,45 m;
- nenhuma parede transversal alta;
- oficina lateral esquerda;
- depósito lateral aberto;
- lavanderia lateral direita;
- gourmet e mesa deslocados para não fechar o centro;
- colisões legadas de paredes térreas são ignoradas apenas dentro do pilotis.

## Escadas v26

- grupo ativo: `ESCADAS-EXTERNAS-V26`;
- térreo → social: 19 degraus, lateral direita;
- social → íntimo: 18 degraus, faixa traseira;
- passarelas externas conectam os lances às portas traseiras;
- guarda-corpos e corrimãos permanecem externos ao envelope habitável.

## Portas v26

- grupo ativo: `PORTAS-ARQUITETONICAS-V26`;
- portas de correr visíveis na frente dos dois pavimentos;
- portas traseiras visíveis nos dois pavimentos;
- desenho antigo v24 fica invisível para evitar duplicidade, mas seu recorte físico pode ser mantido.

## Identidade dos containers

`CONTAINER-IDENTITY-V26` torna legíveis os quatro containers:

- postes de canto;
- rails superior/inferior;
- corner castings;
- corrugação instanciada nas faces externas;
- dois módulos laterais por pavimento + faixa central fechada de 2,20 m.

## Mobiliário

v26 substitui os três elementos sociais mais grosseiros mantendo IDs do QA:

- `SOFA-V15`: ~1,88 m, almofadas e pés separados;
- `JANTAR-V15`: mesa compacta + 6 cadeiras refinadas;
- `ILHA-V15`: ~1,68 × 0,78 m, waterfall + 3 banquetas reais.

Queen e treliche permanecem em dimensões reais e recebem apenas acabamento adicional.

## Realismo

- v25: água, vegetação, microtexturas gerais e iluminação;
- v28: microtextura aplicada especificamente à estrutura/móveis v26, sombras de contato, variação de pintura das nervuras e trilhos das portas;
- sombras dinâmicas continuam desligadas por padrão para preservar FPS.

## QA

`patch-v29-heavy-qa.js` roda por último e expõe `window.__CASA_AUDIT_V29__`.

A tecla **K** verifica a geometria v1.17: pilotis aberto, paredes térreas residuais, escadas v26, portas v26, identidade container, portas legadas ocultas, navegação, dimensões dos móveis, overlaps, IDs duplicados e transforms inválidos.
