# L4D2 Áudio Hub 🎮🔊

Este é um site para a comunidade de **Left 4 Dead 2** que reúne uma coleção de áudios memoráveis compartilhados em grupos de WhatsApp ao longo dos anos. O objetivo é permitir que todos os jogadores possam reviver esses momentos, ouvir e fazer download dos áudios e, para membros logados, adicionar e editar novos áudios.

## ✨ Funcionalidades

- **Galeria de Áudios**: Navegue por uma coleção de áudios organizados em cards. Cada card exibe:
  - **Descrição do Áudio**: Informação sobre o conteúdo do áudio.
  - **Autor do Áudio**: Quem criou ou enviou o áudio.
  - **Player de Áudio**: Permite ouvir o áudio diretamente no navegador.
  - **Botão de Download**: Facilita o download do áudio para uso offline.
  - **Duração do Áudio**: Mostra a duração total de cada áudio.
  
- **Sistema de Login**:
  - Na rota `/login`, membros logados têm acesso a ferramentas para **adicionar**, **editar** e **excluir áudios**.
  - Gestão completa de permissões para adicionar e modificar conteúdo.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Autenticação**: Firebase
- **Estilização**: Antdesign

## 🖥️ Como Rodar o Projeto Localmente

## 1. **Clone o repositório**:

   git clone https://github.com/joaopedro-monteiro/audios-left4dead2.git
   cd l4d2-community-audio-hub
## 2. Instale as dependências:

`npm install`

## 🔑 Estrutura de Autenticação
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
