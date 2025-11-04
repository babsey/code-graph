// code.ts

import mustache from "mustache";
import { reactive, type UnwrapRef } from "vue";
import { v4 as uuidv4 } from "uuid";

import { AbstractCodeNode } from "./codeNode";
import type { CodeGraph } from "./codeGraph";
import type { CodeEngine } from "./codeEngine";

mustache.escape = (value: string) => value;

export interface ICodeState {
  lockCode: boolean;
  modules: Record<string, string>;
  script: string;
  template: string;
}

export class Code {
  private _id: string;
  private _graph: CodeGraph | null = null;
  private _state: UnwrapRef<ICodeState>;
  private _engine: CodeEngine | null = null;

  constructor() {
    this._id = uuidv4();

    this._state = reactive({
      lockCode: false,
      modules: {},
      script: "",
      template: "",
    });
  }

  get engine(): CodeEngine | null {
    return this._engine;
  }

  get graph(): CodeGraph | null {
    return this._graph;
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
   * Register engine instance.
   * @param engine engine
   */
  registerEngine(engine: CodeEngine): void {
    this._engine = engine;
  }

  /**
   * Register code graph instance.
   * @param graph code graph
   */
  registerGraph(graph: CodeGraph): void {
    this._graph = graph;
  }

  /**
   * Render code script.
   */
  renderCode(): void {
    if (!this.graph || this.state.lockCode) return;

    const nodes = this.graph.scriptedCodeNodes;
    const modules = this.modules;

    this.state.script = mustache.render(this.state.template || "", { nodes, modules });
  }
}
