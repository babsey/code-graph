// exampleCode.ts

import { Code, useCodeGraph } from "@babsey/code-graph";

import { registerDefaultNodeTypes, registerExampleNodeTypes } from "@/codeNodeTypes";

export class ExampleCode extends Code {
  public readonly name = "example";

  constructor() {
    super();

    this.loadTemplate(import("./templates/python.mustache?raw"));
  }
}

export const registerExampleCodeGraph = () => {
  const codeGraph = useCodeGraph({ code: new ExampleCode() });

  registerDefaultNodeTypes(codeGraph);
  registerExampleNodeTypes(codeGraph);

  return codeGraph;
};
