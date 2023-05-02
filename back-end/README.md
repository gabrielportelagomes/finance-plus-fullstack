## How to run for development

1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example` file (see "Running application locally or inside docker section" for details)
5. Run all migrations

```bash
prisma:migrate:deploy
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

## How to run tests

1. Follow the steps in the last section
2. Configure the `.env.test` file using the `.env.example` file (see "Running application locally or inside docker" section for details)
3. Run test:
   (locally)

```bash
npm run test
```
## Building and starting for production

```bash
npm run build
npm start
```

## What to do when add new ENV VARIABLES

There are several things you need to do when you add new ENV VARIABLES:
- Add them to `.env.example` file
- Add them to your local `.env.development` and `.env.test` files
- Add them to your docker-compose.yml file (just the name, not the value). Only envs listed in the environment section will be exposed to your docker container.
- Add them (prod version) to your github repo secrets. They will be used to generate the `.env` file on deploy.
- Add them (prod version) to test.yml file on .github/workflows/test.yml.
