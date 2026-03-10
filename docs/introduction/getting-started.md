# Getting Started

This guide shows the minimal setup to use Code Graph on your computer.

## Prerequisites

- Terminal
- Node.js version 22 or higher
- Git
- Docker (optional, for containerized deployment)

Code Graph can be used on its own, or be installed into an existing nodejs project (Vue3 projects are recommended).

## Installation of source code

Here, you can start sample project quickly with these steps:

### 1. Clone the repository

Code graph is open-source and hosted on Github. 
First clone from the public repository in shell.

```shell
git clone https://github.com/babsey/code-graph
cd code-graph
```

### 2. Install dependencies

Next, install required node dependencies for code graph.

```shell
npm install
# or (recommended — project ships a yarn.lock)
yarn install
```

### 3. Start the development server

Start the development server that supports Hot Module Replacement (HMR) for instant feedback as you edit files.

```shell
npm run dev
# or
yarn dev
```

Open http://localhost:5173 in your browser.

With `CTRL` + `c` you can stop the server instance.


## Run as a docker container

Docker uses code graph example with persistent storage option. To build and run docker container, execute these lines:

```shell
docker build -f docker/Dockerfile -t code-graph:dev .
docker run -it -p 8080:80 -t code-graph:dev
```

Open http://localhost:8080 in your browser. 

With `CTRL` + `c` you can stop the docker container.