# ACTIVE SCENE — CASA CONTRERAS

Estado ativo restaurado após regressão do Work em 03/09/2026.

## Cadeia obrigatória da produção

`index.html` → `bootstrap-v16.js` →

1. `app-v09.js`
2. `patch-v10.js`
3. `patch-v15-reality.js`
4. `patch-v16-bughunt.js`
5. `patch-v16-finalize.js`

## Regra crítica

NÃO substituir esta cadeia por `app-v09.js` isolado.
NÃO declarar que os patches são legado sem antes portar integralmente para uma cena consolidada TODAS as correções visuais, geométricas, de circulação, escadas, mobiliário, implantação, paisagismo e sistemas presentes neles e validar visualmente o resultado.

O commit `0b15f8741fe23e782305f3b5172d72f65cb0559d` foi revertido da branch principal porque removia a cadeia v1.5/v1.6 e fazia a produção parecer uma versão antiga.

## Estado dimensional protegido

- lote: 10,000 × 25,000 m
- corpo de cada pavimento: 7,076 × 6,058 m
- faixa central: 2,200 m fechada e útil
- escadas: 100% externas
- sacadas: externas à área habitável
- 1 unidade Three.js = 1 metro

Antes de alterar `bootstrap-v16.js` ou `app-v09.js`, comparar visualmente com a produção vigente e com `PROJECT_MASTER.md`.
