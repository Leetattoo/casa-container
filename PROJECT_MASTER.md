# CASA_CONTRERAS_MASTER

## Geometria congelada

- Terreno: **10,000 × 25,000 m**.
- Corpo de cada pavimento habitável: **7,076 × 6,058 m**.
- Área bruta por pavimento: **42,866 m²**.
- Social e íntimo têm exatamente o mesmo envelope.
- Composição transversal: **2,438 + 2,200 + 2,438 = 7,076 m**.
- Faixa central de **2,200 m**: fechada, útil e incorporada à moradia.
- Parede externa de coordenação: **0,120 m**.
- Área interna aproximada antes das divisórias: **6,836 × 5,818 = 39,772 m²**.
- Os dois pavimentos habitáveis somam aproximadamente **79,544 m² internos antes das divisórias**.
- 1 unidade Three.js = **1 metro**.
- Referência humana de avaliação do walkthrough: **1,650 m**; olhos/câmera visual: aproximadamente **1,550 m**.
- A física pode manter coordenadas internas compatíveis com o motor, mas a percepção visual deve representar o observador de 1,65 m sem alterar a métrica da casa.

## v1.7 — auditoria espacial / escala / realismo

A v1.7 mantém a cadeia validada v1.5/v1.6 e adiciona `patch-v17-spatial-audit.js`. O objetivo é corrigir a sensação falsa de aperto, paredes/colisões fantasmas, teleporte fora das escadas, mobiliário visualmente superdimensionado e paisagismo excessivamente central, sem aumentar artificialmente a casa.

### Interpretação correta da área

Um pavimento habitável possui aproximadamente **39,772 m² internos antes das divisórias**. Portanto, comparado a um ambiente de aproximadamente 32,5 m², ele é cerca de **22% maior**, e não deve parecer menor no walkthrough. A soma dos dois pavimentos habitáveis é que se aproxima de 80 m² internos.

A sensação espacial deve ser corrigida por:
- escala humana coerente;
- FOV arquitetônico natural;
- mobiliário em dimensões reais/compactas;
- remoção de paredes e colisões legadas;
- circulação efetivamente livre;
- portas/vãos correspondendo às colisões.

Nunca aumentar `7,076 × 6,058 m` para mascarar erro de modelagem.

### Regra permanente de escadas

- **Todas as escadas ficam 100% fora do envelope habitável.**
- Nenhum lance, patamar ou vazio de escada pode consumir os **7,076 × 6,058 m** internos dos pavimentos.
- Térreo → social: lance externo pela lateral direita.
- Social → íntimo: segundo lance externo atrás da casa, fora da sacada traseira, ligado por patamar externo.
- Caminhar no térreo sob a projeção da escada superior nunca pode alterar a câmera para outro pavimento.
- A mudança de altura normal deve ocorrer somente sobre degrau/patamar válido.
- 1/2/3 são somente atalhos manuais.

### Sacadas

- Sacada frontal social: **7,076 × 1,800 m**.
- Sacada frontal íntima: **7,076 × 1,800 m**.
- Sacada traseira social: **7,076 × 1,400 m**.
- Sacada traseira íntima: **7,076 × 1,400 m**.
- Todas são externas ao corpo habitável.

## Frente do lote — referência visual

A prancha aprovada continua soberana como referência de composição:
- carro junto ao portão, apenas na vaga necessária;
- cobertura leve própria sobre a garagem;
- lago natural de banho à esquerda;
- lago de peixes separado à direita;
- horta frontal compacta entre as zonas livres;
- cisterna de chuva na zona frontal esquerda;
- filtros biológicos junto ao lago de peixes;
- caminho pedestre contínuo pela lateral esquerda;
- vegetação frutífera e ornamental densa sem bloquear circulação.

Nenhum canteiro, lago, filtro, cisterna, árvore, deck ou cobertura pode invadir o caminho ou a vaga.

## Térreo / pilotis

- Térreo aberto, bonito e transitável.
- Gourmet à esquerda, mesa familiar compacta e serviços na faixa posterior.
- Oficina, depósito e lavanderia devem permanecer funcionais, sem paredão transversal.
- Corredor livre aproximado: **1,10 m**.
- O piso base duplicado não deve causar z-fighting ou degrau visual.
- Pilotis e estrutura metálica permanecem aparentes.

## Pavimento social

Distribuição visual de referência:
- cozinha na faixa posterior esquerda;
- banheiro posterior direito;
- ilha central com **3 banquetas**, não cadeiras comuns;
- jantar central/frontal;
- sala frontal direita com sofá voltado para a TV;
- portas/esquadrias amplas para sacadas frontal e traseira.

Mobiliário permanece em escala plausível de produto real. Na v1.7, conjuntos sociais podem ser compactados quando estiverem superdimensionados, mas sem reduzir objetos cuja medida master já é real.

## Pavimento íntimo

Distribuição de referência:
- quarto do casal na frente esquerda;
- quarto dos 3 filhos nos fundos à esquerda;
- circulação no lado direito;
- escritório/gamer na frente direita;
- banheiro íntimo nos fundos à direita.

