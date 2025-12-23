// exampleCodeGraph.ts

import { useCodeGraph } from "@babsey/code-graph";

import { registerExampleNodeTypes } from "@/codeNodeTypes/examples";
import { MyPythonCode } from "@/helpers/code";

export const useExampleCodeGraph = () => {
  const viewModel = useCodeGraph({ code: new MyPythonCode("example") });

  // registerDefaultNodeTypes(viewModel);
  registerExampleNodeTypes(viewModel);

  return viewModel;
};
