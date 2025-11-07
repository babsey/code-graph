// codeNodeTypes/register.ts

import type { ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerExampleNodeTypes } from "./examples";
import { registerNumpyNodeTypes } from "./numpy";

export const registerNodeTypes = (viewModel: ICodeGraphViewModel) => {
  registerDefaultNodeTypes(viewModel);
  registerExampleNodeTypes(viewModel);
  registerNumpyNodeTypes(viewModel);
};
