// defineCodeNode.ts

import type { CalculationContext, INodeDefinition, Node, NodeInterfaceDefinition } from "@baklavajs/core";
import { CodeNode, type AbstractCodeNode } from "./codeNode";
import { addCodeInterfaces } from "@/codeNodeInterfaces";

export type NodeConstructor<I, O> = new () => Node<I, O>;
export type NodeInstanceOf<T> = T extends new () => Node<infer A, infer B> ? Node<A, B> : never;

export interface ICodeNodeDefinition<I, O> extends INodeDefinition<I, O> {
  afterGraphLoaded?: () => void;
  afterLoaded?: () => void;
  beforeRun?: () => void;
  codeTemplate?: (node?: AbstractCodeNode) => string;
  modules?: string[];
  name?: string;
  onConnected?: () => void;
  onUnconnected?: () => void;
  update?: (node?: AbstractCodeNode) => void;
  variableName?: string;
}

export function defineCodeNode<I, O>(definition: ICodeNodeDefinition<I, O>): new () => CodeNode<I, O> {
  return class extends CodeNode<I, O> {
    public readonly type = definition.type;
    public inputs: NodeInterfaceDefinition<I> = {} as NodeInterfaceDefinition<I>;
    public outputs: NodeInterfaceDefinition<O> = {} as NodeInterfaceDefinition<O>;

    constructor() {
      super();
      this._title = definition.title ?? definition.type;
      this.executeFactory("input", definition.inputs);
      this.executeFactory("output", definition.outputs);

      if (definition.calculate) {
        this.calculate = (inputs: I, globalValues: CalculationContext) =>
          definition.calculate!.call(this, inputs, globalValues);
      }

      definition.onCreate?.call(this);

      this.name = definition.name ?? definition.type;
      this.updateModules(definition.modules);

      if (definition.codeTemplate) this.codeTemplate = definition.codeTemplate;
      if (definition.variableName != undefined) this.variableName = definition.variableName;

      addCodeInterfaces(this);
    }

    public afterGraphLoaded(): void {
      definition.afterGraphLoaded?.call(this);
    }

    public afterLoaded(): void {
      definition.afterLoaded?.call(this);
    }

    public beforeRun(): void {
      definition.beforeRun?.call(this);
    }

    public onPlaced(): void {
      definition.onPlaced?.call(this);
    }

    public onConnected(): void {
      definition.onConnected?.call(this);
    }

    public onDestroy(): void {
      definition.onDestroy?.call(this);
    }

    public onUnconnected(): void {
      definition.onUnconnected?.call(this);
    }

    public update(): void {
      definition.update?.call(this);
    }
  };
}
