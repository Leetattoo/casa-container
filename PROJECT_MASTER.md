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
- A física pode manter coordenadas internas compatíveis com o motor, mas a percepção visual deve representar o observador de 1,65 m sem alterar a métrica da casa.

Nunca aumentar `7,076 × 6,058 m` para mascarar erro de modelagem.

## 2. Interpretação correta da escala

Um pavimento habitável tem aproximadamente **39,772 m² internos antes das divisórias**. Comparado a uma referência residencial de ~32,5 m², é cerca de **22% maior**, portanto não deve parecer menor no walkthrough.

A sensação espacial deve ser corrigida por:
- câmera/altura coerente;
- FOV arquitetônico natural;
- móveis em medidas reais/compactas;
- remoção de colisões legadas;
- circulação livre;
- portas e vãos coerentes com as colisões;
- ausência de geometrias duplicadas.

## 3. Escadas e navegação

- **Todas as escadas ficam 100% fora do envelope habitável.**
- Nenhum lance, patamar ou vazio de escada pode consumir os **7,076 × 6,058 m** internos.
- Térreo → social: lance externo pela lateral direita.
- Social → íntimo: segundo lance externo atrás da casa, ligado por patamar externo.
- Escadas em aço grafite/preto + madeira quente.
- Largura útil alvo: aproximadamente **0,90–1,00 m**.
- Guarda-corpo e corrimão obrigatórios.
- Passar por baixo da escada superior no térreo nunca pode alterar pavimento.
- `1/2/3` são apenas atalhos manuais.

### Autoridade de navegação v1.10

`patch-v20-navigation-preserve.js` é a camada final de navegação vertical.

- O render final chama diretamente `THREE.WebGLRenderer.prototype.render`; wrappers antigos ficam carregados apenas por compatibilidade e são bypassados.
- Eventos sintéticos antigos não podem comandar a navegação.
- Troca automática de nível exige zona X/Z correta **e faixa Y correta** da escada.
- O estado interno do pavimento é atualizado no topo/rodapé sem deslocar a câmera para o centro do andar.
- A posição física é preservada no patamar.
- A física usa olhos internos ~1,66 m; a renderização visual usa ~1,55 m para representar pessoa de 1,65 m.

## 4. Sacadas

- Frontal social: **7,076 × 1,800 m**.
- Frontal íntima: **7,076 × 1,800 m**.
- Traseira social: **7,076 × 1,400 m**.
- Traseira íntima: **7,076 × 1,400 m**.
- Todas são externas à área habitável.
- Guarda-corpos pretos, madeira quente, jardineiras e iluminação leve.

## 5. Acessos

- Entrada social real alinhada ao topo da escada externa, com vão aproximado de **0,94 m**.
- Entrada íntima real alinhada ao patamar/sacada traseira, com vão aproximado de **0,96 m**.
- Não pode existir vidro, parede ou collision box contínua atravessando os vãos.

## 6. Térreo / pilotis

- Conceito aberto, bonito e transitável.
- Circulação contínua frente → fundos.
- Gourmet compacto à esquerda.
- Mesa familiar compacta.
- Oficina, depósito e lavanderia na faixa posterior, sem paredão transversal bloqueando o centro.
- Corredor livre aproximado: **1,10 m**.
- Pilotis/estrutura metálica aparentes.
- Nenhuma mobília, pilar ou equipamento pode bloquear a circulação principal.

## 7. Pavimento social

Distribuição:
- cozinha posterior esquerda;
- banheiro posterior direito;
- ilha central com **3 banquetas**;
- jantar central/frontal;
- sala frontal direita;
- sofá voltado para a TV;
- mesa de centro entre sofá e TV;
- grandes esquadrias e acessos às sacadas.

Mobiliário deve ser realista e compacto. A v1.7 reduziu apenas conjuntos superdimensionados; objetos já em medida real não devem ser falsamente reduzidos.

Medidas de referência:
- sofá 3 lugares: ~1,80–2,00 m;
- mesa 6 lugares: ~1,40–1,60 × 0,75–0,90 m;
- cadeira: ~0,43–0,48 m;
- ilha: ~1,60–1,85 × 0,75–0,85 m;
- bancada: ~0,60 m de profundidade.

Regra v1.11: sofá deve olhar para a TV e a mesa de centro deve ficar funcionalmente entre ambos, mantendo o corredor central livre.

## 8. Pavimento íntimo

Distribuição:
- casal na frente esquerda;
- três filhos nos fundos à esquerda;
- circulação à direita;
- gamer/escritório na frente direita;
- banheiro íntimo nos fundos à direita.

### Quarto do casal — v1.11

- cama queen ~**1,58 × 1,98 m**;
- cama orientada para dentro, cabeceira na divisória posterior;
- armário na lateral esquerda, sem atravessar a cama;
- folga alvo observada: ~**0,63 m** entre armário e cama;
- folga oposta: ~**0,64 m**;
- pé da cama até parede frontal: ~**0,92 m**;
- dois criados reposicionados junto à cama.

### Quarto dos filhos

- uma treliche de 3 níveis, footprint aproximado **0,92 × 2,00 m**;
- bancada para 3 posições;
- armário compacto sem bloquear porta;
- circulação central livre.

### Banheiro íntimo — v1.11

- recinto fechado;
- parede frontal separando banheiro do gamer;
- acesso pelo corredor lateral;
- vão de porta aproximado **0,78 m**;
- collision boxes somente nas partes realmente fechadas;
- vaso, bancada, banho/banheira e vidro permanecem funcionais.

## 9. Frente do lote

