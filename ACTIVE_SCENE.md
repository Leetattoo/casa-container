# ACTIVE SCENE — CASA CONTRERAS

Estado ativo após restauração da regressão do Work e evolução até a **v1.12 LIGHTWEIGHT REALISM** em 03/09/2026.

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

## Regra crítica

NÃO substituir esta cadeia por `app-v09.js` isolado.
NÃO remover patches sem portar integralmente as correções existentes.
O commit regressivo `0b15f8741fe23e782305f3b5172d72f65cb0559d` não é base válida da produção.

## Autoridade de navegação atual

`patch-v20-navigation-preserve.js` é a camada final de navegação vertical.

- chama diretamente `THREE.WebGLRenderer.prototype.render`;
- wrappers antigos ficam carregados apenas por compatibilidade, mas não comandam a renderização final;
- mudança automática de nível exige X/Z e Y compatíveis com a escada real;
- o estado interno do andar é atualizado sem deslocar a posição física do jogador para o centro do pavimento;
- passar sob a escada superior no térreo não pode alterar pavimento;
- `1/2/3` permanecem atalhos manuais.

## Estado dimensional protegido

- lote: 10,000 × 25,000 m
- corpo de cada pavimento: 7,076 × 6,058 m
- área interna aproximada antes das divisórias: 6,836 × 5,818 = 39,772 m² por pavimento
- dois pavimentos habitáveis: ~79,544 m² internos antes das divisórias
- faixa central: 2,200 m fechada e útil
- escadas: 100% externas
- sacadas: externas à área habitável
- 1 unidade Three.js = 1 metro
- referência humana: 1,65 m; olhos visuais ~1,55 m

## Evolução recente

### v1.7
- escala/percepção 1,65 m;
- FOV ~64°;
- móveis sociais compactados;
- colisões interiores fantasmas filtradas;
- pomar levado ao perímetro;
- materiais procedurais/copas mais orgânicas.

### v1.8
- porta/vão social real;
- porta/vão íntimo real;
- quarto dos filhos redistribuído;
- QA de acessos/overlaps.

### v1.9
- autoridade única de render/navegação;
- eventos sintéticos legados bloqueados;
- QA de corredores e duplicidade.

### v1.10
- troca do `activeLevel` sem teleporte físico;
- posição preservada nos patamares;
- navegação contínua nas duas escadas externas.

### v1.11
- sofá rotacionado para a TV;
- mesa de centro movida para a frente do sofá;
- quarto do casal redesenhado com queen centralizada e folgas reais (~0,63 m / ~0,64 m laterais e ~0,92 m no pé);
- banheiro íntimo fechado corretamente, com porta de ~0,78 m para o corredor e collision boxes somente nas paredes reais.

### v1.12
- sombras de contato procedurais sem shadowMap;
- galhos e áreas de mulch instanciados no pomar;
- caminho lateral menos artificialmente uniforme;
- brilho leve de vidro;
- realismo aumentado com baixo impacto de draw calls.

## QA runtime

A cena expõe:
- `window.__CASA_AUDIT_V17__`
- `window.__CASA_AUDIT_V18__`
- `window.__CASA_AUDIT_V19__`
- `window.__CASA_AUDIT_V20__`
- `window.__CASA_AUDIT_V21__`
- `window.__CASA_AUDIT_V22__`
- `window.__CASA_NAV_V20__`

Antes de alterar `bootstrap-v16.js`, `app-v09.js` ou qualquer patch ativo, comparar com a produção e com `PROJECT_MASTER.md`.
