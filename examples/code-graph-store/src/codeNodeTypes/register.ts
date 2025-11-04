// codeNodeTypes/register.ts

import { type ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerExampleNodeTypes } from "./examples";
import { registerNorseNodeTypes } from "./norse";
import { registerTorchNodeTypes } from "./torch";
import { registerNESTNodeTypes } from "./nest";
import { registerElephantNodeTypes } from "./elephant";
import { registerNeoNodeTypes } from "./neo";
import { registerPandasNodeTypes } from "./pandas";
import { registerHumamNodeTypes } from "./humam";

export function registerNodeTypes(viewModel: ICodeGraphViewModel) {
  registerDefaultNodeTypes(viewModel);
  registerExampleNodeTypes(viewModel);
  registerNorseNodeTypes(viewModel);
  registerTorchNodeTypes(viewModel);
  registerNESTNodeTypes(viewModel);
  registerElephantNodeTypes(viewModel);
  registerNeoNodeTypes(viewModel);
  registerPandasNodeTypes(viewModel);
  registerHumamNodeTypes(viewModel);
}
