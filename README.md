# SWoL

SWoL - the Simple Workout Log - is an exercise tracking web app

## Features
* Create, edit, and delete exercises
* Input validation and error reporting
* PostgreSQL/Express API
* React-based SPA user interface

## Prerequisites
* Node.js
* npm
* PostgreSQL database and credentials

## Installation

Start the _exercise-api_ before the _exercise-ui_ — the UI will not work without a running API.

### API Setup
1. Create a `.env` file in `/exercise-api` using `/exercise-api/env_example` as a template:
   * `PORT` — port the API will listen on
   * `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` — PostgreSQL connection details
   * `CORS_ORIGIN` — origin URL of the UI (e.g. `http://localhost:3001`)
2. Ensure PostgreSQL is running and the target database exists (`createdb swol`)
3. In a terminal, navigate to `/exercise-api` and run:

```bash
npm install
npm start
```
4. You should see a message confirming the database connection and the port the API is listening on. The `exercises` table is created automatically on first start.

### UI Setup
1. Create a `.env` file in `/exercise-ui` using `/exercise-ui/env_example` as a template:
   * `PORT` — port the UI will run on
   * `REACT_APP_API_URL` — base URL of the API (e.g. `http://localhost:3000`)
2. In a terminal, navigate to `/exercise-ui` and run:

```bash
npm install
npm start
```
3. You should see a message indicating a successful start with the UI URL.

## Testing
There are basic API tests in `/exercise-api/test-requests.http` (VSCode REST Client format).

These tests are meant to be run on an empty database and may not function properly on a populated one.

## Roadmap
* User authentication using Auth0 (currently in development - see branch)

## License
Copyright &copy; Colin Cummins 2023

## UI Example 

<img width="1458" alt="swol_readme" src="https://github.com/augustsunday/swol/assets/84826067/dedf46c1-5fc6-451b-91d9-f51fb0ca6b51">
