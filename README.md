# PickMe
This project is part of CPE334 Software Engineering final project. The project PickMe is intended to be a web-application for user to create and showcase their own achievement for the job application purpose.

## Pre-requisites
- Bun
- MongoDB
- Docker (optional)

## Setup
### env
create `.env` file inside backend folder with following code
```
DATABASE_URL = "mongodb://<name>:<password>@localhost:27017/PickMe?authSource=admin&replicaSet=rs0"
```

### Development
First, you need to install dependencies in both `frontend` and `backend` by running this command

```bash
bun install
```

and you need to run this command to create database and its tables

> You must create `.env` in backend folder before running this command

```bash
cd backend && bun prisma db push
```

then you need to generate types for Prisma

```bash
cd backend && bun prisma generate
```

Finally, you can run project in development mode by typing these commands.

run frontend

```bash
cd frontend && bun run dev
```

run backend

```bash
cd backend && bun run start:dev
```
