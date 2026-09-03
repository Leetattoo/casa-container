# CASA_CONTRERAS_MASTER

## Geometria congelada

- Terreno navegável: **10,000 × 25,000 m**.
- Corpo de cada pavimento habitável: **7,076 × 6,058 m**.
- Área bruta de projeção por pavimento habitável: **42,866 m²**.
- **Pavimento social e pavimento íntimo têm exatamente o mesmo envelope externo: 7,076 × 6,058 m.**
- Composição transversal: **2,438 + 2,200 + 2,438 = 7,076 m**.
- Vão/faixa central: **2,200 m**, totalmente fechado e incorporado à área útil.
- Parede externa de coordenação do walkthrough: **0,120 m**.
- Área interna aproximada antes das divisórias: **6,836 × 5,818 = 39,772 m²** por pavimento.

## Sacadas — regra permanente

- Sacada frontal social: **7,076 × 1,800 m = 12,738 m²**.
- Sacada frontal íntima: **7,076 × 1,800 m = 12,738 m²**.
- As duas sacadas são **100% externas ao corpo de 7,076 × 6,058 m**.
- A linha interna da sacada encosta na linha frontal da casa; ela se projeta **1,800 m para fora**.
- **Nenhum centímetro da sacada pode ser descontado dos 6,058 m de profundidade da moradia.**
- Escadas externas, cobertura e decks também não contam como área interna do envelope habitável.

## Containers

- Referência longitudinal de container 20 pés: **6,058 m**.
- Largura nominal usada: **2,438 m**.
- High Cube segue preferido; altura externa de referência **2,896 m**, ainda provisória até definição do fornecedor/modelo real.
- A estrutura metálica independente continua sendo o sistema conceitual global devido aos grandes recortes laterais.

## Escala humana

- **1 unidade Three.js = 1 metro**.
- Pessoa de referência: **1,750 m**.
- Olhos/câmera: **1,660 m**.
- Raio de colisão: **0,260 m**.
- FOV arquitetônico consolidado: **58° vertical**.
- `H`: mostra referência humana de 1,75 m.

## Implantação frontal

- Corredor veicular reservado: `x=0,850..4,700 / z=-12,300..-2,329`.
- Largura livre: **3,850 m**.
- Carro de referência: aproximadamente **1,82 × 4,28 m**, posicionado junto ao portão.
- Lago natural, lago de peixes, deck, passarela e filtros ficam integralmente fora da faixa veicular.
- Nenhuma árvore, pedra, canteiro, luminária ou paisagismo pode invadir essa faixa.

## Térreo / pilotis

Programa obrigatório:
- garagem/vaga coberta;
- oficina;
- depósito;
- lavanderia;
- área gourmet com churrasqueira, bancada, mesa e cadeiras;
- estrutura metálica independente aparente.

A prancha nominal soma `3,20 + 2,00 + 2,00 = 7,20 m` para oficina + depósito + lavanderia, valor maior que a largura disponível. Na cena consolidada essas três larguras são reduzidas proporcionalmente dentro da largura interna real, preservando a proporção e a profundidade de **2,60 m**.

## Pavimento social

- envelope: **7,076 × 6,058 m**;
- banheiro: **1,600 × 2,200 m livres**;
- cozinha integrada com bancada, geladeira, fogão/cooktop e ilha;
- jantar com mesa e cadeiras;
- sala com sofá, mesa de centro e TV;
- grande fachada envidraçada;
- sacada externa de 1,80 m, sem consumir área da moradia;
- escada externa de acesso, sem ocupar o envelope interno.

A cota `sala/jantar 7,00 × 4,40` da prancha é tratada como zona funcional aberta e não como um retângulo exclusivo independente da cozinha e do banheiro.

## Pavimento íntimo

