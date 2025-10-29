// codeNodeInputInterface.ts

import { displayInSidebar } from "baklavajs";
import { markRaw } from "vue";

import CodeNodeInterfaceComponent from "../codeNode/CodeNodeInterface.vue";
import { CodeNodeInterface } from "../codeNode/codeNodeInterface";

export class CodeNodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  constructor(name: string = "", value?: T) {
    super(name, value as T);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));

    this.use(displayInSidebar, true);
  }

  override set script(value: string) {
    if (this.state.script && this.allowMultipleConnections) {
      const script = this.state.script;
      if (script.startsWith("[") && script.endsWith("]")) {
        value = JSON.stringify([value, ...JSON.parse(script)]);
      } else {
        value = [value, script].join(", ");
      }
    }

    this.state.script = value;
  }

  override get value(): T {
    return super.value;
  }

  override set value(value: T) {
    super.value = value;
    if (this.name !== "_code") this.setHidden(false);
  }
}
