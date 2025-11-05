// codeNode.ts

import {
  AbstractNode,
  type CalculateFunction,
  type CalculateFunctionReturnType,
  type CalculationContext,
  type Connection,
  type INodeState,
  type NodeInterfaceDefinition,
} from "@baklavajs/core";
import mustache from "mustache";
import { reactive, type UnwrapRef } from "vue";

import type { Code } from "@/code";
import type { CodeNodeInputInterface, CodeNodeInterface, CodeNodeOutputInterface } from "@/codeNodeInterfaces";
import type { CodeGraph } from "@/codeGraph";

mustache.escape = (value: string) => value;

export interface IAbstractCodeNodeState {
  codeTemplate: string;
  hidden: boolean;
  integrated: boolean;
  lockCode: boolean;
  modules: string[];
  props?: unknown | null;
  script: string;
  variableName: string;
}

export abstract class AbstractCodeNode extends AbstractNode {
  public state: UnwrapRef<IAbstractCodeNodeState>;
  public isCodeNode = true;
  public name: string = "";
  public codeTemplate: () => string;

  public inputs: Record<string, CodeNodeInterface<unknown>> = {};
  public outputs: Record<string, CodeNodeInterface<unknown>> = {};

  public constructor() {
    super();
    this.initializeIo();

    this.twoColumn = true;

    this.state = reactive({
      codeTemplate: "",
      hidden: false,
      integrated: false,
      lockCode: false,
      modules: [],
      props: null,
      script: "",
      variableName: "a",
    });

    this.codeTemplate = function () {
      return `${this.name}(${formatInputs(this.codeNodeInputs).join(", ")})`;
    };
  }

  get code(): Code {
    return this.graph.code;
  }

