# CASA_CONTRERAS_MASTER

## Geometria congelada desta fase

- Terreno-base navegável: **10,000 × 25,000 m** — retângulo exato, sem distorção em planta ou 3D.
- Envelope da casa: **7,076 m de fachada × 6,058 m de profundidade**.
- Área de projeção por pavimento: **42,866 m²**.
- **2º pavimento (social) e 3º pavimento (íntimo) têm exatamente o mesmo envelope: 7,076 × 6,058 m.**
- A largura de 7,076 m decorre de **2,438 + 2,200 + 2,438 m**: dois containers de 20 pés com faixa central útil fechada.
- Vão central: **2,200 m**, totalmente fechado e incorporado à área útil.
- Estrutura residencial: dois pavimentos habitáveis elevados sobre pilotis e térreo funcional.
- Sacadas frontais nos dois pavimentos: **7,076 × 1,800 m** como dimensão-base.

## Escala humana do walkthrough

- **1 unidade Three.js = 1,000 m**.
- Pessoa de referência: **1,750 m**.
- Olhos/câmera: **1,660 m**.
- Raio corporal: **0,270 m**.
- FOV arquitetônico: **60° vertical**.
- `H`: mostra referência humana de 1,75 m.
- `P`: alterna qualidade balanceada/alta.

## Referência de containers

- Comprimento nominal de 20 pés: **6,058 m**.
- Largura nominal: **2,438 m**.
- High Cube preferido; altura externa de referência **2,896 m**, ainda provisória até a compra do modelo real.

## Reconciliação dimensional v0.8

A prancha aprovada é visualmente soberana, mas algumas cotas nominais impressas nela são matematicamente incompatíveis com o envelope 7,076 × 6,058 m. A v0.8 preserva o desenho/posição relativa dos ambientes e corrige essas incompatibilidades sem alterar a casa.

### Medidas certificadas no 3D

- lote: **10,000 × 25,000 m**;
- 2º pavimento: **7,076 × 6,058 m**;
- 3º pavimento: **7,076 × 6,058 m**;
- igualdade 2º = 3º em largura e profundidade;
- vão central: **2,200 m**;
- piso social: **3,250 m**;
- piso íntimo: **6,250 m**;
- sacadas: **7,076 × 1,800 m**;
- corredor veicular: **3,850 × 9,970 m**, `x=0,850..4,700 / z=-12,300..-2,330`;
- banheiro social: **1,600 × 2,200 m livres**;
- banheiro íntimo: **1,600 × 2,200 m livres**;
- quartos à esquerda do pavimento íntimo: **3,400 × 2,859 m livres cada**, mantendo a composição empilhada da prancha.

### Por que os quartos deixaram de ser 3,40 × 3,40 m

Dois quartos de 3,40 m empilhados exigiriam **6,80 m de profundidade**, mas a casa inteira possui **6,058 m externos**. Com paredes externas e a divisória central, a profundidade interna disponível resulta em aproximadamente **2,859 m por quarto**. A largura de **3,400 m** foi preservada exatamente.

### Térreo reconciliado

A faixa nominal `3,20 + 2,00 + 2,00 = 7,20 m` de oficina + depósito + lavanderia também não cabe em 7,076 m externos. Na v0.8 as larguras são reduzidas proporcionalmente dentro da largura interna disponível, preservando a relação entre os três ambientes e a profundidade de **2,60 m**.

### Social

- banheiro: **1,60 × 2,20 m** certificado;
- cozinha, estar e jantar permanecem em planta aberta, respeitando a posição da prancha;
- a cota `sala/jantar 7,00 × 4,40` é tratada como zona funcional aberta, não como retângulo isolado que excluiria cozinha/banheiro.

## Performance v0.8

- qualidade balanceada por padrão;
- DPR adaptativo para reduzir GPU fill-rate;
- sombras principais mantidas em 1024 px;
- limite de luzes pontuais simultâneas;
- refração/transmission pesada de vidro/água reduzida, mantendo leitura visual;
- elementos decorativos deixam de projetar sombras desnecessárias;
- `window.__CASA_PERF__` expõe FPS, DPR e orçamento de luzes.

## Feedback v0.8

- botão principal **Enviar feedback** envia via `/api/feedback` e recebe um ID confirmado pelo servidor;
- o navegador mantém backup local enquanto o envio não é confirmado;
- em falha do endpoint, abre o formulário do GitHub na mesma aba como fallback, evitando bloqueio de popup;
- feedback inclui elemento, ID, texto, contexto, coordenadas/metadata e snapshots de QA quando disponíveis.

## Referência visual vigente

A prancha geral aprovada em 02/09/2026 continua comandando a implantação visual e programática.

### Frente do lote
- portão de pedestres;
- portão/entrada de veículo;
- faixa de acesso livre até a garagem sob pilotis;
- lago natural de banho;
- lago separado de piscicultura;
- deck/passarela;
- cisterna;
- filtros biológicos;
- canteiros e paisagismo produtivo.

### Térreo
- garagem coberta;
- oficina;
- depósito;
- lavanderia;
- gourmet com churrasqueira, bancada e mesa;
- estrutura metálica independente aparente.

### Pavimento social
- cozinha integrada com ilha;
- estar/jantar;
- banheiro social;
- grandes esquadrias;
- sacada frontal.

### Pavimento íntimo
- quarto do casal;
- quarto dos três filhos;
- bancada de estudo;
- escritório/gamer;
- banheiro superior;
- banheira compacta provisória;
- sacada frontal.

### Fundos
- estufa;
- aviário/galinheiro;
- horta horizontal;
- horta vertical;
- composteira de três baias;
- depósito de ferramentas;
- jardim filtrante/reuso;
- pomar/agrofloresta perimetral.

### Cobertura e sistemas
- cobertura independente ventilada;
- fotovoltaico;
- captação de chuva;
- reservatório operacional;
- cisterna principal no solo.

## Regras permanentes

1. Nunca distorcer o terreno de **10,000 × 25,000 m**.
2. Nunca alterar silenciosamente o envelope **7,076 × 6,058 m**.
3. 2º e 3º pavimentos sempre têm o mesmo envelope horizontal.
4. O vão central de **2,200 m** é área útil fechada.
5. Elementos externos só podem exceder o envelope quando forem sacadas, decks, escadas ou coberturas previstos.
6. Elementos importantes devem manter ID estável para feedback.
7. Alterações dimensionais exigem atualização conjunta deste master e do 3D.
8. Estrutura, fundações, cargas, hidráulica, elétrica e aprovação legal continuam conceituais até validação profissional.
9. O relatório vigente é `window.__CASA_DIMENSION_QA__`; não declarar medidas certificadas se seus testes falharem.
