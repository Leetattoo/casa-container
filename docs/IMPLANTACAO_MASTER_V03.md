# Casa Contreras — Implantação Master v0.3

Este documento é uma restrição executável de projeto para as próximas revisões do walkthrough 3D. Ele não substitui cálculo/validação profissional.

## Geometria congelada

- Terreno: **10,000 × 25,000 m**, sem distorção de proporção.
- Casa: **7,076 m de fachada × 6,058 m de profundidade**.
- Vão central entre containers: **2,200 m totalmente fechado, coberto e integrado à área útil em ambos os pavimentos habitáveis**. Nunca representar como pátio, átrio, corredor externo ou vazio.
- Térreo/pilotis: garagem + oficina + depósito + lavanderia + gourmet.
- Pavimento social: cozinha + ilha + jantar/estar + banheiro + circulação/escada.
- Pavimento íntimo: casal + quarto dos três filhos + banheiro + circulação + escritório/gamer.

## Corredor veicular — regra de não invasão

A implantação v0.2 posicionou o lago de peixes em conflito visual/espacial com a entrada do carro. Isso fica explicitamente proibido a partir da v0.3.

- Portão veicular permanece no setor direito da fachada do lote.
- Reservar corredor contínuo do portão até a garagem sob pilotis.
- Envelope operacional mínimo a manter livre no modelo: **x = +0,85 m até +4,70 m**, desde **z = -12,30 m até a frente da garagem/casa**.
- Dentro desse envelope não podem existir lago, pedras de borda, deck, árvore, canteiro, filtro, luminária, cisterna, mobiliário ou qualquer geometria que impeça entrada/manobra.
- O veículo de referência deve aparecer **próximo ao portão frontal**, demonstrando visualmente que pode estacionar praticamente colado ao portão sem bloquear o restante da implantação.
- O pavimento/driveway deve ser contínuo, legível e visualmente distinto do paisagismo.

## Lagos e frente do terreno

- Lago natural de banho: setor frontal/esquerdo, organicamente integrado ao jardim, sem invadir corredor veicular.
- Lago de peixes: separado hidraulicamente/visualmente do lago de banho e deslocado integralmente para fora do corredor veicular.
- Deck/passarela: associado ao lago natural e também fora do corredor veicular.
- Pedras, macrófitas e vegetação de borda devem respeitar o mesmo envelope de não invasão — não basta apenas a malha de água ficar fora.

## Linguagem arquitetônica da referência

O modelo deve abandonar aparência de blocos genéricos e convergir para a prancha aprovada: estrutura metálica escura aparente, madeira quente em decks/brises, grandes panos de vidro, volumes de container escuros, sacadas contínuas/expressivas, cobertura independente leve, fotovoltaico, térreo aberto e paisagismo produtivo denso. Materiais devem usar resposta física coerente (roughness/metalness/transmission), sombras suaves e iluminação natural quente, mantendo desempenho navegável.

## Paisagismo produtivo e sistemas

Preservar e detalhar: pomar/agrofloresta perimetral, horta horizontal, horta vertical, estufa, aviário, composteira de três baias, depósito de ferramentas, cisterna/captação de chuva, filtros biológicos, jardim filtrante/reuso e iluminação externa. Nenhum desses sistemas pode comprometer circulação de carro ou pedestres.

## Critérios de aceite antes do deploy final

1. Nenhuma geometria do lago ou paisagismo cruza o corredor veicular.
2. Carro próximo ao portão e caminho até pilotis claramente possível.
3. Terreno continua exatamente 10 × 25 m e casa 7,076 × 6,058 m.
4. Vão central de 2,20 m permanece fechado e útil.
5. Distribuição dos três níveis corresponde à planta vigente.
6. Fachadas e sacadas lembram inequivocamente a referência aprovada.
7. Água, vegetação, aço, madeira, vidro e iluminação deixam de ter aparência de primitivas cruas.
8. WASD, mouse, colisões, troca de nível e feedback contextual continuam funcionando.
9. Sem GitHub Actions/CI desnecessários durante refinamento.
10. Deploy somente após revisão acumulada final.
