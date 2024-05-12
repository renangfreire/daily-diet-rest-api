# Regras de Negócio

CRUD ALL FIRST

- [X] Deve ser possível criar um usuário -> POST USER
    - [X] Editar
    - [X] Deletar
    - [X] Pesquisar
- [X] Deve ser possível identificar o usuário entre as requisições -> Cookie Token
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta

POST MEALS

- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima -> PUTs RECIPES
- [X] Deve ser possível apagar uma refeição -> Delete meals
- [X] Deve ser possível listar todas as refeições de um usuário -> Cada usuário ter um dashboard
- [X] Deve ser possível visualizar uma única refeição -> GET Meal by id
- [ ] Deve ser possível recuperar as métricas de um usuário
    - [ ] Quantidade total de refeições registradas
    - [ ] Quantidade total de refeições dentro da dieta
    - [ ] Quantidade total de refeições fora da dieta
    - [ ] Melhor sequência de refeições dentro da dieta

    Dados detalhados em uma requisição do tipo /user/summary

- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou -> COOKIE OBRIGATÓRIO ENTRE REQS

Extra:
- [X] Deverá possuir uma rota de login e cadastro -> GET/POST/PUT em USERS

# Requisitos Não funcionais
- Utilizar o SQLITE com KNEX
- Pegar o TOKEN na porta de login -> Sem muita firula
- Cookie obrigatório para uso da API, pegar ID do usuário no login

VERSION 1.0 - With knowledge of the 2 module NodeJS Course RocketSeat