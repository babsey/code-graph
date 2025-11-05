// codeNodeOutputInterface.ts

import { markRaw } from "vue";
import { useGraph } from "@baklavajs/renderer-vue";

import { type AbstractCodeNode } from "@/codeNode";
import { CodeNodeInterface, CodeNodeInterfaceComponent } from "../codeNode";

export class CodeNodeOutputInterface extends CodeNodeInterface<string> {
  public isCodeNodeOutput: boolean = true;
  public suffix: string = "";

  constructor(name: string = "", value: string = "") {
    super(name, "");
    this.suffix = value;
    this.setComponent(markRaw(CodeNodeInterfaceComponent));
  }

  get codeValue(): string {
    return this.node?.outputs._code.value ?? "";
  }

  get node(): AbstractCodeNode | undefined {
    const { graph } = useGraph();
    return graph.value.findNodeById(this.nodeId);
  }
}
