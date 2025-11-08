// code.ts

import mustache from "mustache";
import { reactive, type UnwrapRef } from "vue";
import { v4 as uuidv4 } from "uuid";

import { AbstractCodeNode } from "./codeNode";
import type { CodeGraph } from "./codeGraph";
import type { CodeEngine } from "./codeEngine";
import type { ICodeGraphViewModel } from "./viewModel";

mustache.escape = (value: string) => value;

export interface ICodeState {
  lockCode: boolean;
  modules: Record<string, string>;
  script: string;
  template: string;
}

export class Code {
  private _id: string;
  private _state: UnwrapRef<ICodeState>;
  public viewModel: ICodeGraphViewModel | undefined;

  constructor() {
    this._id = uuidv4();

    this._state = reactive({
      lockCode: false,
      modules: {},
      script: "",
      template: "",
    });
  }

  get engine(): CodeEngine | undefined {
    return this.viewModel?.engine;
  }

  get graph(): CodeGraph | undefined {
    return this.viewModel?.editor.graph;
  }

  get id(): string {
    return this._id;
  }

  get lockCode(): boolean {
    return this.state.lockCode;
  }

  set lockCode(value: boolean) {
    this.state.lockCode = value;
    this.engine?.runOnce(null);
  }

  get modules(): string[] {
    const categories: string[] = [];

    this.graph?.codeNodes
      .filter((node: AbstractCodeNode) => node.state.modules?.length > 0)
      .forEach((node: AbstractCodeNode) => categories.push(...node.state.modules));

    if (!categories) return [];

    categories.sort();
    return Array.from(new Set(categories.map((category: string) => this.state.modules[category]))) as string[];
  }

  get script(): string {
    return this.state.script;
  }

  set script(value: string) {
    this.state.script = value;
    this.engine?.runOnce(null);
  }

  get shortId(): string {
    return this.id.slice(0, 6);
  }

  get state(): UnwrapRef<ICodeState> {
    return this._state;
  }

  /**
   * Clear code.
   */
  clear(): void {
    // this.graph?.clear();
    this.state.script = "";
  }

  /**
   * Load template from the file.
   * @param resolve: default string in promise resolve (from import)
   */
  async loadTemplate(resolve: Promise<{ default: string }>) {
    resolve.then((template: { default: string }) => {
      this._state.template = template.default ?? "";
    });
  }

  /**
   * Register code view model instance.
   * @param viewModel view model
   */
  registerViewModel(viewModel: ICodeGraphViewModel): void {
    this.viewModel = viewModel;
  }

  /**
   * Render code script.
   */
  renderCode(data: { nodes: AbstractCodeNode[]; modules: string[] }): void {
    this.state.script = mustache.render(this.state.template || "", data);
  }
}

export class PythonCode extends Code {
  constructor() {
    super();

    this.loadTemplate(import("./templates/python.mustache?raw"));
  }
}

export class JavascriptCode extends Code {
  constructor() {
    super();

    this.loadTemplate(import("./templates/javascript.mustache?raw"));
  }
}
