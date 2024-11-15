# Fitness tracker

Fitness tracker is a hybrid
app that let you track calories, weight and
other related health related metrics in a
consistent manner.

It has been done in the context of the CNAM's NSY209 project

![ui-demo](docs/img/ui-presentation.png)

## Installation

### Create a .env file.

The `.env` file is shared between frontend and backend.
Vite [.env files properties](https://vitejs.dev/guide/env-and-mode) ensure
that no backend env variables will be exposed to the frontend.

```bash
ENVIRONMENT="development" # or production
PW_SECRET="pw_secret_UNSAFE_DO_NOT_USE_IN_PRODUCTION" #  secret used to encrypt password in the database, TO CHANGE FOR PRODUCTION
JWT_SECRET="jwt_secret_UNSAFE_DO_NOT_USE_IN_PRODUCTION" # key used to encrypt/decrypt jwt tokens, TO CHANGE FOR PRODUCTION
MONGODB_USERNAME="username" # username of the mongo db database (see docker compose files)
MONGODB_PASSWORD="Pa55W0rd" # password of the mongodb database (see docker compose file)
MONGO_DB_CONNECTION_STRING="mongodb://${MONDODB_USER}:${MONGODB_PASSWORD}@mongodb:27017" # connection string to the mongodb database, no need to change usually
FRONTEND_DOMAIN="http://localhost:8100" # frontend domain, used by cors policies
DOCKER_FIREBASE_TOKEN_FILE="./firebase_token_file.json" # used to send notification via firebase, you should provide your own. The file is used by the docker-compose files
FIREBASE_TOKEN_FILE="/run/secrets/firebase_token" # no need to change, provided by docker compose (see: https://docs.docker.com/compose/use-secrets/#simple)

# used by the frontend at build
VITE_BACKEND_DOMAIN="http://localhost:8000"
```


### Install 

```bash
# Install back components 
cd backend && poetry install

# Install front components
cd ../frontend && npm ci

# Launch back with
docker compose -f docker-compose-dev.yml \ # or docker-compose-prod.yml
    up --build

# Launch front with
poetry run uvicorn fitness.main:app --reload

# Launc android app with
ionic cap android run
```

### Usage

- frontend : [http://localhost:8100/](http://localhost:8100/)
- backend docs : [http://localhost:8000/docs](http://localhost:8000/docs)
- mongo-express (only in development build) : [http://localhost:8888](http://localhost:8888/)
