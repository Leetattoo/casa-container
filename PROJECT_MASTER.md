# CASA_CONTRERAS_MASTER

## Geometria congelada desta fase

- Terreno-base navegável: **10,000 × 25,000 m** — retângulo exato, sem distorção em planta ou 3D.
- Orientação atual da casa conforme a prancha geral aprovada: **7,076 m de fachada × 6,058 m de profundidade**.
- Área de projeção desse envelope: **42,866 m²**.
- A largura de 7,076 m decorre da composição nominal **2,438 + 2,200 + 2,438 m**: dois containers de 20 pés lado a lado com o vão central útil fechado.
- Vão central entre containers: **2,200 m**, totalmente fechado e incorporado à área útil. Nunca representar como vazio, átrio ou corredor externo.
- Estrutura residencial: dois pavimentos habitáveis elevados sobre pilotis.
- Térreo funcional sob a casa.
- Sacadas frontais nos dois pavimentos: **7,076 × 1,800 m** como dimensão-base da prancha; prolongamentos laterais são elementos externos adicionais quando previstos.

## Escala humana do walkthrough

- Regra do motor: **1 unidade Three.js = 1,000 m**.
- Personagem de referência para percepção e colisão: **1,750 m de altura**.
- Altura dos olhos/câmera: **1,660 m**.
- Raio corporal/ombros usado na navegação: **0,270 m**.
- Campo de visão arquitetônico: **60° vertical**. O antigo FOV de 70° ampliava artificialmente a percepção dos espaços em monitor widescreen.
- Tecla `H` no tour mostra uma régua humana de 1,75 m para inspeção visual.

## Referência de containers

- Comprimento nominal de 20 pés usado no modelo: **6,058 m**.
- Largura nominal usada por container: **2,438 m**.
- High Cube permanece a solução preferida; altura externa de referência **2,896 m**, mas a aquisição/modelo exato do container ainda não está congelado. Portanto a altura vertical do invólucro 3D continua **provisória**, não deve ser tratada como medida executiva.

## Auditoria dimensional v0.7

### Certificado no modelo
- lote: **10,000 × 25,000 m**;
- envelope horizontal dos pavimentos: **7,076 × 6,058 m**;
- vão central: **2,200 m**;
- topo do piso social: **3,250 m**;
- topo do piso íntimo: **6,250 m**;
- sacada-base: **7,076 × 1,800 m**;
- corredor veicular: **3,850 × 9,970 m**, envelope `x=0,850..4,700 / z=-12,300..-2,330`;
- escala humana e FOV descritos acima.

### Ainda NÃO certificado
As cotas dos ambientes mostradas na prancha são a referência nominal, porém as divisórias internas do tour atual ainda não reproduzem todas essas cotas exatamente. A auditoria detectou, em especial, que os banheiros modelados não coincidem ainda com **1,60 × 2,20 m**. Portanto:

- a geometria externa e a implantação podem ser usadas para coordenação espacial desta fase;
- a planta interna atual **não é ainda a planta dimensional final**;
- nenhuma resposta futura deve afirmar que “todas as medidas dos cômodos estão exatas” até a reconciliação das divisórias;
- a próxima revisão dimensional deve reconstruir os ambientes a partir da prancha, preservando simultaneamente o envelope 7,076 × 6,058 m e o sistema estrutural.

## Referência visual vigente

A prancha geral aprovada pelo usuário em 02/09/2026 passa a comandar a implantação visual e programática do walkthrough 3D. O modelo deve reproduzir, dentro das medidas reais, as seguintes relações:

### Frente do lote
- portão de pedestres
- portão/entrada de veículo
- faixa de acesso ao carro até a garagem sob pilotis
- lago natural de banho
- lago separado para piscicultura
- deck/passarela no lago natural
- cisterna de captação de chuva
- filtro biológico dos lagos
- canteiros frontais de hortaliças
- paisagismo produtivo e árvores junto aos muros

### Casa / térreo
- garagem coberta
- oficina real com bancada e ferramentas
- depósito
- lavanderia
- área gourmet ampla com churrasqueira, bancada e mesa
- estrutura metálica independente aparente

### Pavimento social
- cozinha integrada com ilha
- sala de estar e jantar
- banheiro social
- grandes esquadrias
- sacada frontal

### Pavimento íntimo
- quarto do casal
- quarto dos três filhos
- bancada de estudo para os filhos
- escritório/gamer
- banheiro superior
- banheira compacta provisória
- sacada frontal

### Fundos do lote
- estufa
- aviário/galinheiro
- horta horizontal intensiva em canteiros elevados
- horta vertical
- composteira de três baias
- depósito de ferramentas
- jardim filtrante / sistema de águas cinzas
- pomar/agrofloresta e árvores frutíferas no perímetro

### Cobertura e sistemas
- cobertura independente ventilada
- painéis fotovoltaicos
- captação de chuva por cobertura/calhas
- reservatório operacional pequeno quando necessário
- cisterna principal no solo

## Regras permanentes

1. Nenhuma renderização ou walkthrough pode distorcer o terreno de **10,000 × 25,000 m**.
2. A casa nesta versão usa o envelope **7,076 × 6,058 m**.
3. O vão central de **2,200 m** é área útil fechada.
4. Elementos externos podem avançar além do envelope da casa somente quando forem sacadas, decks, escadas ou coberturas explicitamente previstas.
5. Todo elemento importante do 3D deve possuir ID estável para feedback contextual.
6. Feedbacks do tour devem registrar ID, categoria, posição do clique, posição da câmera e versão do projeto.
7. Mudanças dimensionais não podem ocorrer silenciosamente: devem atualizar este master e o modelo 3D juntos.
8. Estrutura, reforços, fundações, cargas, hidráulica, elétrica e legalização permanecem conceituais até validação profissional.
9. Nenhuma planta pode ser declarada dimensionalmente fechada enquanto o relatório `window.__CASA_DIMENSION_QA__` indicar `roomPlanCertified: false`.
