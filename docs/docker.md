---
title: Docker Support
subject: Tutorial
---


The ```docker/``` directory contains containerization configuration.

Build the image:

```bash
docker build -f docker/Dockerfile -t code-graph .
```

Run the container:

```bash
docker run -p 8080:80 code-graph
# Access at http://localhost:8080
```

Using Docker Compose (if a compose file is present):

```bash
docker compose -f docker/docker-compose.yml up
```