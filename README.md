# L4D2 Áudio Hub 🎮🔊 - https://audiosl4d2.netlify.app/

Este é um site para a comunidade de **Left 4 Dead 2** que reúne uma coleção de áudios memoráveis compartilhados em grupos de WhatsApp ao longo dos anos. O objetivo é permitir que todos os jogadores possam reviver esses momentos, ouvir e fazer download dos áudios e, para membros logados, adicionar e editar novos áudios.

## ✨ Funcionalidades

- **Galeria de áudios** em cards responsivos (1 a 4 colunas conforme a tela), com:
  - **Player próprio**: play/pause, barra de progresso arrastável, tempo decorrido, repetição e apenas um áudio tocando por vez. Os arquivos só são baixados quando você dá play (economiza dados no celular).
  - **Botão de download próprio**: baixa o arquivo via `fetch` + Blob, sem depender do menu do player nativo. No iPhone abre o compartilhamento do iOS, que é o caminho que realmente salva em Arquivos ou manda direto no WhatsApp.
  - **Botão de compartilhar**: usa a Web Share API (com o arquivo quando o aparelho permite) e cai para copiar o link quando não dá.
  - **Favoritos** salvos no próprio dispositivo, sem precisar de login.
  - **Autor clicável**: filtra a lista por aquele autor.
- **Busca e filtros**: busca por descrição e autor ignorando acentos e maiúsculas, aceitando várias palavras em qualquer ordem; filtro por vários autores ao mesmo tempo; filtro de favoritos; e contador de resultados com "limpar filtros".
- **Ordenação**: mais recentes, mais antigos, descrição (A-Z e Z-A), mais curtos, mais longos e por autor.
- **App instalável (PWA)**: botão "Instalar app" no cabeçalho (Chrome/Edge no Android e no desktop) e instruções passo a passo no iPhone. Uma vez instalado, abre em tela cheia, tem ícone próprio e funciona offline — inclusive reouvindo os últimos áudios já tocados, graças ao service worker.
- **Tela de envio**: área de arrastar e soltar, prévia do áudio antes de publicar, duração calculada automaticamente, validação de formato/tamanho e barra de progresso real do upload.
- **Sistema de login**:
  - Na rota `/login`, membros logados têm acesso a ferramentas para **adicionar**, **editar** e **excluir áudios**.
  - Gestão completa de permissões para adicionar e modificar conteúdo.

## 🚀 Tecnologias utilizadas

- **Frontend**: React + TypeScript (Create React App)
- **Backend**: Firebase (Firestore, Storage e Authentication)
- **Estilização**: CSS próprio com tokens de tema (dark) + Ant Design nos modais, selects e inputs
- **PWA**: manifest + service worker próprio (`public/sw.js`)

## 🖥️ Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/joaopedro-monteiro/audios-left4dead2.git
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

As credenciais ficam fora do Git. Copie o arquivo de exemplo e preencha com os dados do seu projeto
(Console do Firebase > Configurações do projeto > Seus apps > Configuração do SDK):

```bash
cp .env.example .env.local
```

O arquivo `src/infrastructure/services/firebaseConnection.ts` só lê essas variáveis — nenhuma chave
fica escrita no código.

### 4. Rode o projeto

```bash
npm start
```

## 🚢 Deploy contínuo (Netlify)

O `netlify.toml` já traz o comando de build (`npm run build`), a pasta publicada (`build`), a versão
do Node e os cabeçalhos de cache. Para ligar o deploy automático:

1. Na Netlify: *Site configuration > Build & deploy > Continuous deployment* e conecte o repositório
   do GitHub (ou crie o site em *Add new site > Import an existing project*).
2. Em *Branches and deploy contexts*, deixe a **production branch** como `master` — é a branch
   principal deste repositório.
3. Em *Site configuration > Environment variables*, cadastre as mesmas variáveis do `.env.local`
   (`REACT_APP_FIREBASE_*`). Sem elas o build passa, mas o site sobe sem Firebase.
4. Pronto: cada push na `master` publica sozinho e cada Pull Request ganha um Deploy Preview.

> Os valores `REACT_APP_*` entram no JavaScript enviado ao navegador — o que é esperado para a
> configuração web do Firebase, que é pública. Quem protege os dados são as regras do Firestore e
> do Storage.

## ⬇️ CORS do Storage (necessário para o botão de download)

O botão de download baixa o arquivo com `fetch` + Blob — é o que permite salvar o áudio de verdade
(e, no iPhone, abrir o compartilhamento do iOS). Para isso o bucket do Storage precisa liberar CORS
para o domínio do site; sem essa liberação o botão continua funcionando, mas cai no plano B de abrir
o áudio em outra aba.

A configuração fica em `cors.json`. Para aplicar, o caminho mais rápido é o
[Cloud Shell](https://console.cloud.google.com/) (já vem autenticado e com o `gsutil` instalado) —
faça upload do `cors.json` e rode:

```bash
gsutil cors set cors.json gs://audios-left4dead.appspot.com
```

Para conferir se pegou:

```bash
gsutil cors get gs://audios-left4dead.appspot.com
```

Os áudios já são públicos (qualquer pessoa com o link ouve), então liberar leitura por CORS não expõe
nada de novo. Se quiser que os Deploy Previews da Netlify também consigam baixar, acrescente `"*"` à
lista de `origin`, já que os endereços de preview mudam a cada PR.

## 🔑 Estrutura de autenticação

O sistema de autenticação protege as rotas de criação, edição e exclusão de áudios. Apenas usuários logados podem acessar essas funcionalidades, e o login pode ser feito diretamente na página /login.

## 👤 Contribuindo

Contribuições são bem-vindas! Se tiver ideias de melhorias ou encontrar algum bug, sinta-se à vontade para abrir uma issue ou enviar um Pull Request.

Passos para Contribuir:

Fork o repositório

Crie uma branch para sua feature:

`git checkout -b minha-feature`

Commit suas mudanças:

`git commit -m 'Adiciona minha feature'`

Faça o push para a branch:

`git push origin minha-feature`

Abra um Pull Request

## 📜 Licença

Este projeto é licenciado sob a Licença MIT.
