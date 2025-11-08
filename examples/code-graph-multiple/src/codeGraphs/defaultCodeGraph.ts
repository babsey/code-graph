// defaultCodeGraph.ts

import { useCodeGraph } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "@codeNodeTypes";
import { MyPythonCode } from "@/code";

export const useDefaultCodeGraph = () => {
  const viewModel = useCodeGraph({ code: new MyPythonCode("default") });

  registerDefaultNodeTypes(viewModel);

  return viewModel;
};
