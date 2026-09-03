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
- 1 unidade Three.js = **1 metro**.
- Pessoa de referência: **1,750 m**; olhos/câmera: **1,660 m**.

## v1.5 — proporção real e circulação

A v1.5 elimina a cadeia de patches v11/v12/v13/v14 da produção e passa a carregar apenas `app-v09.js`, `patch-v10.js` e `patch-v15-reality.js` via `bootstrap-v15.js`. A finalidade é reduzir geometria legada, objetos duplicados, paredes invisíveis e inconsistências de escala.

### Sacadas

- Sacada frontal social: **7,076 × 1,800 m**.
- Sacada frontal íntima: **7,076 × 1,800 m**.
- Sacada traseira social: **7,076 × 1,400 m**.
- Sacada traseira íntima: **7,076 × 1,400 m**.
- Todas são externas ao corpo habitável e não reduzem os **6,058 m** de profundidade da casa.

### Escadas

- Térreo → social: lance externo pela lateral direita, cerca de **0,92 m de largura**, com 18 degraus e patamar traseiro.
- Social → íntimo: segundo lance externo transversal atrás da casa, com 17 degraus, sem ficar empilhado sobre o primeiro.
- Os dois lances são navegáveis com WASD; 1/2/3 permanecem somente atalhos.
- O caminho pedestre lateral esquerdo permanece independente das escadas.

## Frente do lote

- Vaga compacta junto ao portão: **2,80 × 5,60 m**, apenas para um SUV grande.
- Não existe piso veicular contínuo até a casa.
- A garagem recebe cobertura leve própria, independente da casa.
- Lago natural à esquerda e lago de peixes separado à direita são redesenhados com bordas orgânicas, pedras e vegetação de margem.
- Filtros biológicos ficam junto ao lago de peixes, fora do caminho.
- Existe caminho pedestre contínuo pela lateral oeste, aproximadamente **0,80 m**, do portão aos fundos.
- Caminho, lagos, filtros, vaga e cobertura da garagem não podem se sobrepor.

## Térreo / pilotis

O térreo deve ser aberto e transitável. A v1.5 define:
- corredor livre de aproximadamente **1,10 m** sob o pilotis;
- gourmet compacto encostado à esquerda;
- mesa familiar de seis lugares em escala menor;
- oficina, depósito e lavanderia compactos na faixa posterior, sem paredão transversal;
- pilotis e estrutura metálica aparentes;
- nenhuma peça de serviço pode invadir o corredor principal.

## Pavimento social

O mobiliário passa a usar dimensões mais próximas de produtos reais, evitando a impressão de que a casa está menor do que é:
- bancada de cozinha ~**2,35 × 0,60 m**;
- ilha ~**1,75 × 0,78 m**;
- 3 banquetas altas com assento ~**0,36 m**;
- mesa de jantar ~**1,55 × 0,80 m**;
- cadeiras ~**0,40 × 0,42 m**;
- sofá de 3 lugares ~**1,90 × 0,78 m**;
- banheiro social compacto, fechado e equipado;
- sofá voltado para a TV e cadeiras voltadas para suas mesas.

## Pavimento íntimo

- Quarto do casal na frente esquerda, com cama queen **1,58 × 1,98 m** posicionada contra a parede interna/lateral, não apontada para fora da casa.
- Guarda-roupa reduzido e afastado da cama.
- Quarto dos filhos nos fundos à esquerda com **uma treliche de 3 camas sobrepostas**, footprint ~**0,92 × 2,00 m**, e bancada compacta para 3 posições.
- Escritório/gamer na frente direita com bancada e cadeira menores.
- Banheiro íntimo nos fundos à direita com vaso, bancada e banheira compacta.
- Nenhum mobiliário deve atravessar divisórias, esquadrias ou circulação.

## Fundos produtivos

Distribuição vigente:
- estufa traseira esquerda;
- aviário/galinheiro traseiro central;
- depósito de ferramentas traseiro direito;
- 6 canteiros horizontais centrais;
- composteira em 3 baias;
- **3 conjuntos de horta vertical** na lateral direita;
- cisterna visível de aproximadamente **1.500 L**;
- pomar frutífero mais denso.

## Pomar frutífero

A v1.5 passa a identificar árvores como frutíferas. O conjunto inclui limão, laranja, acerola, pitanga, goiaba, mexerica, manga, jabuticaba, amora e variações distribuídas pelo terreno. Árvores não podem bloquear escadas, caminho lateral, lagos, garagem ou equipamentos.

## Energia e água

- Cobertura principal continua independente e ventilada.
- A v1.5 recria **10 painéis fotovoltaicos visíveis** sobre a cobertura.
- Cisterna de água de chuva ~**1.500 L** aparece no terreno e recebe conexão visual por tubulação.
- Filtros biológicos dos lagos permanecem externos à circulação.

## Linguagem visual

Referência visual aprovada continua soberana:
- aço/container grafite escuro;
- madeira quente em decks, sacadas, escadas e mobiliário;
- grandes panos de vidro com caixilhos pretos;
- pilotis aberto;
- cobertura independente com FV;
- lagos naturais, pedras e vegetação de borda;
- paisagismo produtivo denso;
- móveis reconhecíveis em volumes funcionais, não cubos gigantes;
- iluminação leve, sem point lights e sombras dinâmicas pesadas por padrão.

## Performance

- Produção v1.5: `app-v09.js` + `patch-v10.js` + `patch-v15-reality.js`.
- Sombras dinâmicas desligadas.
- DPR limitado a aproximadamente **0,88** por padrão.
- FOV vertical: **60°**.
- Raycast de feedback permanece restrito a elementos selecionáveis.
- Evitar transmission/refração e pós-processamento caro.

## QA v1.5

A cena expõe `window.__CASA_AUDIT_V15__`, conferindo pelo menos:
- dimensões master 10 × 25 e 7,076 × 6,058;
- sacadas frontal e traseira;
- mobiliário recalibrado;
- escadas separadas;
- corredor livre no térreo;
- 10 painéis FV;
- 3 hortas verticais;
- quantidade de árvores frutíferas;
- sobreposição entre caminho, lagos, garagem, estufa e setores principais.

## Regras permanentes

1. Nunca distorcer o terreno **10 × 25 m**.
2. Nunca alterar silenciosamente o corpo **7,076 × 6,058 m**.
3. Social e íntimo sempre têm o mesmo envelope.
4. O vão central **2,200 m** é área útil fechada.
5. Sacadas e escadas externas não reduzem área interna.
6. A vaga não reserva piso desnecessário até a casa.
7. Deve existir circulação pedestre contínua frente → fundos.
8. Nenhum caminho pode passar por baixo ou através de lagos.
9. Escadas precisam ser visualmente plausíveis e navegáveis.
10. Mobiliário deve usar escala plausível de produto real e orientação funcional.
11. Banheiros precisam ser completos e reconhecíveis.
12. Nenhum mobiliário pode atravessar outro móvel, parede ou circulação principal.
13. Sistemas sustentáveis precisam aparecer fisicamente no modelo.
14. Mudança dimensional exige atualização conjunta deste master e do 3D.
15. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
