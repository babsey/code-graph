// exampleCodeGraph.ts

import { useCodeGraph } from "@babsey/code-graph";

import { registerDefaultNodeTypes, registerExampleNodeTypes } from "@codeNodeTypes";
import { MyPythonCode } from "@/code";

export const useExampleCodeGraph = () => {
  const viewModel = useCodeGraph({ code: new MyPythonCode("example") });

  // registerDefaultNodeTypes(viewModel);
  registerExampleNodeTypes(viewModel);

  return viewModel;
};