  get codeNodeInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(
      Object.entries(this.inputs).filter(
        (intf: [string, CodeNodeInterface]) => intf[1].isCodeNode && intf[1].type != "node",
      ),
    ) as Record<string, CodeNodeInputInterface>;
  }

  get codeNodeOutputs(): Record<string, CodeNodeOutputInterface> {
    return Object.fromEntries(
      Object.entries(this.outputs).filter(
        (intf: [string, CodeNodeInterface]) => intf[1].isCodeNode && intf[1].type != "node",
      ),
    ) as Record<string, CodeNodeOutputInterface>;
  }

  get graph(): CodeGraph {
    return super.graph as CodeGraph;
  }

  get idx(): number {
    return this.graph.nodes.filter((node: AbstractCodeNode) => !node.state.integrated).indexOf(this) ?? -1;
  }

  get idxByVariableNames(): number {
    return (
      this.graph
        .getNodesBySameVariableNames(this.state.variableName)
        .filter((node: AbstractCodeNode) => !node.state.integrated)
        .indexOf(this) ?? -1
    );
  }

  get lockCode(): boolean {
    return this.state.lockCode;
  }

  set lockCode(value: boolean) {
    this.state.lockCode = value;
    this.events.update.emit(null);
  }

  get optionalInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(
      Object.entries(this.codeNodeInputs).filter((intf: [string, CodeNodeInterface]) => intf[1].optional),
    );
  }

  get requiredInputs(): Record<string, CodeNodeInputInterface> {
    return Object.fromEntries(
      Object.entries(this.codeNodeInputs).filter((intf: [string, CodeNodeInterface]) => !intf[1].optional),
    );
  }

  get script(): string {
    return (this.outputs._code?.value as string) ?? "";
  }

  set script(value: string) {
    if (this.outputs._code) this.outputs._code.value = value;
    this.events.update.emit(null);
  }

  get shortId(): string {
    return this.id.slice(0, 6);
  }

  get subgraph(): CodeGraph | undefined {
    return undefined;
  }

  get variableName(): string {
    return this.state.variableName ? this.state.variableName + (this.idxByVariableNames + 1) : "";
  }

  abstract onConnected(): void;
  abstract onUnconnected(): void;
  abstract update(): void;

  /**
   * Get connected node to the node interface.
   * @param nodeInterface string
   * @returns code node instance or null
   */
  getConnectedNodeByInterface(nodeInterface: string, type?: "inputs" | "outputs"): AbstractCodeNode | null {
    const nodes = this.getConnectedNodesByInterface(nodeInterface, type);
    return nodes.length > 0 ? (nodes[0] as AbstractCodeNode) : null;
  }

  /**
   * Get connected nodes to the node.
   * @param type inputs or outputs
   * @returns code node instances
   */
  getConnectedNodes(type?: "inputs" | "outputs"): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (type !== "inputs") {
      const targets = this.graph.connections
        .filter((c: Connection) => c.from.name !== "_code")
        .filter((c: Connection) => c.from.nodeId === this.id)
        .map((c: Connection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (type !== "outputs") {
      const sources = this.graph.connections
        .filter((c: Connection) => c.from.name !== "_code")
        .filter((c: Connection) => c.to.nodeId === this.id)
        .map((c: Connection) => c.from.nodeId);

      if (sources) nodeIds = nodeIds.concat(sources);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected nodes to the node interface.
   * @param nodeInterface string
   * @returns code node instances
   */
  getConnectedNodesByInterface(nodeInterface: string, type?: "inputs" | "outputs"): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (type !== "outputs" && this.inputs[nodeInterface]) {
      const sources = this.graph.connections
        .filter(
          (c: Connection) => c.to.id === this.inputs[nodeInterface]?.id || c.from.id === this.inputs[nodeInterface]?.id,
        )
        .map((c: Connection) => c.from.nodeId);
      if (sources) nodeIds = nodeIds.concat(sources);
    }

    if (type !== "inputs" && this.outputs[nodeInterface]) {
      const targets = this.graph.connections
        .filter(
          (c: Connection) =>
            c.from.id === this.outputs[nodeInterface]?.id || c.from.id === this.outputs[nodeInterface]?.id,
        )
        .map((c: Connection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Register code
   * @param code
   */
  registerCode(code: Code) {
    this.code = code;
  }

  /**
   * Render code of this node.
   */
  renderCode(data: { inputs: Record<string, unknown> }): string {
    return mustache.render(this.state.codeTemplate, data);
  }

  /**
   * Update code templates.
   */
  updateCodeTemplate(): void {
    this.state.codeTemplate = this.codeTemplate.call(this);
  }

  /**
   * Update modules.
   * @param modules a list of modules
   */
  updateModules(modules?: string[]): void {
    if (modules) {
      this.state.modules = modules;
    } else if (this.type.includes(".")) {
      const modules = this.type.split(".");
      this.state.modules.push(modules.slice(0, modules.length - 1).join("."));
    }
  }

  /**
   * Update output names.
   */
  updateOutputNames(): void {
    Object.values(this.codeNodeOutputs).forEach((output: CodeNodeOutputInterface) => {
      output.name = this.state.integrated ? "" : this.variableName + output.suffix;
    });
  }
  /**
   * Update output values.
   * @param output return data of calculate function
   */
  updateOutputValues(outputs: CalculateFunctionReturnType<any>): void {
    Object.keys(this.outputs).forEach((k: string) => {
      if (k === "_code") return;
      outputs[k] = this.state.integrated ? outputs._code : this.outputs[k].name;
    });
  }

  /**
   * Update state props.
   * @param props
   */
  updateProps(props: unknown): void {
    this.state.props = props;
  }
}

export interface ICodeNodeState<I, O> extends INodeState<I, O>, IAbstractCodeNodeState {}

export abstract class CodeNode<I, O> extends AbstractCodeNode {
  abstract inputs: NodeInterfaceDefinition<I>;
  abstract outputs: NodeInterfaceDefinition<O>;

  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  public calculate?: CalculateFunction<I, O> = (inputs: I, globalValues: CalculationContext) => {
    const outputs: CalculateFunctionReturnType<any> = {};
    if (!this.lockCode) outputs._code = this.renderCode({ inputs, ...globalValues });
    this.updateOutputValues(outputs);
    return outputs;
  };

  public load(state: ICodeNodeState<I, O>): void {
    super.load(state);
    loadNodeState(this.graph, state);
  }

  public save(): ICodeNodeState<I, O> {
    const state = super.save() as ICodeNodeState<I, O>;
    saveNodeState(this.graph, state);
    return state;
  }
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode;

/**
 * Format inputs for mustache templates.
 * @param intfs code node input interfaces
 * @returns a list of string
 */
export const formatInputs = (intfs: Record<string, CodeNodeInputInterface>, withKeywords: boolean = true): string[] => {
  const args: string[] = [];

  const inputKeys = Object.keys(intfs);
  inputKeys.forEach((inputKey: string) => {
    const intf = intfs[inputKey];
    if (intf?.hidden) return;

    const keyword = withKeywords && args.length < inputKeys.indexOf(inputKey) ? `${inputKey}=` : "";
    args.push(`${keyword}{{ inputs.${inputKey} }}`);
  });

  return args;
};

/**
 * Load node state.
 * @param graph code graph
 * @param nodeState node state
 */
export const loadNodeState = (graph: CodeGraph, nodeState: ICodeNodeState<unknown, unknown>): void => {
  if (!graph) return;

  const node = graph.findNodeById(nodeState.id);
  if (!node || node.subgraph) return;

  const codeNode = node as AbstractCodeNode;

  if (codeNode.state) {
    codeNode.state.integrated = nodeState.integrated;
    codeNode.state.modules = nodeState.modules;
    codeNode.state.props = nodeState.props;
  }

  Object.entries(nodeState.inputs).forEach(([inputKey, inputItem]) => {
    if (inputKey === "_code") return;
    if (codeNode.inputs[inputKey]) codeNode.inputs[inputKey].hidden = inputItem.hidden;
  });

  Object.entries(nodeState.outputs).forEach(([outputKey, outputItem]) => {
    if (outputKey === "_code") return;
    if (codeNode.outputs[outputKey]) codeNode.outputs[outputKey].hidden = outputItem.hidden;
  });
};

/**
 * Save state of node.
 * @param graph code graph
 * @param nodeState node state
 */
export const saveNodeState = (graph: CodeGraph, nodeState: ICodeNodeState<unknown, unknown>): void => {
  if (!graph) return;

  const node = graph.findNodeById(nodeState.id);
  if (!node || node.subgraph) return;

  const codeNode = node as AbstractCodeNode;

  if (codeNode.state) {
    nodeState.integrated = codeNode.state.integrated;
    nodeState.modules = codeNode.state.modules;
  }

  Object.entries(nodeState.inputs).forEach(([inputKey, inputItem]) => {
    if (inputKey === "_code") return;
    if (codeNode.inputs[inputKey]) inputItem.hidden = codeNode.inputs[inputKey].hidden;
  });

  Object.entries(nodeState.outputs).forEach(([outputKey, outputItem]) => {
    if (outputKey === "_code") return;
    if (codeNode.outputs[outputKey]) outputItem.hidden = codeNode.outputs[outputKey].hidden;
  });
};
