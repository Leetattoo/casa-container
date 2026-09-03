# ACTIVE SCENE — CASA CONTRERAS

Estado ativo: **v1.16 REALISM UPGRADE**.

## Cadeia obrigatória da produção

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
13. `patch-v23-heavy-qa.js`
14. `patch-v25-realism-upgrade.js`

## Regra crítica

NÃO substituir esta cadeia por `app-v09.js` isolado.
NÃO remover patches sem portar integralmente as correções existentes.
O commit regressivo `0b15f8741fe23e782305f3b5172d72f65cb0559d` não é base válida.

## Geometria protegida

- lote: 10,000 × 25,000 m
- corpo de cada pavimento: 7,076 × 6,058 m
- área interna aproximada antes das divisórias: 6,836 × 5,818 = 39,772 m² por pavimento
- dois pavimentos habitáveis: ~79,544 m² internos antes das divisórias
- faixa central: 2,200 m fechada e útil
- escadas: 100% externas
- sacadas: externas à área habitável
- 1 unidade Three.js = 1 metro
- referência humana: 1,65 m; olhos visuais ~1,55 m

## Navegação

`patch-v20-navigation-preserve.js` continua sendo a autoridade final de navegação vertical.

- wrappers antigos são bypassados no render final;
- mudança automática de nível exige zona X/Z e faixa Y compatíveis com a escada real;
- trocar o estado interno do andar não move X/Z do jogador;
- passar sob a escada superior no térreo não altera pavimento;
- 1/2/3 são atalhos manuais.

## Layout funcional

- sofá voltado para TV;
- mesa de centro entre sofá e TV;
- queen e guarda-roupa com folgas reais;
- banheiro íntimo fechado com acesso pelo corredor;
- quarto dos filhos com treliche, bancada e armário sem bloquear circulação;
- mobiliário social em medidas plausíveis; queen e treliche não são encolhidas artificialmente.

## Acessos

`patch-v24-access-circulation.js` mantém os acessos corretos:

- entrada social: fachada traseira, faixa de circulação entre cozinha e banheiro;
- entrada íntima: fachada traseira, desembocando no corredor direito;
- vão livre aproximado: 0,90 m;
- passarelas externas ligam patamares/sacadas aos vãos;
- fachada leste social permanece pano de vidro/estrutura;
- colisão legada é ignorada apenas no volume exato dos portais.

## QA

`patch-v23-heavy-qa.js` mantém o painel técnico pela tecla **K** e expõe `window.__CASA_AUDIT_V23__`.

O painel verifica:
- overlaps críticos;
- corredores social/íntimo;
- portais traseiros;
- escala observada dos principais móveis;
- árvores, caminho e escadas;
- objetos fora do lote;
- IDs duplicados e transforms inválidos;
- navegação e folgas do quarto do casal.

## Realismo v1.16

`patch-v25-realism-upgrade.js` é **somente visual**. Ele NÃO altera layout, área, paredes, acessos, escadas ou posição funcional dos móveis.

A camada adiciona/refina:
- ACES + exposição/iluminação diurna recalibradas;
- microtexturas procedurais de madeira, reboco, aço e tecido;
- vidro menos leitoso/plástico;
- água dos dois lagos com clearcoat, profundidade aparente e bump animado leve;
- corrugação e perfis do container via **InstancedMesh**;
- rodapés e microdetalhes da cozinha;
- grama 3D em instancing, fora das áreas de circulação/lago/vaga;
- folhagem fina instanciada nas árvores frutíferas;
- sombras dinâmicas continuam desligadas para proteger FPS.

A camada expõe `window.__CASA_AUDIT_V25__` e deve manter `geometryLayoutChanged:false`.

Antes de alterar `bootstrap-v16.js`, `app-v09.js` ou qualquer patch ativo, comparar com a produção, `PROJECT_MASTER.md` e este arquivo.
