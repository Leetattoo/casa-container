# CASA_CONTRERAS_MASTER

## 1. Geometria congelada

- Terreno: **10,000 × 25,000 m**.
- Corpo de cada pavimento habitável: **7,076 × 6,058 m**.
- Área bruta por pavimento: **42,866 m²**.
- Social e íntimo têm exatamente o mesmo envelope.
- Composição transversal: **2,438 + 2,200 + 2,438 = 7,076 m**.
- Faixa central de **2,200 m**: fechada, útil e incorporada à moradia; não é vazio e não é terceiro container.
- Parede externa de coordenação: **0,120 m**.
- Área interna aproximada antes das divisórias: **6,836 × 5,818 = 39,772 m²** por pavimento.
- Dois pavimentos habitáveis: aproximadamente **79,544 m² internos antes das divisórias**.
- 1 unidade Three.js = **1 metro**.
- Referência humana do walkthrough: **1,650 m**; olhos visuais aproximadamente **1,550 m**.

Nunca aumentar `7,076 × 6,058 m` para mascarar erro de escala, mobiliário, FOV ou colisão.

## 2. Interpretação de escala

Um pavimento possui ~39,77 m² internos antes das divisórias. Em comparação com uma referência residencial de ~32,5 m², é cerca de **22% maior**. Portanto, não pode parecer menor no walkthrough.

Corrigir sensação espacial por:
- câmera/altura humana coerente;
- FOV arquitetônico ~64°;
- móveis em medidas reais e compactas;
- remoção de geometrias/colisões legadas;
- corredores efetivamente livres;
- portas e vãos correspondendo às colisões.

## 3. Escadas e navegação

- Todas as escadas ficam **100% externas** ao envelope habitável.
- Térreo → social: lateral direita.
- Social → íntimo: lance externo posterior.
- Largura útil alvo: ~0,90–1,00 m.
- Aço grafite/preto + madeira quente.
- Guarda-corpo e corrimão obrigatórios.
- Passar sob a escada superior no térreo nunca pode trocar pavimento.
- `1/2/3` são apenas atalhos manuais.

`patch-v20-navigation-preserve.js` é a autoridade final de navegação vertical:
- render final chama diretamente `THREE.WebGLRenderer.prototype.render`;
- wrappers antigos ficam bypassados;
- troca automática exige X/Z e Y compatíveis com a escada real;
- atualização do estado interno não desloca X/Z;
- posição física é preservada nos patamares.

## 4. Sacadas

- Frente social: **7,076 × 1,800 m**.
- Frente íntima: **7,076 × 1,800 m**.
- Fundos social: **7,076 × 1,400 m**.
- Fundos íntima: **7,076 × 1,400 m**.
- Todas externas ao corpo habitável.
- Guarda-corpo preto, madeira, jardineiras e iluminação leve.

## 5. Acessos — v1.14

Os acessos v1.8 foram substituídos porque desembocavam em ambientes errados.

Estado correto:
- entrada social pela **fachada traseira**, na faixa de circulação entre cozinha e banheiro;
- entrada íntima pela **fachada traseira**, desembocando no corredor direito;
- centro aproximado dos vãos: x ≈ **0,85 m**;
- largura livre aproximada: **0,90 m**;
- passarelas externas ligam patamares/sacadas aos portais;
- fachada leste social volta a ser pano contínuo de vidro/estrutura;
- nenhuma parede, vidro ou collision box pode atravessar os portais.

`patch-v24-access-circulation.js` é a camada responsável.

## 6. Térreo / pilotis

- Conceito aberto, bonito e transitável.
- Circulação contínua frente → fundos.
- Gourmet compacto à esquerda.
- Mesa familiar compacta.
- Oficina, depósito e lavanderia na faixa posterior.
- Sem paredão transversal fechando o centro.
- Corredor livre alvo ~**1,10 m**.
- Pilotis/estrutura metálica aparentes.
- Nada pode bloquear o corredor principal.

## 7. Pavimento social

- cozinha posterior esquerda;
- banheiro posterior direito;
- ilha central com **3 banquetas**;
- jantar central/frontal;
- sala frontal direita;
- sofá voltado para a TV;
- mesa de centro entre sofá e TV;
- circulação central livre;
- acesso traseiro pela faixa de circulação.

Medidas de referência:
- sofá: ~1,80–2,00 m;
- mesa 6 lugares: ~1,40–1,60 × 0,75–0,90 m;
- cadeira: ~0,43–0,48 m;
- ilha: ~1,60–1,85 × 0,75–0,85 m;
- bancada: ~0,60 m de profundidade.

## 8. Pavimento íntimo

Distribuição:
- casal na frente esquerda;
- filhos nos fundos esquerda;
- circulação direita;
- gamer frente direita;
- banheiro fundos direita;
- acesso externo traseiro desemboca no corredor, não no quarto dos filhos.

Quarto casal:
- queen ~**1,58 × 1,98 m**;
- orientação para dentro;
- guarda-roupa sem cruzar cama ou envelope;
- folgas alvo atuais: ~0,63/0,64 m laterais e ~0,92 m no pé da cama.

