# Task Management API

Node.js REST API for managing tasks. This project is part of the GitHub, GitHub Actions and Docker final challenge.

## Requirements

- Node.js 20+
- npm
- Docker
- Docker Compose

## Local development

Install the dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The API is available at `http://localhost:3000` by default.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port used by the API | `3000` |
| `NODE_ENV` | Application environment | `development` |

Example:

```bash
PORT=3001 NODE_ENV=development npm start
```

Environment files containing secrets must not be committed to the repository.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check that the API is running |
| `GET` | `/tasks` | Return all tasks, or filter by `status` |
| `GET` | `/tasks/:id` | Return one task |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

Supported task statuses are `todo`, `in-progress` and `done`.

Example filtering request:

```text
GET /tasks?status=done
```

## Tests

Run the automated test suite:

```bash
npm test
```

The tests cover the health endpoint, task retrieval, filtering, validation, updates and deletion, including missing-resource cases.

## Lint

Run ESLint:

```bash
npm run lint
```

## Docker

Build the application image:

```bash
docker build -t task-api .
```

Run the container:

```bash
docker run -p 3000:3000 task-api
```

The API can then be accessed at `http://localhost:3000`. The health endpoint is available at `http://localhost:3000/health`.

## Docker Compose

The Compose configuration builds the application, exposes port `3000`, sets `NODE_ENV=production`, sets `PORT=3000` and checks the `/health` endpoint.

Start the application with:

```bash
docker compose up
```

Stop the services with:

```bash
docker compose down
```

## Continuous integration

The workflow in `.github/workflows/ci.yml` runs on pull requests and on pushes to `main`.

It performs the following quality gates:

1. Checks out the repository.
2. Sets up Node.js 20.
3. Installs the exact dependency versions with `npm ci`.
4. Runs ESLint with `npm run lint`.
5. Runs the automated tests with `npm test`.
6. Checks the application syntax with `node --check src/app.js`.

If one of these steps fails, the workflow fails and the pull request must be fixed before it can be merged.

## Container registry

The target GitHub Container Registry image is:

```text
ghcr.io/bryan-pignerol/final-challenge
```

The recommended tags are:

- `latest`: the most recent image built from `main`;
- `sha-<commit>`: an immutable image linked to a specific commit;
- a semantic version such as `1.0.0` for a release.

After the image has been published, authenticate to GHCR and pull it with:

```bash
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
docker pull ghcr.io/bryan-pignerol/final-challenge:latest
```

The image publishing workflow must use GitHub Actions permissions rather than a personal access token stored directly in the workflow. Until that publishing workflow is configured, the image is available only from the local Docker build.

## Architecture

```text
Developer
	|
	v
GitHub issue and branch
	|
	v
Pull Request
	|
	v
GitHub Actions
	+-- Tests
	+-- Lint
	+-- Application check
	|
	v
Merge into main
	|
	v
Docker build
	|
	v
Security scan
	|
	v
GitHub Container Registry (GHCR)
```

The API currently uses an in-memory task collection. Tasks are initialized when the application starts and are lost when the process stops.

## Project documentation

See [DOCUMENTATION.md](DOCUMENTATION.md) for the detailed API documentation, repository structure and branching strategy. See [CHALLENGE.md](CHALLENGE.md) for the complete assignment requirements.
