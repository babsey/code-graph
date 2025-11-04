// dynamicCodeNode.ts

import {
  IntegerInterface,
  NodeInterface,
  TextInputInterface,
  allowMultipleConnections,
  displayInSidebar,
  setType,
  type CalculateFunction,
  type CalculateFunctionReturnType,
  type CalculationContext,
  type IDynamicNodeDefinition,
  type INodeState,
  type InterfaceFactory,
  type NodeInterfaceDefinition,
} from "baklavajs";

import { CodeNodeInterface, CodeNodeOutputInterface } from "@/codeNodeInterfaces";
import { nodeType, numberType, stringType } from "@/interfaceTypes";

import { CodeNode, loadNodeState, type AbstractCodeNode, type ICodeNodeState } from "./codeNode";

type Dynamic<T> = T & Record<string, unknown>;

/**
 * @internal
 * Abstract base class for every dynamic node
 */
export abstract class DynamicCodeNode<I, O> extends CodeNode<Dynamic<I>, Dynamic<O>> {
  public abstract inputs: NodeInterfaceDefinition<Dynamic<I>>;
  public abstract outputs: NodeInterfaceDefinition<Dynamic<O>>;

  public abstract load(state: INodeState<Dynamic<I>, Dynamic<O>>): void;
}

export type DynamicNodeDefinition = Record<string, (() => NodeInterface<unknown>) | undefined>;
export interface DynamicNodeUpdateResult {
  inputs?: DynamicNodeDefinition;
  outputs?: DynamicNodeDefinition;
  forceUpdateInputs?: string[];
  forceUpdateOutputs?: string[];
}

export interface IDynamicCodeNodeDefinition<I, O> extends IDynamicNodeDefinition<I, O> {
  codeTemplate?: (node?: AbstractCodeNode) => string;
  name?: string;
  modules?: string[];
  onConnected?: () => void;
  onUnconnected?: () => void;
  update?: (node?: AbstractCodeNode) => void;
  variableName?: string;
}

