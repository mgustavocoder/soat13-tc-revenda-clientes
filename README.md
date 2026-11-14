# soat13-tc-revenda-clientes

Serviço independente para cadastro e consulta de clientes. Este projeto mantém seu próprio código, dependências, infraestrutura Docker e banco MySQL; não importa código de outros serviços.

## Executar

```bash
cp .env.example .env
docker compose up -d --build
```

O serviço fica disponível em `http://localhost:3001`; o MySQL deste projeto usa a porta `3307`. Para executar sem Docker, instale as dependências com `npm install` e inicie com `npm start`.

As credenciais `root/root` do `.env.example` são somente para desenvolvimento
local. Não reutilize em produção, não versione o arquivo `.env` e nunca coloque
credenciais AWS no projeto.

## API

- `GET /api/health`
- `GET /api/clientes`
- `GET /api/clientes/:cpf`
- `POST /api/clientes` com `{ "nome": "...", "cpf": "12345678901", "email": "..." }`
- `GET /internal/clientes/:cpf` para consulta via API por outros serviços

## AWS

O deploy de produção usa a imagem deste serviço no ECR e o manifesto Kubernetes
mantido em `soat13-tc-revenda-infra-k8s`. Consulte o README desse repositório
para provisionamento e deploy. Não configure chaves AWS dentro do projeto.

Em produção, o banco é um RDS MySQL privado, criptografado e separado dos bancos
dos outros serviços. O CPF e o e-mail são dados pessoais; as rotas que os
retornam devem ser acessadas somente por consumidores autorizados. A API key é
validada no API Gateway, não pelo serviço: não exponha o ALB interno nem use a
chave compartilhada como autenticação de usuário.

## Repositórios relacionados

- [Veículos](https://github.com/mgustavocoder/soat13-tc-revenda-veiculos)
- [Vendas](https://github.com/mgustavocoder/soat13-tc-revenda-vendas)
- [Infraestrutura de banco](https://github.com/mgustavocoder/soat13-tc-revenda-infra-db)
- [Infraestrutura EKS e API Gateway](https://github.com/mgustavocoder/soat13-tc-revenda-infra-k8s)
- [Arquitetura, segurança e Saga (PDF)](https://github.com/mgustavocoder/soat13-tc-revenda-infra-k8s/blob/main/docs/arquitetura-seguranca-saga.pdf)
