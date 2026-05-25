# Consulta DDD

Aplicativo mobile feito com React Native, Expo e TypeScript para consultar a UF e as cidades associadas a um codigo DDD usando a [Brasil API](https://brasilapi.com.br/).

## Visao geral

O app oferece uma interface simples para informar um DDD com 2 digitos e buscar:

- a sigla da UF correspondente
- a lista de cidades vinculadas ao DDD consultado

O fluxo da tela foi pensado para cobrir os estados principais da experiencia:

- estado inicial sem consulta realizada
- carregamento enquanto a requisicao esta em andamento
- exibicao dos dados retornados pela API
- tratamento de erro para DDD invalido ou falha na consulta

## Funcionalidades

- validacao local para aceitar apenas 2 digitos numericos
- consumo da API `https://brasilapi.com.br/api/ddd/v1/:ddd`
- feedback visual durante a busca
- exibicao da quantidade de cidades encontradas
- tratamento de mensagens de erro retornadas pela API
- interface mobile com componentes nativos do React Native

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- React Hooks (`useState` e `useEffect`)
- `fetch` para consumo de API REST

## Estrutura do projeto

```text
.
|-- App.tsx
|-- app.json
|-- index.ts
|-- src
|   `-- types
|       `-- brasilApi.ts
|-- package.json
`-- tsconfig.json
```

Arquivos principais:

- `App.tsx`: tela principal, validacao do DDD, requisicao HTTP e renderizacao dos estados da interface
- `src/types/brasilApi.ts`: contratos TypeScript para a resposta de sucesso e erro da Brasil API
- `index.ts`: ponto de entrada da aplicacao com registro do app
- `app.json`: configuracoes do projeto Expo

## Pre-requisitos

Antes de executar, garanta que voce tenha instalado:

- Node.js em versao LTS
- npm
- Expo Go no dispositivo fisico ou emulador Android/iOS configurado

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento do Expo:

```bash
npm start
```

3. Escolha onde abrir o app:

- pressione `a` para Android
- pressione `w` para Web
- escaneie o QR Code com o Expo Go no celular

Se preferir, voce tambem pode usar os scripts dedicados:

```bash
npm run android
npm run ios
npm run web
```

Observacao: a execucao em iOS depende de um ambiente compativel com o simulador da Apple ou de testes via Expo Go.

## Scripts disponiveis

- `npm start`: inicia o Expo no modo de desenvolvimento
- `npm run android`: abre o projeto no Android
- `npm run ios`: abre o projeto no iOS
- `npm run web`: executa a versao web via Expo

## Como usar

1. Digite um DDD com exatamente 2 numeros.
2. Toque em `Buscar localidades`.
3. Aguarde a consulta.
4. Veja a UF retornada e a lista de cidades associadas.

Exemplo de consulta:

- entrada: `11`
- saida esperada: UF correspondente e cidades atendidas por esse DDD

## Integracao com API

O aplicativo consome o endpoint publico abaixo:

```text
GET https://brasilapi.com.br/api/ddd/v1/{ddd}
```

Formato esperado de sucesso:

```json
{
  "state": "SP",
  "cities": ["Sao Paulo", "Guarulhos"]
}
```

Formato de erro tratado pelo projeto:

```json
{
  "message": "Todos os services estao indisponiveis.",
  "name": "ServiceException",
  "type": "service_error"
}
```

## Regras de comportamento implementadas

- o campo aceita apenas caracteres numericos
- o valor e limitado a 2 digitos
- consultas invalidas sao barradas antes da chamada HTTP
- cada nova busca limpa o resultado anterior
- a interface impede a interacao repetida enquanto a busca esta em andamento

## Possiveis melhorias

- adicionar testes unitarios e de interface
- permitir historico de consultas recentes
- incluir acessibilidade mais detalhada nos componentes
- tratar estados offline explicitamente
- extrair a camada de servico da API para facilitar manutencao e testes

## Troubleshooting

- Se o app nao abrir no dispositivo, confira se o celular e a maquina estao na mesma rede ao usar Expo Go.
- Se a consulta falhar, verifique sua conexao com a internet e a disponibilidade da Brasil API.
- Se houver erro de dependencias, remova `node_modules` e rode `npm install` novamente.

## Licenca

Este projeto pode ser adaptado conforme a necessidade do time ou da aplicacao final.
