// codeNodeInputInterface.ts

import type { Connection } from "@baklavajs/core";
import { displayInSidebar } from "@baklavajs/renderer-vue";
import { markRaw, type ComponentOptions } from "vue";

import { CodeNodeInterface } from "../codeNode/codeNodeInterface";
import { CodeNodeInterface as CodeNodeInterfaceComponent } from "../components";

export class CodeNodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  public component: ComponentOptions = markRaw(CodeNodeInterfaceComponent) as ComponentOptions;

  constructor(name: string = "", value?: T) {
    super(name, value as T);
    this.use(displayInSidebar, true);
  }

  get connections(): Connection[] {
    if (this.connectionCount === 0) return [];
    return this.code?.graph?.connections.filter((connection: Connection) => connection.to.id === this.id) ?? [];
  }

  override get value(): T {
    return super.value;
  }

  override set value(value: T) {
    super.value = value;
    if (this.name !== "_code") this.setHidden(false);
  }
}
