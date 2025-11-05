// codeNodeInterface.ts

import { NodeInterface } from "@baklavajs/core";
import { markRaw, reactive, type UnwrapRef } from "vue";

import CodeNodeInterfaceComponent from "./CodeNodeInterface.vue";
import type { Code } from "@/code";

export interface ICodeNodeInterfaceState {
  optional: boolean;
}

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public isCodeNode: boolean = true;
  public code: Code | undefined;
  public state: UnwrapRef<ICodeNodeInterfaceState>;
  public type: string | null = null;

  constructor(name: string, value: T) {
    super(name, value);
    this.setComponent(markRaw(CodeNodeInterfaceComponent));

    this.state = reactive({
      optional: false,
    });
  }

  get optional(): boolean {
    return this.state.optional;
  }

  get shortId(): string {
    return this.id.slice(0, 6);
  }

  getValue = (): string => `${this.value ?? "None"}`;

  setOptional(value: boolean) {
    this.state.optional = value;
    this.setHidden(value);
    return this;
  }
}

export { CodeNodeInterfaceComponent };
