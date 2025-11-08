// numpyCodeGraph.ts

import { useCodeGraph } from "@babsey/code-graph";

import { registerNumpyNodeTypes } from "@codeNodeTypes";
import { MyPythonCode } from "@/code";

export const useNumpyCodeGraph = () => {
  const viewModel = useCodeGraph({ code: new MyPythonCode("numpy") });

  // registerDefaultNodeTypes(codeGraph)
  registerNumpyNodeTypes(viewModel);

  return viewModel;
};
