// defaultCodeGraph.ts

import { useCodeGraph } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "@/codeNodeTypes/default";
import { MyPythonCode } from "@/helpers/code";

export const useDefaultCodeGraph = () => {
  const viewModel = useCodeGraph({ code: new MyPythonCode("default") });

  registerDefaultNodeTypes(viewModel);

  return viewModel;
};
