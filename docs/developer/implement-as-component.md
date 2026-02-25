# Implement as component

Code graph is a javascript library and can be implemented in an existing Vue3 project.

You can find some example implementation in Vue3 projects in [`/src`](https://github.com/babsey/code-graph/tree/main/src)
or various projects in [`/examples`](https://github.com/babsey/code-graph/tree/main/examples) folder.
The `/src` folder contains essential vue3 components and code node types. However, it is recommended using 
`/examples/code-graph-dist` because it imported the public library `@babsey/code-graph` instead using the package in the 
development mode. 

Other examples:
- The project `code-graph-store` is another use case that the storage of code graph is persistent.
- The project `code-graph-multiple` is a good sample project containing multiple view models with different set of
registered code types.



## Install Code Graph

First clone from the public repository in shell.

```shell
npm install @babsey/code-graph
# or
yarn add @babsey/code-graph
```

## Initiate view model

To make it functionally implemented, you have to initiate the view model of code graph.
The `useCodeGraph` takes code as optional argument. 

See an example script using `useCodeGraph` function in 
[`state.ts`](https://github.com/babsey/code-graph/blob/main/src/state.ts) file.
Here, it takes a code instance using Python code template:

```typescript
// state.ts

import { PythonCode, useCodeGraph } from "@babsey/code-graph";
import { registerNodeTypes } from "./codeNodeTypes";

export const viewModel = useCodeGraph({ code: new PythonCode() });
registerNodeTypes(viewModel);

...
```