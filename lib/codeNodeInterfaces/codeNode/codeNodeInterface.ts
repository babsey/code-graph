// codeNodeInterface.ts

// import { BaklavaEvent } from "@baklavajs/events";
import { NodeInterface, type INodeInterfaceState } from "@baklavajs/core";
import { markRaw, reactive, type UnwrapRef } from "vue";

import CodeNodeInterfaceComponent from "./CodeNodeInterface.vue";
import type { Code } from "@/code";

export interface ICodeNodeInterfaceRefState {
  optional: boolean;
}

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public isCodeNode: boolean = true;
  public code: Code | undefined;
  public state: UnwrapRef<ICodeNodeInterfaceRefState>;
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

  override load(state: INodeInterfaceState<T>): void {
    this.id = state.id;
    this.templateId = state.templateId;
    if (this.name === "_code") return;
    if (state.optional) this.state.optional = state.optional;
    this.value = state.value;
    this.hooks.load.execute(state);
    this.hidden = state.hidden;
  }

  override save(): INodeInterfaceState<T> {
    const state: INodeInterfaceState<T> = {
      id: this.id,
      templateId: this.templateId,
      value: this.value,
      hidden: this.hidden,
    };
    if (this.state.optional) state.optional = this.state.optional;
    return this.hooks.save.execute(state);
  }

  setOptional(value: boolean): this {
    this.state.optional = value;
    this.setHidden(value);
    return this;
  }
}

export { CodeNodeInterfaceComponent };
