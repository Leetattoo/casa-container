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

## Sacadas e circulação vertical — v1.3

- Sacada frontal social: **7,076 × 1,800 m**.
- Sacada frontal íntima: **7,076 × 1,800 m**.
- Sacadas, decks laterais e escadas são **100% externos** ao corpo habitável e não consomem os 6,058 m de profundidade da moradia.
- Circulação vertical vigente:
  - térreo → social: **escada externa caminhável na lateral direita**, elevação **3,250 m**;
  - social → íntimo: **segundo lance externo caminhável na mesma lateral**, elevação **3,000 m**;
  - decks laterais nos níveis social e íntimo conectam os lances às sacadas/portas.
- A antiga escada interna v1.2 é removida da cena. O código v1.3 neutraliza também a zona de navegação fantasma deixada pelo RAF legado.
- O usuário deve conseguir percorrer os dois lances com WASD; 1/2/3 permanecem apenas como atalhos.

## Frente do lote — implantação vigente

A referência visual aprovada continua soberana: lago natural à esquerda, lago de peixes separado à direita, horta/canteiros entre as zonas frontais, carro junto ao portão, filtros, cisterna, deck e paisagismo denso.

Regras:
- a vaga do carro é apenas uma área compacta próxima ao portão, suficiente para um SUV grande;
- não existe piso veicular contínuo até a casa;
- lago natural e lago de peixes são separados;
- nenhum caminho pode atravessar ou ficar sob lago, deck, filtro ou outro elemento;
- deve existir caminho pedestre contínuo da frente até os fundos;
- caminho, vaga, lagos, filtros e canteiros não podem se sobrepor fisicamente.

## Térreo / pilotis — conceito aberto v1.3

Programa obrigatório:
- vaga/garagem;
- oficina;
- depósito;
- lavanderia;
- gourmet com churrasqueira, bancada, mesa e cadeiras;
- pilotis e estrutura metálica aparente.

A v1.3 remove os móveis e divisórias legados que permaneciam sobrepostos e reconstrói o térreo como **ambiente aberto, bonito e transitável**. Oficina, depósito e lavanderia viram três nichos de serviço na faixa posterior, com frente aberta; não existe paredão transversal fechando o pilotis. O gourmet ocupa a frente/centro com bancada, churrasqueira, cuba, frigobar, mesa de seis lugares, iluminação pendente e forro ripado. Deve existir passagem desimpedida entre frente e fundos.

A faixa nominal da prancha `3,20 + 2,00 + 2,00 = 7,20 m` continua incompatível com a largura interna; os três nichos são reconciliados sem alterar o envelope da casa.

## Pavimento social — v1.3

- envelope: **7,076 × 6,058 m**;
- banheiro de referência: **1,600 × 2,200 m**;
- cozinha integrada premium com marcenaria inferior e superior, torre quente/despensa, geladeira, bancada de quartzo, backsplash, cuba, metais, cooktop e coifa;
- ilha tipo waterfall com **3 banquetas altas reais**; banquetas não podem ser modeladas como cadeiras de jantar;
- jantar com mesa e seis cadeiras voltadas para a mesa;
- sala com sofá voltado para a TV, mesa de centro, parede de mídia/rack e tapete;
- grandes esquadrias;
- sacada externa;
- acesso pelo deck/escadas externos.

O banheiro social deve ser reconhecível como banheiro completo: vaso, bancada/cuba, espelho, metais, box e acessórios. A cota `sala/jantar 7,00 × 4,40` permanece tratada como zona funcional aberta.

## Pavimento íntimo

- envelope: **7,076 × 6,058 m**, idêntico ao social;
- quarto dos 3 filhos;
- quarto do casal;
- banheiro íntimo de referência **1,600 × 2,200 m**;
- escritório/gamer;
- circulação;
- sacada externa;
- acesso pelo segundo lance externo e deck íntimo.

### Quarto dos filhos

A solução vigente usa **uma treliche com 3 camas sobrepostas**, não três camas espalhadas. A treliche recebe guarda-corpos, roupa de cama e escada própria; há bancada de estudo para os três, nichos individuais e armário estreito, mantendo circulação livre.

### Quarto do casal

Cama queen, cabeceira, travesseiros, criado-mudo, iluminação, tapete, prateleira e guarda-roupa com portas/puxadores reconhecíveis. A v1.3 desloca cama/criado para reduzir interseções com o guarda-roupa.

### Banheiro íntimo

Deve conter vaso, bancada/cuba, espelho, metais, banheira compacta, toalheiro, nicho e iluminação de apoio.

### Escritório/gamer

Bancada, dois monitores, PC, cadeira e detalhes de iluminação; deve permanecer livre de sobreposição com circulação e banheiro.

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
- madeira quente em sacadas, decks, escadas e forros;
- grandes panos de vidro com caixilhos pretos;
- pilotis aparente e térreo aberto;
- cobertura independente e fotovoltaica;
- lagos com água, pedras e vegetação de borda;
- paisagismo tropical/produtivo denso;
- jardineiras nas sacadas e espreguiçadeiras no deck do lago;
- mobiliário reconhecível com volumes arredondados, peças e ferragens funcionais, evitando blocos cúbicos genéricos;
- iluminação quente arquitetônica preferencialmente emissiva, sem point lights pesadas.

## Hard audit v1.3

A cena expõe `window.__CASA_AUDIT_V13__` com verificações automáticas de:
- sobreposição entre os principais conjuntos funcionais reconstruídos;
- IDs duplicados;
- transformações inválidas/não finitas;
- caminho frontal/fundos contra lago natural, lago de peixes e vaga;
- presença dos dois lances de escada externos;
- geometria master 10 × 25 / 7,076 × 6,058 / vão 2,20.

A cena não deve ser considerada limpa se `__CASA_AUDIT_V13__.pass` for falso. O QA automático complementa, mas não substitui, inspeção visual.

## Performance

A cena vigente carrega `app-v09.js` + patches v10, v11 e v12 + módulos de reconstrução v13 via `bootstrap-v13.js`.

Regras:
- sombras dinâmicas desligadas por padrão;
- DPR reduzido/adaptativo;
- materiais e geometrias compartilhados;
- elementos repetidos preferencialmente por `InstancedMesh`;
- raycast de feedback restrito a elementos selecionáveis;
- evitar transmission/refração e pós-processamento caro;
- detalhes novos devem priorizar emissivos e geometrias simples compartilhadas em vez de luzes dinâmicas.

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
10. Cadeiras, banquetas e sofás devem respeitar orientação e função; banquetas da ilha não são cadeiras de jantar.
11. Banheiros precisam conter louças, metais, bancada/espelho e banho reconhecível, não apenas blocos genéricos.
12. Nenhum mobiliário novo pode ser aceito se atravessar outro móvel, parede ou circulação principal.
13. Elementos importantes mantêm IDs estáveis para feedback.
14. Mudança dimensional exige atualização conjunta deste master e do 3D.
15. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
