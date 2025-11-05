// codeNodeInputInterface.ts

import { displayInSidebar } from "@baklavajs/renderer-vue";
import { markRaw } from "vue";

import { CodeNodeInterface, CodeNodeInterfaceComponent } from "../codeNode";

export class CodeNodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  constructor(name: string = "", value?: T) {
    super(name, value as T);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));

    this.use(displayInSidebar, true);
  }

  override get value(): T {
    return super.value;
  }

  override set value(value: T) {
    super.value = value;
    if (this.name !== "_code") this.setHidden(false);
  }
}
