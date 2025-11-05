// numpyCode.ts

import { Code, useCodeGraph } from "@babsey/code-graph";

import { registerNumpyNodeTypes } from "@/codeNodeTypes/numpy";

export class NumpyCode extends Code {
  public readonly name = "numpy";

  constructor() {
    super();

    this.loadTemplate(import("./templates/python.mustache?raw"));
  }
}

export const registerNumpyCodeGraph = () => {
  const codeGraph = useCodeGraph({ code: new NumpyCode() });

  // registerDefaultNodeTypes(codeGraph)
  registerNumpyNodeTypes(codeGraph);

  return codeGraph;
};
