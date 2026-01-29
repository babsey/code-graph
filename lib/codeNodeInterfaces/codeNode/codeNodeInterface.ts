// codeNodeInterface.ts

// import { BaklavaEvent } from "@baklavajs/events";
import { NodeInterface, type INodeInterfaceState } from "@baklavajs/core";
import { allowMultipleConnections } from "@baklavajs/engine";
import { markRaw, reactive, type ComponentOptions, type UnwrapRef } from "vue";
import { setTypeForMultipleConnections } from "@baklavajs/interface-types";

import type { AbstractCodeNode } from "@/codeNode";
import type { Code } from "@/code";
import { nodeType } from "@/interfaceTypes";

import { CodeNodeInterface as CodeNodeInterfaceComponent } from "../components";

export interface ICodeNodeInterfaceRefState {
  optional: boolean;
}

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public component: ComponentOptions = markRaw(CodeNodeInterfaceComponent) as ComponentOptions;
  public isCodeNode: boolean = true;
  public code: Code | undefined;
  public componentName: string = "";
  public state: UnwrapRef<ICodeNodeInterfaceRefState> = reactive({
    optional: false,
  });
  public type: string | null = null;

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

    if (["_code", "out"].includes(this.name)) return;

    this.value = state.value;
    this.hidden = state.hidden;

    if (state.component) this.componentName = state.component;
    if (state.optional) this.state.optional = state.optional;

    this.hooks.load.execute(state);
  }

  override save(): INodeInterfaceState<T> {
    const state: INodeInterfaceState<T> = {
      id: this.id,
      templateId: this.templateId,
      value: "" as T,
    };

    if (!["_code", "out"].includes(this.name)) {
      state.value = this.value;
      state.hidden = this.hidden;

      if (this.componentName) state.component = this.componentName;
      if (this.state.optional) state.optional = this.state.optional;
    }

    return this.hooks.save.execute(state);
  }

  setOptional(value: boolean): this {
    this.state.optional = value;
    this.setHidden(value);
    return this;
  }
}

export const addCodeInterfaces = (codeNode: AbstractCodeNode) => {
  codeNode.addInput(
    "_code",
    new CodeNodeInterface<string[]>("_code", [])
      .use(setTypeForMultipleConnections, nodeType)
      .use(allowMultipleConnections)
      .setHidden(true),
  );
  codeNode.addOutput(
    "_code",
    new CodeNodeInterface<string[]>("_code", [])
      .use(setTypeForMultipleConnections, nodeType)
      .use(allowMultipleConnections)
      .setHidden(true),
  );
};
