# ACTIVE SCENE — CASA CONTRERAS

Estado ativo após restauração da regressão do Work e ativação da auditoria espacial v1.7 em 03/09/2026.

## Cadeia obrigatória da produção

`index.html` → `bootstrap-v16.js` →

1. `app-v09.js`
2. `patch-v10.js`
3. `patch-v15-reality.js`
4. `patch-v16-bughunt.js`
5. `patch-v16-finalize.js`
6. `patch-v17-spatial-audit.js`

## Regra crítica

NÃO substituir esta cadeia por `app-v09.js` isolado.
NÃO remover um patch apenas porque o nome parece legado. Antes de consolidar, portar integralmente e validar TODAS as correções visuais, geométricas, de circulação, escadas, mobiliário, implantação, paisagismo, colisão e sistemas contidas nele.

O commit `0b15f8741fe23e782305f3b5172d72f65cb0559d` foi removido da branch principal porque desativava a cadeia v1.5/v1.6 e ressuscitava visualmente uma versão antiga.

## Estado dimensional protegido

- lote: 10,000 × 25,000 m
- corpo de cada pavimento: 7,076 × 6,058 m
- área interna aproximada antes das divisórias: 6,836 × 5,818 = 39,772 m² por pavimento
- faixa central: 2,200 m fechada e útil
- escadas: 100% externas
- sacadas: externas à área habitável
- 1 unidade Three.js = 1 metro
- referência humana do walkthrough: 1,65 m; olhos visuais ~1,55 m

## Estado v1.7

A v1.7 adiciona auditoria de percepção/escala e NÃO altera a metragem da casa. Ela compacta somente mobiliário que estava superdimensionado, preserva cama queen e treliche em medidas reais, filtra colisões interiores legadas, adiciona proteção contra teleporte fora das escadas, leva troncos do pomar ao perímetro e melhora materiais/copa das árvores com baixo custo gráfico.

Antes de alterar `bootstrap-v16.js`, `app-v09.js` ou qualquer patch ativo, comparar visualmente com a produção vigente e com `PROJECT_MASTER.md`.
