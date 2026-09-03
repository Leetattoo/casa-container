# Casa Contreras — revisão final da etapa navegável

Data: 2026-09-03
Release: v0.5-final

## Gate dimensional

- Terreno: 10,000 × 25,000 m — preservado.
- Casa: 7,076 × 6,058 m — preservada.
- Vão central: 2,200 m — fechado e integrante da área útil.
- Dois pavimentos habitáveis elevados + térreo/pilotis funcional — preservados.
- Sacadas externas ao envelope principal — preservadas.

## Gate de circulação veicular

- Envelope protegido: x=+0,850..+4,700 / z=-12,300..-2,330.
- Driveway: 3,85 m de largura.
- Veículo de referência posicionado praticamente junto ao portão.
- Lago natural, lago de peixes, deck, passarela, filtros e paisagismo frontal mantidos fora do corredor veicular.

## Gate de programa interno

### Térreo
- garagem coberta sob pilotis
- oficina
- depósito
- lavanderia
- área gourmet

### Pavimento social
- cozinha com bancada e ilha
- jantar
- sala
- banheiro social
- circulação/escada

### Pavimento íntimo
- quarto do casal
- quarto dos três filhos
- bancada de estudo
- escritório/gamer
- banheiro superior com banheira compacta
- circulação/escada

## Gate de sistemas externos

Presentes no modelo:
- lago natural de banho
- lago de peixes separado
- deck/passarela
- pomar/agrofloresta perimetral
- horta horizontal
- horta vertical
- estufa
- aviário
- composteira
- cisterna de chuva
- filtros biológicos
- jardim filtrante/reuso
- depósito de ferramentas
- painéis fotovoltaicos

## Gate de interação

- WASD + mouse preservados.
- Shift para correr e espaço para pular preservados.
- atalhos 1/2/3 para níveis preservados nesta etapa.
- seleção por clique preservada.
- feedback contextual com ID, categoria, coordenadas do clique e posição da câmera preservado.

## Correção crítica da revisão final

A revisão detectou um erro sintático acumulado na declaração do material do reservatório em `app-v04.js`. A release final passa por `app-final-loader.js`, que corrige explicitamente esse trecho antes de importar a cena e falha de forma visível caso a correção não seja aplicada.

## Status

APROVADO PARA DEPLOY desta etapa conceitual/navegável.

Este gate não transforma o modelo em projeto executivo: estrutura, fundações, reforços dos containers, instalações, impermeabilização e atendimento legal permanecem sujeitos a profissionais habilitados e ao lote definitivo.
