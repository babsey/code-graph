// codeEditor.ts

import { type IBaklavaEventEmitter, type IBaklavaTapable, type IEditorState, Editor } from "baklavajs";

import { createCodeGraphNodeType } from "./codeGraph/codeGraphNode";
import { CodeGraph } from "./codeGraph/codeGraph";
import { CodeGraphTemplate } from "./codeGraph/codeGraphTemplate";
import type { Code } from ".";

/** The main model class for BaklavaJS */
export class CodeEditor extends Editor implements IBaklavaEventEmitter, IBaklavaTapable {
  public code: Code;
  public _graph = new CodeGraph(this);

  public constructor(code: Code) {
    super();
    this.registerCode(code);
  }

  get graph(): CodeGraph {
    return this._graph as CodeGraph;
  }

  override addGraphTemplate(template: CodeGraphTemplate): void {
    if (this.events.beforeAddGraphTemplate.emit(template).prevented) {
      return;
    }
    this._graphTemplates.push(template);
    this.graphTemplateEvents.addTarget(template.events);
    this.graphTemplateHooks.addTarget(template.hooks);

    const nt = createCodeGraphNodeType(template);
    this.registerNodeType(nt, { category: "Subgraphs", title: template.name });

    this.events.addGraphTemplate.emit(template);
  }

  /**
   * Load a state
   * @param state State to load
   * @returns An array of warnings that occured during loading. If the array is empty, the state was successfully loaded.
   */
  override load(state: IEditorState): string[] {
    try {
      super._loading = true;
      state = this.hooks.load.execute(state);

      while (this.graphTemplates.length > 0) {
        this.removeGraphTemplate(this.graphTemplates[0]);
      }

      state.graphTemplates.forEach((tState) => {
        const template = new CodeGraphTemplate(tState, this);
        this.addGraphTemplate(template);
      });

      const warnings = this.graph.load(state.graph);

      this.events.loaded.emit();

      warnings.forEach((w) => console.warn(w));
      return warnings;
    } finally {
      super._loading = false;
    }
  }

  registerCode(code: Code): void {
    this.code = code;
    this._graph.registerCode(code);
  }
}
