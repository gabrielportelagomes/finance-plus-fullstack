## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Populate `.env` file based on `.env.example`. `REACT_APP_BACKEND_URL` should point to your API server [(finance-plus-back)](https://github.com/gabrielportelagomes/finance-plus-fullstack/tree/main/back-end).

4. Run the back-end in a development environment:

```bash
npm run start
```

## Building and starting for production

```bash
npm run build
npm start
```

## Running application locally

`.env` must be changed if you and to run the application locally. You can populate files based on `.env.example` file, but you need to consider the following:

- Running application locally (postgres and node):

Add your postgres credentials and make sure to create given database before running the application.

## What to do when add new ENV VARIABLES

Please notice that every ENV that should be available on browser should start with `REACT_APP_` prefix. There are several things you need to do when you add new ENV VARIABLES:

- Add them to `.env.example` file
- Add them to your local `.env` file
- Add them to your docker-compose.yml file (just the name, not the value). Only envs listed in the environment section will be exposed to your docker container.
- Add them (prod version) to your github repo secrets. They will be used to generate the `.env` file on deploy.
