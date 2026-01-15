# Economic-indicators-dashboard

![ci](https://github.com/miguel/economic-indicators-dashboard/actions/workflows/ci.yml/badge.svg)

## Visão geral

O projeto entrega um dashboard completo de indicadores econômicos do Brasil com pipeline ETL local, banco SQLite e API REST. O frontend consome a API e exibe série temporal, estatísticas e valores mais recentes. Os dados são versionados no repositório para garantir estabilidade.

## Problema e solução

Organizações precisam visualizar indicadores econômicos sem depender de APIs externas instáveis. Este projeto fornece um fluxo fechado: dataset CSV local, ETL em Python que valida e normaliza o schema, persistência em SQLite, API com FastAPI e dashboard React com gráficos e tabela interativa.

## Arquitetura

```
+--------------------+       +-----------------+       +-----------------+
| data/indicators.csv| ----> | ETL Python      | ----> | SQLite          |
+--------------------+       +-----------------+       +-----------------+
                                                        |
                                                        v
                                              +-----------------+
                                              | FastAPI REST    |
                                              +-----------------+
                                                        |
                                                        v
                                              +-----------------+
                                              | React Dashboard |
                                              +-----------------+
```

## Estrutura do repositório

```
.
├── backend
├── frontend
├── data
├── docker-compose.yml
├── Makefile
└── .github/workflows/ci.yml
```

## Como rodar com Docker

Pré-requisitos: Docker e Docker Compose.

```bash
make dev
```

A aplicação estará disponível em:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Como rodar sem Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install poetry
poetry install
poetry run python -m app.etl.run
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Defina a variável `VITE_API_URL` se quiser apontar para outro backend.

## Endpoints

### GET /health

Resposta:
```json
{ "status": "ok" }
```

### POST /etl/run

Resposta:
```json
{ "rows_inserted": 360, "indicators": ["ipca", "selic", "usd_brl"] }
```

### GET /indicators

Resposta:
```json
{ "indicators": ["ipca", "selic", "usd_brl"] }
```

### GET /series

Exemplo:
```
/series?indicator=selic&start=2019-01-01&end=2019-12-01
```

Resposta:
```json
{
  "indicator": "selic",
  "start": "2019-01-01",
  "end": "2019-12-01",
  "data": [
    { "date": "2019-01-01", "indicator": "selic", "value": 7.12, "source": "Banco Central" }
  ]
}
```

### GET /stats

Exemplo:
```
/stats?indicator=ipca&start=2019-01-01&end=2019-12-01
```

Resposta:
```json
{
  "indicator": "ipca",
  "start": "2019-01-01",
  "end": "2019-12-01",
  "min": 4.72,
  "max": 5.11,
  "avg": 4.95,
  "pct_change": -1.23
}
```

### GET /latest

Resposta:
```json
{
  "data": [
    { "indicator": "ipca", "date": "2023-12-01", "value": 4.83, "source": "IBGE" }
  ]
}
```

## Dados

O dataset está versionado em `data/indicators.csv` com 10 anos de dados mensais para selic, ipca e usd_brl.

## Scripts úteis

```bash
make dev
make test
make lint
```

## Decisões técnicas e tradeoffs

- SQLite facilita execução local e mantém a stack leve.
- Dados locais garantem reprodutibilidade, mas não cobrem atualização automática.
- FastAPI fornece velocidade de desenvolvimento e tipagem.
- Vite e Tailwind aceleram prototipação e entrega do dashboard.

## Roadmap

- Adicionar autenticação e controle de acesso.
- Incluir novos indicadores e projeções.
- Exportação de relatórios em PDF.
- Deploy automatizado em cloud.

## Autor

Miguel Zuchelli Rodrigues