Filhos:
- uma treliche de 3 níveis, footprint ~**0,92 × 2,00 m**;
- bancada para 3 posições;
- armário compacto;
- passagem livre.

Banheiro íntimo:
- recinto fechado;
- acesso pelo corredor;
- porta ~0,78 m;
- vaso, bancada, banho/banheira e vidro funcionais.

## 9. Frente do lote

- carro/SUV junto ao portão;
- vaga compacta;
- telhadinho/cobertura própria da garagem;
- lago natural à esquerda;
- lago de peixes separado;
- deck seco;
- horta frontal;
- cisterna;
- filtros biológicos;
- caminho contínuo;
- sem pavimentação inútil até a casa.

Nenhum elemento pode invadir caminho ou vaga.

## 10. Lagos

Lago natural:
- orgânico;
- maior;
- profundidade visual;
- pedras variadas;
- plantas marginais/aquáticas;
- deck de madeira;
- vegetação densa.

Lago de peixes:
- menor e separado;
- peixes visíveis;
- filtro biológico;
- pedras e plantas próprias.

Evitar elipses perfeitas e pedras idênticas. Ondulações são leves, sem refração cara.

## 11. Fundos produtivos

- estufa traseira esquerda;
- aviário/galinheiro central;
- depósito de ferramentas traseiro direito;
- 6 canteiros horizontais;
- composteira 3 baias;
- pelo menos **3 conjuntos de horta vertical**;
- jardim filtrante/reuso;
- caminho lateral desobstruído.

## 12. Pomar/agrofloresta

Espécies: limão, laranja, mexerica, acerola, pitanga, goiaba, jabuticaba, manga, amora e banana quando couber.

- Troncos próximos aos muros/perímetro.
- Miolo do terreno mais livre.
- Não bloquear caminho, escada, garagem, lagos ou sistemas.
- Copas irregulares.
- Galhos e mulch/solo instanciados podem ser usados para realismo leve.

## 13. Energia e água

Devem aparecer fisicamente:
- **10 painéis fotovoltaicos**;
- suporte;
- cobertura ventilada;
- calhas;
- descidas pluviais;
- cisterna ~**1.500 L**;
- reservatório pequeno na cobertura;
- filtros biológicos;
- jardim filtrante/reuso.

## 14. Linguagem visual

Meta: aproximar progressivamente das imagens de referência sem falsificar a métrica.

- aço/container grafite;
- madeira quente;
- vidro amplo com caixilho preto;
- brises;
- guarda-corpos;
- jardineiras;
- ripado/deck;
- perfis/corrugação;
- puxadores, metais e luminárias;
- materiais com textura procedural leve;
- paisagismo tropical/produtivo denso;
- sombras de contato falsas para dar peso aos objetos.

Evitar aparência Minecraft/CAD cru, cubos gigantes, objetos flutuando, interseções e mobiliário sem orientação funcional.

## 15. Performance

- sombras dinâmicas desligadas;
- DPR alvo ~0,85–0,95;
- FOV ~64°;
- raycast limitado;
- preferir geometrias/material compartilhados e InstancedMesh;
- evitar transmission/refração, pós-processamento pesado e muitas point lights.

## 16. QA ativo — v1.15

A cena expõe auditorias históricas v16–v22, mais:
- `window.__CASA_AUDIT_V24__`: acessos traseiros, blockers e folga para banheiros;
- `window.__CASA_AUDIT_V23__`: QA pesado consolidado;
- `window.__CASA_NAV_V20__`: estado de navegação em runtime.

A tecla **K** abre o painel técnico v1.15, verificando:
- overlaps críticos;
- corredores social/íntimo;
- portais traseiros;
- árvores fora do perímetro ou próximas de caminho/escada;
- objetos fora do lote;
- IDs duplicados;
- transforms inválidos;
- folgas úteis;
- estado da navegação.

Revisão não é considerada estável se houver falha crítica no painel K.

## 17. Cadeia ativa

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

Não substituir por `app-v09.js` isolado.

## 18. Regras permanentes

1. Terreno sempre **10 × 25 m**.
2. Corpo sempre **7,076 × 6,058 m** salvo mudança explícita documentada.
3. Social e íntimo com mesmo envelope.
4. Faixa central 2,200 m é área útil.
5. Escadas e sacadas externas.
6. Vaga compacta junto ao portão.
7. Caminho frente → fundos contínuo.
8. Caminho não atravessa lago, árvore, canteiro ou equipamento.
9. Caminhar fora da escada nunca troca pavimento.
10. Troca automática nunca desloca X/Z do jogador.
11. Móveis em escala realista e orientação funcional.
12. Quartos/banheiros com portas/passagens reais.
13. Nenhum móvel atravessa outro, parede ou circulação.
14. Árvores frutíferas priorizam o perímetro.
15. Sistemas sustentáveis aparecem fisicamente.
16. Mudança dimensional atualiza master e 3D juntos.
17. Estrutura, fundação, reforços de containers, hidráulica, elétrica, vento, corrosão costeira e legalização permanecem conceituais até validação profissional.
