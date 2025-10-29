// codeGraphTemplate.ts

import { reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  Editor,
  GraphTemplate,
  type IConnectionState,
  type IGraphTemplateState,
  type INodeInterfaceState,
  type INodeState,
} from "baklavajs";
import mustache from "mustache";

import { CodeGraph, type ICodeGraphState } from "./codeGraph";
import type { CodeEditor } from "@/codeEditor";
import type { AbstractCodeNode, CodeNodeInterface } from "..";
import { mapValues } from "@/utils";
import type { ICodeGraphInterface } from "../subgraph/graphInterface";

type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export interface ICodeGraphTemplateState extends IGraphTemplateState {}

export class CodeGraphTemplate extends GraphTemplate implements ICodeGraphState {
  public state = reactive({
    script: "",
    lockCode: false,
  });

  /** Create a new GraphTemplate from the nodes and connections inside the graph instance */
  public static fromGraph(graph: CodeGraph, editor: CodeEditor): CodeGraphTemplate {
    return new CodeGraphTemplate(graph.save(), editor);
  }

  constructor(state: Optional<ICodeGraphTemplateState, "id" | "name">, editor: CodeEditor) {
    super(state, editor as Editor);
    // this.editor = editor as Editor;
    this.update(state);
  }

  /**
   * Create a new graph instance from this template
   * or load the state into the provided graph instance.
   */
  public createGraph(graph?: CodeGraph): CodeGraph {
    const idMap = new Map<string, string>();

    const createNewId = (oldId: string): string => {
      const newId = uuidv4();
      idMap.set(oldId, newId);
      return newId;
    };

    const getNewId = (oldId: string): string => {
      const newId = idMap.get(oldId);
      if (!newId) {
        throw new Error(`Unable to create graph from template: Could not map old id ${oldId} to new id`);
      }
      return newId;
    };

    const mapNodeInterfaceIds = (interfaceStates: Record<string, INodeInterfaceState<any>>) => {
      return mapValues(interfaceStates, (intf: CodeNodeInterface) => {
        const clonedIntf: INodeInterfaceState<any> = {
          id: createNewId(intf.id),
          templateId: intf.id,
          value: intf.value,
        };
        return clonedIntf;
      });
    };

    const nodes: Array<INodeState<unknown, unknown>> = this.nodes.map((n) => ({
      ...n,
      id: createNewId(n.id),
      inputs: mapNodeInterfaceIds(n.inputs),
      outputs: mapNodeInterfaceIds(n.outputs),
    }));

    const connections: IConnectionState[] = this.connections.map((c) => ({
      id: createNewId(c.id),
      from: getNewId(c.from),
      to: getNewId(c.to),
    }));

    const inputs: ICodeGraphInterface[] = this.inputs.map((i) => ({
      id: i.id,
      name: i.name,
      nodeId: getNewId(i.nodeId),
      nodeInterfaceId: getNewId(i.nodeInterfaceId),
    }));

    const outputs: ICodeGraphInterface[] = this.outputs.map((o) => ({
      id: o.id,
      name: o.name,
      nodeId: getNewId(o.nodeId),
      nodeInterfaceId: getNewId(o.nodeInterfaceId),
    }));

    const clonedState: ICodeGraphState = {
      id: uuidv4(),
      nodes,
      connections,
      inputs,
      outputs,
    };

    if (!graph) graph = new CodeGraph(this.editor);
    const warnings = graph.load(clonedState);
    warnings.forEach((w) => console.warn(w));

    graph.template = this;
    return graph;
  }

  /**
   * Render code script.
   */
  renderCode(): void {
    console.log("render code", this.nodes);
    if (this.state.lockCode) return;
    const nodes = this.nodes;

    nodes.forEach((node: AbstractCodeNode) => node.renderCode());
    this.state.script = mustache.render(this.editor.code.state.template || "", { nodes });
  }
}
