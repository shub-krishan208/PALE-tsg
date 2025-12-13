# project PALE backend

For details on api v1: [click here](./api.md)

## Setup guide:

- Get the docker container running

  ```bash
  # the db will be initialized by the scripts in the ./init dir
  docker compose up
  ```

  The Postgres container will be running on **`localhost:54322`**. To explore the db in the container, try doing exec into it (I forgor the exact command, i do it via `lazygit`).

- inside the container, run the start script **`/var/lib/postgres/start.sh`**. The db is opened using psql.
