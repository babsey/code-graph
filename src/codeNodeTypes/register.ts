// codeNodeTypes/register.ts

import type { ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerExampleNodeTypes } from "./examples";
import { registerNumpyNodeTypes } from "./numpy";

export const registerNodeTypes = (viewModel: ICodeGraphViewModel, modules?: string[]) => {
  if (!modules || modules.includes("default")) registerDefaultNodeTypes(viewModel);
  if (!modules || modules.includes("example")) registerExampleNodeTypes(viewModel);
  if (!modules || modules.includes("numpy")) registerNumpyNodeTypes(viewModel);
};