- envelope: **7,076 × 6,058 m**, idêntico ao social;
- quarto dos três filhos à esquerda/fundos;
- quarto do casal à esquerda/frente;
- banheiro íntimo: **1,600 × 2,200 m livres**;
- escritório/gamer no quadrante frontal direito;
- circulação à direita;
- sacada externa de 1,80 m, sem consumir área da moradia;
- escada externa.

### Quartos

A prancha imprime dois quartos de `3,40 × 3,40 m` empilhados. Isso exigiria **6,80 m de profundidade**, incompatível com os **6,058 m externos** da casa. A solução dimensional vigente preserva **3,400 m de largura** para cada quarto e usa aproximadamente **2,859 m de profundidade livre** para cada um, mantendo a composição visual da prancha.

Mobiliário mínimo obrigatório no íntimo:
- 3 camas individuais reais no quarto dos filhos;
- bancada de estudo para os três;
- cama queen no quarto do casal;
- guarda-roupa;
- criado-mudo;
- bancada gamer, dois monitores, cadeira e PC;
- vaso, pia e banheira compacta no banheiro.

## Fundos produtivos

- estufa;
- aviário/galinheiro;
- horta horizontal em canteiros elevados;
- horta vertical;
- composteira em três baias;
- depósito de ferramentas;
- jardim filtrante / águas cinzas;
- pomar/agrofloresta perimetral.

## Cobertura e sistemas

- cobertura independente ventilada;
- fotovoltaico;
- captação de chuva;
- reservatório operacional;
- cisterna principal no solo;
- filtros biológicos;
- reuso de águas cinzas em coordenação conceitual.

## Performance v0.9

A v0.9 substitui o carregamento em cascata das versões anteriores por **uma única cena consolidada `app-v09.js`**.

Regras:
- um único `requestAnimationFrame`;
- materiais compartilhados;
- vegetação e pedras repetidas com `InstancedMesh` quando possível;
- apenas uma luz direcional com sombras;
- shadow map 1024;
- objetos decorativos sem sombras;
- vidro e água sem `transmission`/refração multipasse;
- DPR inicial 1.0 e redução automática se FPS cair;
- `Q` alterna `balanced → performance → high`;
- CSS não aplica `filter`, `backdrop-filter` ou pós-processamento sobre o canvas.

## Feedback v0.9

O fluxo antigo `/api/feedback` gravava apenas em Runtime Logs da Vercel, que não estão consultáveis pelo conector deste projeto. Esse fluxo **não é considerado persistência auditável**.

Fluxo vigente:
1. o feedback é salvo primeiro em `localStorage` com ID `CC-*`;
2. o sistema abre um Issue GitHub já preenchido;
3. o usuário confirma clicando em **Submit new issue** no GitHub;
4. somente depois disso o feedback é considerado remoto e consultável.

- `F` copia/exporta todos os feedbacks locais, inclusive chaves de versões anteriores, para permitir recuperação dos feedbacks que não viraram Issues.
- Nenhuma interface deve dizer “feedback enviado” antes de existir Issue remoto ou outra persistência realmente consultável.

## Referência visual vigente

A prancha aprovada em 02/09/2026 continua sendo a referência visual e programática: aço/container escuro, madeira quente, grandes panos de vidro, pilotis, sacadas, cobertura solar, lagos separados, deck, paisagismo produtivo denso e fundos agroprodutivos.

## Regras permanentes

1. Nunca distorcer o terreno **10 × 25 m**.
2. Nunca alterar silenciosamente o corpo **7,076 × 6,058 m**.
3. Social e íntimo sempre têm o mesmo envelope.
4. O vão central **2,200 m** é área útil fechada.
5. Sacadas são externas e não reduzem a profundidade interna.
6. Corredor veicular deve permanecer 100% livre.
7. Elementos importantes mantêm IDs estáveis para feedback.
8. Mudança dimensional exige atualização conjunta deste master e do 3D.
9. Estrutura, fundações, reforços, hidráulica, elétrica, vento, corrosão e legalização continuam conceituais até validação profissional.
