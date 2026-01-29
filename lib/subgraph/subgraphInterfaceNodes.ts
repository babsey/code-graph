// subgraphInterfaceNodes.ts

// import { NodeInterface } from "@baklavajs/core";

import { CodeNodeInterface, TextInputInterface } from "@/codeNodeInterfaces";

import { CodeGraphInputNode, CodeGraphOutputNode } from "./graphInterface";

export class SubgraphInputNode extends CodeGraphInputNode {
  protected override _title = "Subgraph Input";
  public override inputs = {
    name: new TextInputInterface("Name", "Input").setPort(false),
  };
  public override outputs = {
    placeholder: new CodeNodeInterface("Connection", undefined),
  };
}

export class SubgraphOutputNode extends CodeGraphOutputNode {
  protected override _title = "Subgraph Output";
  public override inputs = {
    name: new TextInputInterface("Name", "Output").setPort(false),
    placeholder: new CodeNodeInterface("Connection", undefined),
  };
  public override outputs = {
    output: new CodeNodeInterface("Output", undefined).setHidden(true),
  };
}
