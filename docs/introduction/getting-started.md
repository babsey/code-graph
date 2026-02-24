# Getting Started

## Installation

### Prerequisites

- Terminal
- Node.js version 22 or higher
- Git
- Docker (optional, for containerized deployment)

Code graph can be used on its own, or be installed into a node project.

### Quickstart with an example

#### 1. Clone the repository

First clone from the public repository in shell.

```shell
git clone https://github.com/babsey/code-graph
cd code-graph
```

#### 2. Install dependencies

Then, install required node dependencies for code graph.

```shell
npm install
# or (recommended — project ships a yarn.lock)
yarn install
```

#### 3. Start the development server

Start the development server that supports Hot Module Replacement (HMR) for instant feedback as you edit files.

```shell
npm run dev
# or
yarn dev
```

Open http://localhost:5173 in your browser. 

### Install in an node project

First clone from the public repository in shell.

```shell
npm install @babsey/code-graph
# or
yarn add @babsey/code-graph
```