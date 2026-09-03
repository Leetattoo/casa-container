# Casa Contreras — Auditoria espacial pré-realismo (rodada 6)

Data: 2026-09-03

## Fonte de verdade congelada
- Terreno: **10,000 × 25,000 m**.
- Casa: **7,076 × 6,058 m**.
- Vão central: **2,200 m**, fechado e integrado à área útil.
- Corredor veicular protegido: **x = +0,850..+4,700 / z = -12,300..-2,330**.
- Sacadas/decks não alteram o envelope dimensional dos containers.

## Auditoria matemática do corredor veicular
A versão `app-v04.js` foi conferida por coordenadas antes do próximo passe visual.

| Elemento | Envelope relevante | Resultado |
|---|---:|---|
| Driveway | x +0,850..+4,700 | referência |
| Carro (corpo) | x +1,820..+3,620 | dentro do corredor |
| Lago natural | x -4,210..-1,250 | **fora do corredor** |
| Lago de peixes | x -1,070..-0,030 | **fora do corredor** |
| Deck do lago | x -1,760..-0,840 | **fora do corredor** (folga mínima ~10 mm em relação a x=+0,850 considerando sinal oposto; sem interseção) |
| Passarela | x -2,305..-1,655 | **fora do corredor** |
| Filtro bio 1 | x -0,820..-0,260 | **fora do corredor** |
| Filtro bio 2 | x -0,260..+0,300 | **fora do corredor**, folga 0,550 m até x=+0,850 |
| Pomar lateral leste | x ~+4,400 | somente z >= -0,500, portanto **fora do trecho veicular protegido**, que termina em z=-2,330 |

### Regra de regressão
Nenhum novo elemento paisagístico, pedra de borda, vegetação, luminária, mobiliário, filtro, deck ou asset decorativo pode ter bounding box intersectando simultaneamente os intervalos `x=+0.850..+4.700` e `z=-12.300..-2.330`.

## Geometria da casa
Com `centerZ=+0,700` e profundidade `6,058 m`, a casa ocupa `z=-2,329..+3,729`, preservando a frente do volume exatamente no limite final do corredor veicular (`z≈-2,33`). Largura `7,076 m` resulta em `x=-3,538..+3,538`.

Isso significa que o corredor chega corretamente até a projeção frontal da casa e permite que o veículo siga do portão ao pilotis sem lago/paisagismo atravessando a trajetória.

## Gate para o passe v0.5/v0.6
O próximo refinamento de código deve priorizar, nesta ordem:
1. **Fachada igual à referência:** estrutura metálica grafite, containers com nervuras discretas, madeira quente, esquadrias piso-teto, sacadas profundas e cobertura independente.
2. **Água:** bordas menos geométricas, pedras em escalas/rotações variadas, vegetação marginal em 3 alturas, diferença visual inequívoca entre lago natural e lago de peixes.
3. **Paisagismo:** massa vegetal densa nas laterais sem estreitar visualmente o corredor do carro; copa/tronco/arbustos em camadas.
4. **Térreo/pilotis:** leitura aberta e funcional, com garagem, gourmet, oficina, depósito e lavanderia sem parecer um bloco fechado convencional.
5. **Social:** cozinha + ilha, jantar, estar e banheiro na posição da planta; evitar mobiliário genérico atravessando circulação.
6. **Íntimo:** casal, três filhos, estudo, banheiro/banheira, circulação e gamer; preservar a leitura do vão central fechado como área interna real.
7. **Microdetalhes leves:** caixilhos, puxadores, rodapés, perfis, luminárias, ripas, bancadas e variação de materiais sem assets pesados.
8. **Iluminação:** fim de tarde semelhante à prancha, interior quente e exterior neutro, sombras suaves e exposição sem estourar vidro/madeira.

## Proibições até o deploy final
- Não alterar dimensões master para melhorar enquadramento.
- Não mover lagos para dentro do corredor veicular.
- Não voltar o carro para debaixo da casa como posição inicial da prancha.
- Não transformar o vão central em pátio, átrio, corredor aberto ou vazio.
- Não usar GitHub Actions/CI para validar este passe.
- Não fazer deploy intermediário.