Regras:
- divisória longitudinal precisa ter **portas reais** para quarto do casal e quarto dos filhos;
- cama do casal deve estar orientada para dentro do quarto;
- cama queen permanece aproximadamente **1,58 × 1,98 m**;
- quarto dos filhos usa **uma treliche com 3 camas sobrepostas**, footprint aproximado **0,92 × 2,00 m**;
- bancada de estudo para 3 posições e armário compacto não podem bloquear portas;
- gamer e banheiro permanecem fora da circulação principal.

## Fundos produtivos

- estufa traseira esquerda;
- aviário/galinheiro traseiro central;
- depósito de ferramentas traseiro direito;
- 6 canteiros horizontais;
- composteira em 3 baias;
- **3 conjuntos de horta vertical**;
- jardim filtrante/reuso;
- pomar/agrofloresta perimetral mais denso.

O caminho lateral deve chegar aos fundos sem atravessar estufa, canteiro, árvore ou equipamento.

## Pomar frutífero

O conjunto inclui limão, laranja, acerola, pitanga, goiaba, mexerica, manga, jabuticaba, amora e banana.

Regra v1.7: **os troncos devem permanecer predominantemente próximos aos muros/perímetro**, liberando o miolo do lote. Copas podem avançar visualmente para dentro, desde que não prejudiquem escada, acesso, caminho, lagos, garagem ou sistemas de água.

## Energia e água

- Cobertura independente e ventilada.
- **10 painéis fotovoltaicos visíveis** na cobertura.
- Reservatório operacional pequeno na cobertura.
- Calhas frontal/traseira e descidas visuais ligadas à captação.
- Cisterna de chuva ~**1.500 L** na frente do lote.
- Filtros biológicos dos lagos e jardim filtrante/reuso devem ser observáveis no 3D.

## Linguagem visual

Meta: aproximar progressivamente o walkthrough das perspectivas de referência, sem falsificar as medidas:
- aço/container grafite escuro;
- madeira quente em decks, sacadas, escadas e brises;
- grandes panos de vidro com caixilhos pretos;
- pilotis aberto;
- cobertura com FV e captação de chuva;
- lagos orgânicos com pedras, plantas e deck;
- paisagismo tropical/produtivo denso;
- árvores com copas irregulares, não apenas esferas;
- móveis reconhecíveis, arredondados quando apropriado e em escala realista;
- materiais com variação/textura leve para evitar aparência de bloco/Minecraft;
- evitar cubos gigantes, objetos flutuando e interseções;
- iluminação leve e performance estável.

## Performance

Produção v1.7: `app-v09.js` + `patch-v10.js` + `patch-v15-reality.js` + `patch-v16-bughunt.js` + `patch-v16-finalize.js` + `patch-v17-spatial-audit.js` via `bootstrap-v16.js`.

- Sombras dinâmicas desligadas por padrão.
- DPR padrão limitado a aproximadamente **0,90**.
- FOV vertical de avaliação: aproximadamente **64°**.
- Raycast de feedback restrito a elementos selecionáveis.
- Materiais procedurais leves são preferíveis a pós-processamento pesado.
- Evitar transmission/refração cara e luzes pontuais em excesso.

## QA v1.7

A cena expõe `window.__CASA_AUDIT_V17__`, que deve incluir:
- envelope da casa e área interna calculada;
- referência humana de 1,65 m;
- medidas observadas dos principais móveis;
- IDs duplicados;
- reparo de colisões interiores fantasmas;
- proteção contra teleporte fora das escadas;
- quantidade e posição perimetral das árvores frutíferas;
- confirmação de que a casa não foi artificialmente redimensionada.

A v1.6 continua expondo `window.__CASA_AUDIT_V16__` para implantação, sistemas, portas, escadas, frente e sobreposições críticas.

## Regras permanentes

1. Nunca distorcer o terreno **10 × 25 m**.
2. Nunca alterar silenciosamente o corpo **7,076 × 6,058 m**.
3. Social e íntimo sempre têm o mesmo envelope.
4. O vão central **2,200 m** é área útil fechada.
5. **Escadas e sacadas são externas e não consomem área interna.**
6. A vaga não reserva piso desnecessário até a casa.
7. Deve existir circulação pedestre contínua frente → fundos.
8. Nenhum caminho pode passar por baixo ou através de lagos.
9. Caminhar fora da escada nunca pode mudar o pavimento da câmera.
10. Mobiliário deve usar escala plausível e orientação funcional.
11. Quartos e banheiros precisam ter portas/passagens reais e transitáveis.
12. Nenhum mobiliário pode atravessar outro móvel, parede ou circulação principal.
13. Árvores frutíferas devem priorizar o perímetro/muros, liberando o centro do lote.
14. Sistemas sustentáveis precisam aparecer fisicamente no modelo.
15. Mudança dimensional exige atualização conjunta deste master e do 3D.
16. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
