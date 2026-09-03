# CASA_CONTRERAS_MASTER

## Geometria congelada

- Terreno: **10,000 × 25,000 m**.
- Corpo de cada pavimento habitável: **7,076 × 6,058 m**.
- Área bruta por pavimento: **42,866 m²**.
- Social e íntimo têm exatamente o mesmo envelope.
- Composição transversal: **2,438 + 2,200 + 2,438 = 7,076 m**.
- Faixa central de **2,200 m**: fechada, útil e incorporada à moradia.
- Parede externa de coordenação no walkthrough: **0,120 m**.
- Área interna aproximada antes das divisórias: **6,836 × 5,818 = 39,772 m²**.
- 1 unidade Three.js = **1 metro**.
- Pessoa de referência: **1,750 m**; olhos/câmera: **1,660 m**.

## Sacadas e circulação vertical

- Sacada frontal social: **7,076 × 1,800 m**.
- Sacada frontal íntima: **7,076 × 1,800 m**.
- Sacadas, decks laterais e escadas são **100% externos** ao corpo habitável e não consomem os 6,058 m de profundidade da moradia.
- A v1.1 usa dois lances externos caminháveis na lateral direita, ligados por deck lateral:
  - térreo → social: elevação **3,250 m**;
  - social → íntimo: elevação **3,000 m**.
- O usuário deve conseguir percorrer os lances com WASD; os atalhos 1/2/3 continuam disponíveis apenas como conveniência.

## Frente do lote — implantação v1.1

A referência visual aprovada continua soberana: lago natural à esquerda, lago de peixes separado à direita, horta/canteiros entre as zonas frontais, carro junto ao portão, filtros, cisterna, deck e paisagismo denso.

Regras:
- a vaga do carro é apenas uma área compacta próxima ao portão, suficiente para um SUV grande;
- não existe piso veicular contínuo até a casa;
- lago natural e lago de peixes são separados;
- nenhum caminho pode atravessar ou ficar sob lago, deck, filtro ou outro elemento;
- deve existir caminho pedestre contínuo da frente até os fundos;
- caminho, vaga, lagos, filtros e canteiros não podem se sobrepor fisicamente.

## Térreo / pilotis

Programa obrigatório:
- vaga/garagem;
- oficina;
- depósito;
- lavanderia;
- gourmet com churrasqueira, bancada, mesa e cadeiras;
- pilotis e estrutura metálica aparente.

O térreo deve permanecer visualmente aberto. O antigo paredão transversal foi removido. A faixa nominal da prancha `3,20 + 2,00 + 2,00 = 7,20 m` para oficina + depósito + lavanderia é incompatível com a largura interna; as larguras são reconciliadas proporcionalmente sem alterar o envelope da casa.

## Pavimento social

- envelope: **7,076 × 6,058 m**;
- banheiro de referência: **1,600 × 2,200 m**;
- cozinha integrada com bancada, geladeira, fogão/cooktop e ilha;
- jantar com mesa e seis cadeiras;
- sala com sofá, mesa de centro e TV;
- grandes esquadrias;
- sacada externa;
- acesso por escada real caminhável.

A cota `sala/jantar 7,00 × 4,40` é tratada como zona funcional aberta, não como retângulo isolado.

## Pavimento íntimo

- envelope: **7,076 × 6,058 m**, idêntico ao social;
- quarto dos 3 filhos;
- quarto do casal;
- banheiro íntimo de referência **1,600 × 2,200 m**;
- escritório/gamer;
- circulação;
- sacada externa;
- acesso por escada real caminhável.

### Quarto dos filhos

A solução vigente usa **uma treliche com 3 camas sobrepostas**, não três camas espalhadas pelo quarto. Deve existir bancada de estudo para os três e circulação livre.

### Quartos e cotas incompatíveis da prancha

A prancha imprime dois quartos de `3,40 × 3,40 m` empilhados, o que exigiria **6,80 m** de profundidade. Isso não cabe em **6,058 m externos**. A solução dimensional preserva **3,400 m de largura** e usa aproximadamente **2,859 m de profundidade livre** por quarto até revisão arquitetônica profissional.

## Fundos produtivos

Distribuição de referência:
- estufa no setor traseiro esquerdo;
- aviário/galinheiro no setor traseiro central;
- depósito de ferramentas no setor traseiro direito;
- horta horizontal central;
- horta vertical lateral;
- composteira em três baias;
- jardim filtrante/reuso;
- pomar/agrofloresta perimetral.

O caminho vindo da frente deve alcançar essa área sem atravessar canteiros, lagos ou construções.

## Linguagem visual

Objetivo: aproximar progressivamente o walkthrough da prancha/perspectiva aprovada:
- estrutura e containers em aço grafite escuro;
- madeira quente em sacadas, decks e escadas;
- grandes panos de vidro com caixilhos pretos;
- pilotis aparente;
- cobertura independente e fotovoltaica;
- lagos com água, pedras e vegetação de borda;
- paisagismo tropical/produtivo denso;
- mobiliário reconhecível, evitando blocos cúbicos genéricos;
- iluminação quente arquitetônica sem sacrificar FPS.

## Performance

- cena base consolidada em `app-v09.js`, seguida apenas pelos patches vigentes `patch-v10.js` e `patch-v11.js` via `bootstrap-v11.js`;
- sombras dinâmicas desligadas por padrão;
- DPR reduzido/adaptativo;
- materiais e geometrias compartilhados;
- elementos repetidos preferencialmente por `InstancedMesh`;
- raycast de feedback restrito a elementos selecionáveis;
- evitar transmission/refração e pós-processamento caro.

## Feedback

- feedback é salvo primeiro em `localStorage`;
- em seguida é aberto um Issue GitHub preenchido;
- para persistência remota consultável, o usuário confirma **Submit new issue**;
- `F` copia/exporta feedbacks locais existentes.

## Regras permanentes

1. Nunca distorcer o terreno **10 × 25 m**.
2. Nunca alterar silenciosamente o corpo **7,076 × 6,058 m**.
3. Social e íntimo sempre têm o mesmo envelope.
4. O vão central **2,200 m** é área útil fechada.
5. Sacadas e escadas externas não reduzem área interna.
6. A vaga não deve reservar faixa pavimentada desnecessária até a casa.
7. Deve existir circulação pedestre contínua frente → fundos.
8. Nenhum caminho pode passar por baixo ou através de lagos.
9. Escadas devem existir visualmente e ser navegáveis entre os três níveis.
10. Elementos importantes mantêm IDs estáveis para feedback.
11. Mudança dimensional exige atualização conjunta deste master e do 3D.
12. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
