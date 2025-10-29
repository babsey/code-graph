// codeNodeOutputInterface.ts

import { markRaw } from "vue";

import CodeNodeInterfaceComponent from "../codeNode/CodeNodeInterface.vue";
import { CodeNodeInterface } from "../codeNode/codeNodeInterface";

export class CodeNodeOutputInterface extends CodeNodeInterface<string> {
  public isCodeNodeOutput: boolean = true;

  constructor(name: string = "", value: string = "") {
    super(name, value);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));
  }

  override get script(): string {
    if (this.name) return this.name;
    return this.state.script;
  }
}