- carro/SUV junto ao portão;
- vaga compacta, sem faixa pavimentada inútil até a casa;
- cobertura leve/telhadinho próprio sobre a garagem;
- lago natural de banho à esquerda;
- lago de peixes separado;
- deck seco;
- horta frontal compacta;
- cisterna de chuva;
- filtros biológicos;
- paisagismo produtivo;
- caminho pedestre contínuo.

Nenhum lago, pedra, filtro, cisterna, árvore, canteiro ou cobertura pode atravessar o caminho.

## 10. Lagos

Lago natural:
- forma orgânica;
- maior que o de peixes;
- profundidade visual;
- pedras variadas;
- plantas marginais/aquáticas;
- deck de madeira;
- vegetação densa.

Lago de peixes:
- separado;
- menor;
- peixes visíveis;
- filtro biológico;
- pedras/plantas próprias.

Evitar elipses perfeitas e pedras idênticas. Ondulações visuais devem ser leves e não usar refração cara.

## 11. Fundos produtivos

- Estufa: traseira esquerda.
- Aviário/galinheiro: traseiro central.
- Depósito de ferramentas: traseiro direito.
- 6 canteiros horizontais.
- Composteira de 3 baias.
- Pelo menos **3 conjuntos de horta vertical**.
- Jardim filtrante/reuso.
- Caminho lateral contínuo e desobstruído.

## 12. Pomar/agrofloresta

Espécies: limão, laranja, mexerica, acerola, pitanga, goiaba, jabuticaba, manga, amora e banana quando couber.

- Troncos predominantemente próximos aos **muros/perímetro**.
- Miolo do terreno mais livre.
- Copas podem avançar visualmente para dentro, mas não bloquear caminho, escada, garagem, lagos ou sistemas.
- Copas irregulares, não esferas perfeitas.
- v1.12 adiciona galhos instanciados e áreas de mulch/solo sob as árvores.

## 13. Energia e água

Devem existir fisicamente:
- **10 painéis fotovoltaicos**;
- estrutura de suporte;
- cobertura independente/ventilada;
- calhas;
- descidas pluviais;
- cisterna ~**1.500 L**;
- reservatório operacional pequeno na cobertura;
- filtros biológicos;
- jardim filtrante/reuso.

## 14. Linguagem visual

Meta: aproximar progressivamente das perspectivas de referência, sem falsificar medidas.

- aço/container grafite escuro;
- madeira quente;
- vidro amplo com caixilho preto;
- brises;
- guarda-corpos;
- jardineiras;
- ripado/deck;
- perfis e corrugação;
- puxadores, metais e luminárias;
- materiais com variação/textura procedural leve;
- paisagismo tropical/produtivo denso;
- sombras de contato falsas para dar peso aos objetos sem shadowMap.

Evitar:
- aparência de Minecraft/CAD cru;
- cubos gigantes;
- objetos flutuando;
- interseções;
- móveis sem orientação funcional.

## 15. Performance

- Sombras dinâmicas desligadas por padrão.
- DPR alvo ~0,85–0,95.
- FOV de avaliação ~64°.
- Raycast restrito a elementos selecionáveis.
- Preferir geometrias/materiais compartilhados e InstancedMesh.
- Evitar transmission/refração cara, pós-processamento pesado e dezenas de point lights.
- v1.12 usa sombras de contato procedurais, galhos e mulch instanciados, evitando shadowMap dinâmico.

## 16. QA ativo

A cena expõe:
- `window.__CASA_AUDIT_V16__`: implantação/sistemas/escadas/portas;
- `window.__CASA_AUDIT_V17__`: escala, percepção, colisões e pomar;
- `window.__CASA_AUDIT_V18__`: acessos e overlaps;
- `window.__CASA_AUDIT_V19__`: corredores, duplicidade e overlaps;
- `window.__CASA_AUDIT_V20__`: navegação sem teleporte físico;
- `window.__CASA_NAV_V20__`: nível/escada/progresso/posição;
- `window.__CASA_AUDIT_V21__`: orientação da sala, master, banheiro íntimo e folgas;
- `window.__CASA_AUDIT_V22__`: realismo leve e custo gráfico adicional.

A revisão não é considerada estável se houver falhas críticas nesses QA.

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

Não substituir essa cadeia por `app-v09.js` isolado.

## 18. Regras permanentes

1. Nunca distorcer o terreno **10 × 25 m**.
2. Nunca alterar silenciosamente **7,076 × 6,058 m**.
3. Social e íntimo sempre têm o mesmo envelope.
4. A faixa central **2,200 m** é área útil fechada.
5. Escadas e sacadas são externas e não consomem área interna.
6. A vaga não reserva piso desnecessário até a casa.
7. Deve existir circulação pedestre contínua frente → fundos.
8. Nenhum caminho pode atravessar lago, árvore, canteiro ou equipamento.
9. Caminhar fora da escada nunca pode mudar pavimento.
10. Troca automática de pavimento nunca pode deslocar a posição X/Z do jogador.
11. Mobiliário deve ter escala realista e orientação funcional.
12. Quartos/banheiros precisam de portas e passagens reais.
13. Nenhum móvel pode atravessar outro móvel, parede ou circulação principal.
14. Árvores frutíferas devem priorizar o perímetro.
15. Sistemas sustentáveis precisam aparecer fisicamente.
16. Mudança dimensional exige atualização conjunta deste master e do 3D.
17. Estrutura, fundação, reforços de containers, hidráulica, elétrica, vento, corrosão costeira e legalização continuam conceituais até validação profissional.
