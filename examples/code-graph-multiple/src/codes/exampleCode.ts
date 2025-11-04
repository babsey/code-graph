// exampleCode.ts

import { Code, useCodeGraph, type ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes, registerExampleNodeTypes } from "@/codeNodeTypes";

export class ExampleCode extends Code {
  public readonly name = "example";

  constructor(viewModel: ICodeGraphViewModel) {
    super(viewModel);

    this.loadTemplate(import("./templates/python.mustache?raw"));
  }
}

export const registerExampleCodeGraph = () => {
  const codeGraph = useCodeGraph({ code: ExampleCode });
  codeGraph.init();

  registerDefaultNodeTypes(codeGraph);
  registerExampleNodeTypes(codeGraph);

  return codeGraph;
};
