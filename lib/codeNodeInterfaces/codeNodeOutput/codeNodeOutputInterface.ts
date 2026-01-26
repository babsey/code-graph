// codeNodeOutputInterface.ts

import { markRaw, type ComponentOptions } from "vue";
import { useGraph } from "@baklavajs/renderer-vue";

import { type AbstractCodeNode } from "@/codeNode";

import { CodeNodeInterface } from "../codeNode/codeNodeInterface";
import { CodeNodeInterface as CodeNodeInterfaceComponent } from "../components";

export class CodeNodeOutputInterface extends CodeNodeInterface<unknown> {
  public component: ComponentOptions = markRaw(CodeNodeInterfaceComponent) as ComponentOptions;
  public isCodeNodeOutput: boolean = true;
  public suffix: string = "";

  constructor(name: string = "", suffix: string = "") {
    super(name, "");
    this.suffix = suffix;
  }

  get codeValue(): string {
    return (this.node?.outputs._code?.value as string) ?? "";
  }

  get node(): AbstractCodeNode | undefined {
    const { graph } = useGraph();
    return graph.value.findNodeById(this.nodeId) as AbstractCodeNode;
  }
}
