# BCRF UI

## Setup

### Install dependencies
- Install [pnpm](https://pnpm.io/installation) if you don't have it already.
- Run `corepack enable pnpm` to enable pnpm.
- Run `pnpm install` to install dependencies.

### Create .env file
- Copy the `.env.example` file to `.env` and update the values as needed. Default values are provided for local development.

### Create database
- Copy metadata TSV files to the `scripts` directory with the names `aurora_us.tsv`, `aurora_eu.tsv`, etc...
- Run `node scripts/importData.js scripts duckdb.db` to create `duckdb.db` database file in the root directory.

### Run the development server
- Run `pnpm run dev` to start the development server.

## Docker

### Create .env files
- Copy the `.env.example` file to `.env` and update the values as needed. Default values are provided for local development.
- Copy the `docker/.env.example` file to `docker/.env` and update the values as needed. Default values are provided for local development.

### Build and run the Docker containers
- Run `docker/docker.sh start dev` to build and run the Docker containers for development.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
