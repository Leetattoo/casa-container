# ACTIVE SCENE — CASA CONTRERAS

Estado ativo: **v1.15 HEAVY QA / ACCESS**.

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

`patch-v20-navigation-preserve.js` é a autoridade final de navegação vertical.

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
- mobiliário social compactado sem reduzir objetos já em medida real.

## Acessos v1.14

`patch-v24-access-circulation.js` substitui os acessos v1.8 que caíam em ambientes errados.

- entrada social: fachada traseira, na faixa de circulação entre cozinha e banheiro;
- entrada íntima: fachada traseira, desembocando no corredor direito;
- vão livre aproximado: 0,90 m;
- passarelas externas ligam patamares/sacadas aos vãos;
- fachada leste social volta a ser pano contínuo de vidro/estrutura;
- colisão legada é ignorada apenas no volume exato dos portais.

## Realismo leve

- materiais procedurais leves;
- sombras de contato falsas, sem shadowMap dinâmico;
- galhos e mulch instanciados;
- caminho menos uniforme;
- vidro com brilho leve;
- árvores frutíferas priorizam o perímetro.

## QA v1.15

`patch-v23-heavy-qa.js` roda por último e expõe `window.__CASA_AUDIT_V23__`.

A tecla **K** abre painel técnico com:
- overlaps críticos;
- bloqueios de circulação social/íntima;
- bloqueios dos dois portais traseiros;
- árvores longe do muro ou próximas do caminho/escada;
- objetos principais fora do lote;
- IDs duplicados;
- transforms inválidos;
- folgas do quarto do casal e área social;
- estado da navegação e resultado do `__CASA_AUDIT_V24__`.

A revisão não deve ser considerada estável se o painel K indicar falhas críticas.

Antes de alterar `bootstrap-v16.js`, `app-v09.js` ou qualquer patch ativo, comparar com a produção e com `PROJECT_MASTER.md`.