export function defineDynamicCodeNode<I, O>(
  definition: IDynamicCodeNodeDefinition<I, O>,
): new () => DynamicCodeNode<I, O> {
  return class extends DynamicCodeNode<I, O> {
    public readonly type = definition.type as string;
    public inputs = {} as NodeInterfaceDefinition<Dynamic<I>>;
    public outputs = {} as NodeInterfaceDefinition<Dynamic<O>>;

    private preventUpdate = false;
    private readonly staticInputKeys = Object.keys(definition.inputs ?? {});
    private readonly staticOutputKeys = Object.keys(definition.outputs ?? {});

    constructor() {
      super();
      this._title = definition.title ?? definition.type;
      this.executeFactory("input", definition.inputs);
      this.executeFactory("output", definition.outputs);

      if (definition.calculate) {
        this.calculate = (inputs: Dynamic<I>, globalValues: CalculationContext) =>
          definition.calculate?.call(this, inputs, globalValues);
      }

      definition.onCreate?.call(this);

      this.name = definition.name ?? definition.type;
      this.updateModules(definition.modules);

      if (definition.codeTemplate) this.codeTemplate = definition.codeTemplate;
      if (definition.variableName) this.state.variableName = definition.variableName;

      this.addInput(
        "_code",
        new CodeNodeInterface("", []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      );
      this.addOutput(
        "_code",
        new CodeNodeInterface("", []).use(setType, nodeType).use(allowMultipleConnections).setHidden(true),
      );

      this.staticInputKeys.push("_code");
      this.staticOutputKeys.push("_code");
    }

    public onPlaced(): void {
      this.events.update.subscribe(this, (data) => {
        if (!data) return;

        if (
          (data.type === "input" && this.staticInputKeys.includes(data.name)) ||
          (data.type === "output" && this.staticOutputKeys.includes(data.name))
        )
          this.onUpdate();
      });
      this.onUpdate();

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

    public load(state: ICodeNodeState<Dynamic<I>, Dynamic<O>>): void {
      // prevent automatic updates during loading
      this.preventUpdate = true;

      this.hooks.beforeLoad.execute(state);
      this.id = state.id;
      this.title = state.title;

      // first load the state for the static interfaces
      for (const k of this.staticInputKeys) {
        this.inputs[k].load(state.inputs[k]);
        this.inputs[k].nodeId = this.id;
        if (k === "_code") continue;
        this.inputs[k].hidden = state.inputs[k].hidden;
      }
      for (const k of this.staticOutputKeys) {
        this.outputs[k].load(state.outputs[k]);
        this.outputs[k].nodeId = this.id;
        if (k === "_code") continue;
        this.outputs[k].hidden = state.outputs[k].hidden;
      }

      // run the update function to correctly generate all interfaces
      this.preventUpdate = false;
      this.onUpdate();
      this.preventUpdate = true;

      // load the state for all generated interfaces
      for (const k of Object.keys(state.inputs)) {
        if (this.staticInputKeys.includes(k)) continue;

        if (!this.inputs[k]) {
          const value = state.inputs[k].value;
          let inputInterface;
          if (typeof value == "number") {
            inputInterface = new IntegerInterface(k, value as number).use(setType, numberType);
          } else {
            inputInterface = new TextInputInterface(k, JSON.stringify(value)).use(setType, stringType);
          }
          inputInterface.use(displayInSidebar, true);
          this.addInput(k, inputInterface);
        }

        if (this.inputs[k]) {
          this.inputs[k].load(state.inputs[k]);
          this.inputs[k].nodeId = this.id;
          // this.inputs[k].hidden = state.inputs[k].hidden;
        }
      }
      for (const k of Object.keys(state.outputs)) {
        if (this.staticOutputKeys.includes(k)) continue;

        if (!this.outputs[k]) {
          const outputInterface = new CodeNodeOutputInterface(k);
          this.addOutput(k, outputInterface);
        }

        if (this.outputs[k]) {
          this.outputs[k].load(state.outputs[k]);
          this.outputs[k].nodeId = this.id;
          // this.outputs[k].hidden = state.outputs[k].hidden;
        }
      }

      loadNodeState(this.graph, state);

      this.preventUpdate = false;
      this.events.loaded.emit(this);
    }

    private onUpdate() {
      if (this.preventUpdate) return;
      if (this.graph) this.graph.activeTransactions++;

      const inputValues = this.getStaticValues<I>(this.staticInputKeys, this.inputs);
      const outputValues = this.getStaticValues<O>(this.staticOutputKeys, this.outputs);
      const result = definition.onUpdate.call(this, inputValues, outputValues);
      this.updateInterfaces("input", result.inputs ?? {}, result.forceUpdateInputs ?? []);
      this.updateInterfaces("output", result.outputs ?? {}, result.forceUpdateOutputs ?? []);

      if (this.graph) this.graph.activeTransactions--;
    }

    private getStaticValues<T>(keys: string[], interfaces: Record<string, NodeInterface>): T {
      const values = {} as Record<string, unknown>;
      for (const k of keys) {
        values[k] = interfaces[k].value;
      }
      return values as T;
    }

    private updateInterfaces(type: "input" | "output", newInterfaces: DynamicNodeDefinition, forceUpdates: string[]) {
      const staticKeys = type === "input" ? this.staticInputKeys : this.staticOutputKeys;
      const currentInterfaces = type === "input" ? this.inputs : this.outputs;

      // remove all interfaces that are outdated
      for (const k of Object.keys(currentInterfaces)) {
        if (staticKeys.includes(k) || (newInterfaces[k] && !forceUpdates.includes(k))) continue;

        if (type === "input") {
          this.removeInput(k);
        } else {
          this.removeOutput(k);
        }
      }

      // add all new interfaces
      for (const k of Object.keys(newInterfaces)) {
        if (currentInterfaces[k]) continue;

        const intf = newInterfaces[k]!();
        if (type === "input") {
          this.addInput(k, intf);
        } else {
          this.addOutput(k, intf);
        }
      }
    }

    override updateProps(props: unknown): void {
      this.state.props = props;
      this.onUpdate();
    }

    private executeFactory<V, T extends InterfaceFactory<V>>(type: "input" | "output", factory?: T): void {
      (Object.keys(factory || {}) as (keyof V)[]).forEach((k) => {
        const intf = factory![k]();
        if (type === "input") {
          this.addInput(k as string, intf);
        } else {
          this.addOutput(k as string, intf);
        }
      });
    }
  };
}
