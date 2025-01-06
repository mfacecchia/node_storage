# Node Storage
NodeJS-based file storage project for the [EduHub](https://github.com/mfacecchia/eduhub) project.

## Table of Contents
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Built In - Technologies](#built-in---technologies)
- [Libraries References](#libraries-references)
- [Environmental Variables](#environmental-variables)
- [Features](#features)

## Requirements
- [NodeJS](https://nodejs.org/en/download/package-manager) (>=16)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/downloads/)

## Quick Start
A `.env.sample` file is provided in the source code. To acknowledge all the environmental variables used in this project and how you can tweak them, you can refer to [this section](#environmental-variables) of the README.
After you completed the environmental variables configuration, you just need to run your PostgreSQL server and, in your terminal, execute the following:
```zsh
cd node_storage
npm install
npx prisma db push
```
And you'll be good to go!
Once prisma completed the database configuration, all you will have to do is runing the application. To do so, just run `npm run dev` if you want to run the application in a dev envirorment, otherwise first build the app with `npm run build` and (if the building throws no errors) `npm run start` for a production-environment execution.

## Built In - Technologies
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)\
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

## Libraries References
- [Prisma ORM](https://www.prisma.io/docs/getting-started/quickstart)
- [Redis Client](https://redis.io/docs/latest/develop/clients/nodejs/)
- [Express](https://expressjs.com/en/4x/api.html#express)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Multer](https://github.com/expressjs/multer)

## Environmental Variables
The env file provided in this project includes:
- `NODE_ENV`, used as an application environment flag which represents the current state in which the application is running; the default value is `development` and enables errors logging for quick debugging. However, you may want this feature to be disabled while running in a production environment (strongly recommended), and to do so you just have to set the value to `production` to disable that feature.
- `PORT`, representing the port which the server will run on.
- `DATABASE_URL` and `REDIS_CONNECTION_STRING`, which, as the same name suggests, are used by ORMs and other libraries as information about how to connect to each persistence.
- `JWT_SECRET`, representing the secret which will be used to validate the received authentication token so it's important for this value to be exactly the same as the server's.
**Note:** once you are satisfied with the variables configuration, in order for the program to read those values you'll need to update the file name from `.env.sample` to just `.env`.

## Features
- File uploads
- Files list retrieval with userId & classId filtering
- Single file retrieval
