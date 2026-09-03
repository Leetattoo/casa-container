# Casa Contreras — QA visual v0.4

Checklist de coordenação para as rodadas de refinamento antes do deploy final. Este documento não altera a geometria master; ele fecha critérios verificáveis para impedir regressões enquanto o 3D ganha detalhe.

## Geometria não negociável

- lote: 10,000 × 25,000 m;
- casa: 7,076 m de fachada × 6,058 m de profundidade;
- vão central: 2,200 m, totalmente fechado e útil nos dois pavimentos;
- dois pavimentos habitáveis elevados + térreo/pilotis funcional;
- sacadas, escadas, decks e cobertura podem ultrapassar o envelope somente onde previstos.

## Frente e circulação

A faixa veicular é zona de exclusão absoluta para paisagismo e água. Envelope vigente: `x=+0,85..+4,70` e `z=-12,30..-2,33`. Lago, pedras de borda, deck, passarela, filtros, árvores, canteiros, luminárias e mobiliário não podem intersectá-la. O veículo de referência deve permanecer visualmente próximo ao portão e a faixa até a garagem precisa ser contínua e legível.

O acesso de pedestres deve permanecer independente e reconhecível, sem conflito com a trajetória do carro.

## Composição da referência aprovada

A leitura geral deve ser de casa-container contemporânea tropical e produtiva, não de blocos genéricos: aço estrutural escuro aparente, madeira quente, grandes panos de vidro, sacadas profundas, térreo aberto/pilotis, cobertura independente, painéis fotovoltaicos e vegetação densa integrada à arquitetura.

Os dois lagos devem ser claramente diferentes: banho natural como elemento paisagístico principal e piscicultura como corpo d'água separado. Bordas orgânicas, pedras, plantas aquáticas/marginais e deck devem suavizar a geometria primitiva sem invadir circulação.

## Programa interno obrigatório

### Térreo
Garagem, oficina com bancada/ferramentas, depósito, lavanderia e gourmet com churrasqueira, bancada, mesa e circulação funcional.

### Social
Cozinha integrada com ilha, estar/jantar, banheiro social, escada e grandes esquadrias. Não transformar o vão central em vazio.

### Íntimo
Quarto do casal, quarto dos três filhos com três camas e bancada de estudo, banheiro com banheira compacta, circulação e escritório/gamer. Não transformar o vão central em vazio.

## Fundos produtivos

Devem permanecer reconhecíveis e separados funcionalmente: horta horizontal intensiva, horta vertical, estufa, aviário, composteira de três baias, depósito de ferramentas, jardim filtrante/reuso, pomar/agrofloresta perimetral e sistemas de água.

## Meta de realismo

Priorizar progressivamente: materiais com resposta física coerente; variação de rugosidade; espessura perceptível de caixilhos e estrutura; sombras de contato; iluminação quente interna contrastando com luz natural; vegetação com escala e silhuetas variadas; água com transparência/reflexo sem parecer plástico; pedras e solo sem repetição excessiva; mobiliário com proporção humana.

Evitar aumentar geometria indiscriminadamente. O objetivo é alto realismo mantendo navegação fluida e preservando os IDs de feedback.

## Interação

WASD + mouse, Shift, Espaço e níveis 1/2/3 devem continuar funcionais. Clique esquerdo deve selecionar elemento, nunca disparar ação de tiro. Elementos relevantes precisam de ID estável, categoria e coordenadas no feedback.

## Gate do deploy final

Antes do único deploy final, revisar obrigatoriamente: dimensões master; corredor veicular sem interseções; carro junto ao portão; lagos fora do corredor; distribuição dos três níveis; vão central fechado; fundos produtivos presentes; IDs de feedback preservados; ausência de erros JavaScript óbvios; `index.html` apontando para a versão final; carregamento da publicação validado.
