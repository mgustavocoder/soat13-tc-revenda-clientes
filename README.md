# soat13-tc-revenda-clientes

Serviço independente para cadastro e consulta de clientes. Este projeto mantém seu próprio código, dependências, infraestrutura Docker e banco MySQL; não importa código de outros serviços.

## Executar

```bash
cp .env.example .env
docker compose up -d --build
```

O serviço fica disponível em `http://localhost:3001`; o MySQL deste projeto usa a porta `3307`. Para executar sem Docker, instale as dependências com `npm install` e inicie com `npm start`.

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
