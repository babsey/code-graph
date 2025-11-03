import { GRAPH_INPUT_NODE_TYPE, GRAPH_OUTPUT_NODE_TYPE, NodeInterface } from "@baklavajs/core";
import { TextInputInterface } from "@baklavajs/renderer-vue";
import { setType } from "baklavajs";

import { CodeGraphInputNode, CodeGraphOutputNode } from "./graphInterface";
import { CodeNodeInterface } from "@/codeNodeInterfaces";
import { nodeType } from "@/interfaceTypes";

export class SubgraphInputNode extends CodeGraphInputNode {
  protected override _title = "Subgraph Input";
  public override inputs = {
    _code: new CodeNodeInterface("", "").use(setType, nodeType).setHidden(true),
    name: new TextInputInterface("Name", "Input").setPort(false),
  };
  public override outputs = {
    _code: new CodeNodeInterface("", "").use(setType, nodeType).setHidden(true),
    placeholder: new NodeInterface("Connection", undefined),
  };
}

export class SubgraphOutputNode extends CodeGraphOutputNode {
  protected override _title = "Subgraph Output";
  public override inputs = {
    _code: new CodeNodeInterface("", "").use(setType, nodeType).setHidden(true),
    name: new TextInputInterface("Name", "Output").setPort(false),
    placeholder: new NodeInterface("Connection", undefined),
  };
  public override outputs = {
    _code: new CodeNodeInterface("", "").use(setType, nodeType).setHidden(true),
    output: new NodeInterface("Output", undefined).setHidden(true),
  };
}
