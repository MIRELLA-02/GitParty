
# 🎊 GitParty - Gerenciamento de Festas e Eventos

A GitParty uma empresa que organiza palestras, workshops e treinamentos para profissionais da área de tecnologia.

Este projeto tem como objetivo o desenvolvimento de uma API voltada ao gerenciamento de eventos e inscrições da empresa GitParty, surgindo como solução para os problemas causados pelo controle manual dessas informações.
A aplicação possibilita administrar usuários, eventos e participações de maneira estruturada e automatizada, garantindo maior organização e evitando falhas como registros duplicados e número de participantes acima do permitido.

# 🎯 Objetivo

Criar um sistema backend capaz de:

- Controlar inscrições em eventos
- Evitar inconsistências nos dados
- Aplicar regras de negócio automaticamente
- Facilitar a integração com aplicações frontend


# 🚀 Tecnologias Utilizadas
  
- Node.js
- Prisma 
- MariaDb
- Java Script

# 🧱 Modelagem das Entidades
👤 Usuários - Representam os participantes dos eventos.

- id
- nome
- email
- senha
- data_cadastro


📅 Eventos - Representam os eventos disponíveis.

- id
- titulo
- descricao
- data_evento
- local
- capacidade_maxima
- status (ativo, cancelado, encerrado)

📝 Inscrições- Relacionam usuários aos eventos.

- id
- usuario_id
- evento_id
- data_inscricao
- status (confirmada, lista_espera, cancelada)

  # 🧩 Como Rodar o Projeto

1. Faça o clone do repositório:
git clone ("colar o link do repositório")

2. Entre na pasta do projeto:
cd gitparty

3. Instale as dependências necessárias:
npm install

4. Execute a aplicação:
npm start

Ou, se estiver utilizando nodemon:
npm run dev

  
