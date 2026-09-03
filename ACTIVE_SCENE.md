# ACTIVE SCENE — CASA CONTRERAS

Estado ativo após restauração da regressão do Work e evolução até a **v1.9 NAVIGATION AUTHORITY** em 03/09/2026.

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

## Regra crítica

NÃO substituir esta cadeia por `app-v09.js` isolado.
NÃO remover patches sem portar integralmente as correções existentes.

O commit regressivo `0b15f8741fe23e782305f3b5172d72f65cb0559d` não é base válida da produção.

### Autoridade de navegação

A partir da v1.9, `patch-v19-navigation-authority.js` é a **única autoridade de render/navegação vertical**.

- Ele chama diretamente `THREE.WebGLRenderer.prototype.render`, portanto os wrappers antigos de `renderer.render` continuam carregados por compatibilidade histórica, mas são **bypassados**.
- Eventos sintéticos legados `Digit1/2/3` ficam bloqueados.
- A mudança automática de pavimento só pode ser autorizada pelo controlador v1.9 quando o jogador está fisicamente na zona X/Z **e na faixa Y correta** da escada correspondente.
- Passar por baixo da escada superior no térreo não pode alterar pavimento.
- `1/2/3` continuam disponíveis somente como atalhos manuais.

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
- escala/percepção para observador de 1,65 m;
- FOV arquitetônico ~64°;
- mobiliário social compactado sem falsificar cama queen/treliche;
- reparo de colisões interiores fantasmas;
- árvores frutíferas deslocadas para o perímetro;
- materiais procedurais leves e copas mais orgânicas.

### v1.8
- porta/vão social real alinhado à escada externa;
- porta/vão íntimo real alinhado ao patamar/sacada traseira;
- quarto dos filhos redistribuído;
- QA de sobreposições críticas.

### v1.9
- controlador único de escadas/altura;
- wrappers antigos de render bypassados;
- eventos sintéticos antigos de troca de pavimento bloqueados;
- guarda-roupa do casal reposicionado dentro do envelope, na parede frontal e separado da cama;
- QA de corredor social, corredor íntimo, overlaps, duplicidade de IDs e caminhos;
- detalhes leves de água e iluminação embutida.

A cena expõe `window.__CASA_AUDIT_V17__`, `window.__CASA_AUDIT_V18__`, `window.__CASA_AUDIT_V19__` e `window.__CASA_NAV_V19__`.

Antes de alterar `bootstrap-v16.js`, `app-v09.js` ou qualquer patch ativo, comparar com a produção e com `PROJECT_MASTER.md`.
