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

## v1.6 — heavy bug hunt / alinhamento incremental

A v1.6 mantém a base v1.5 e adiciona somente uma camada de correção estrutural (`patch-v16-bughunt.js`). O objetivo é eliminar bugs observados nos prints sem reescrever o modelo inteiro.

### Regra permanente de escadas

- **Todas as escadas ficam 100% fora do envelope habitável.**
- Nenhum lance, patamar ou vazio de escada pode consumir os **7,076 × 6,058 m** internos dos pavimentos.
- Térreo → social: lance externo pela lateral direita.
- Social → íntimo: segundo lance externo atrás da casa, fora da sacada traseira, ligado por patamar externo.
- O bug em que caminhar no térreo sob a projeção XZ da escada superior fazia a câmera aparecer no andar de cima é considerado crítico e fica bloqueado por guard de nível.
- 1/2/3 são somente atalhos; caminhar fora das escadas nunca pode alterar pavimento.

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

Mobiliário permanece em escala plausível de produto real.

## Pavimento íntimo

Distribuição de referência:
- quarto do casal na frente esquerda;
- quarto dos 3 filhos nos fundos à esquerda;
- circulação no lado direito;
- escritório/gamer na frente direita;
- banheiro íntimo nos fundos à direita.

Regras v1.6:
- divisória longitudinal precisa ter **portas reais** para quarto do casal e quarto dos filhos; não pode existir paredão contínuo bloqueando a circulação;
- cama do casal deve estar orientada para dentro do quarto, com cabeceira em parede interna;
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

O conjunto inclui limão, laranja, acerola, pitanga, goiaba, mexerica, manga, jabuticaba, amora e banana, com árvores adicionais distribuídas no perímetro. Árvores não podem bloquear escadas, caminho, lagos, garagem ou sistemas de água.

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
- móveis reconhecíveis e em escala realista;
- evitar cubos gigantes e objetos flutuando;
- iluminação leve e performance estável.

## Performance

Produção v1.6: `app-v09.js` + `patch-v10.js` + `patch-v15-reality.js` + `patch-v16-bughunt.js` via `bootstrap-v16.js`.

- Sombras dinâmicas desligadas.
- DPR padrão limitado a aproximadamente **0,86**.
- FOV vertical: **58°**.
- Raycast de feedback restrito a elementos selecionáveis.
- Evitar transmission/refração, pós-processamento caro e luzes pontuais em excesso.

## QA v1.6

A cena expõe `window.__CASA_AUDIT_V16__`, verificando:
- presença de escadas externas;
- guard contra troca involuntária de pavimento;
- portas reais no íntimo;
- frente reaproveitada;
- painéis solares, cisterna, reservatório, sacadas e horta vertical;
- sobreposição crítica entre horta frontal, lagos, garagem, cisterna, caminho, lounge, jardim filtrante e escadas.

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
13. Sistemas sustentáveis precisam aparecer fisicamente no modelo.
14. Mudança dimensional exige atualização conjunta deste master e do 3D.
15. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
