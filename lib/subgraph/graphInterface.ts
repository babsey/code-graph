// graphInterface.ts

import { v4 as uuidv4 } from "uuid";
import { type CalculateFunction, type IGraphInterface } from "@baklavajs/core";

import { AbstractCodeNode, CodeNode, type ICodeNodeState } from "@/codeNode";
import { CodeNodeInterface, addCodeInterfaces } from "@/codeNodeInterfaces";

export interface ICodeGraphInterface extends IGraphInterface {
  id: string;
  nodeId: string;
  nodeInterfaceId: string;
  name: string;
}

export const GRAPH_INPUT_NODE_TYPE = "__baklava_SubgraphInputNode";
export const GRAPH_OUTPUT_NODE_TYPE = "__baklava_SubgraphOutputNode";

interface IGraphInterfaceNodeState<I, O> extends ICodeNodeState<I, O> {
  graphInterfaceId: string;
}

abstract class CodeGraphInterfaceNode<I, O> extends CodeNode<I, O> {
  public graphInterfaceId: string;

  constructor() {
    super();
    this.graphInterfaceId = uuidv4();

    addCodeInterfaces(this);
    this.variableName = "s";
  }

  override onPlaced() {
    super.onPlaced();
    this.initializeIo();
  }

  override load(state: IGraphInterfaceNodeState<I, O>) {
    super.load(state as ICodeNodeState<I, O>);
    this.graphInterfaceId = state.graphInterfaceId;
  }

  override save(): IGraphInterfaceNodeState<I, O> {
    return {
      ...super.save(),
      graphInterfaceId: this.graphInterfaceId,
    };
  }

  public afterGraphLoaded(): void {}
  public afterLoaded(): void {}
  public beforeRun(): void {}
  public onConnected(): void {}
  public onUnconnected(): void {}
  public update(): void {}
}

export class CodeGraphInputNode extends CodeGraphInterfaceNode<{ name: string }, { placeholder: unknown }> {
  public static isGraphInputNode(v: AbstractCodeNode): boolean {
    return v.type === GRAPH_INPUT_NODE_TYPE;
  }

  public override readonly type = GRAPH_INPUT_NODE_TYPE;
  public inputs = {
    name: new CodeNodeInterface("Name", "Input"),
  };
  public outputs = {
    placeholder: new CodeNodeInterface("Value", undefined),
  };
}
export type CodeGraphInputNodeState = IGraphInterfaceNodeState<{ name: string }, { placeholder: unknown }>;

export class CodeGraphOutputNode extends CodeGraphInterfaceNode<
  { name: string; placeholder: unknown },
  { output: unknown }
> {
  public static isGraphOutputNode(v: AbstractCodeNode): boolean {
    return v.type === GRAPH_OUTPUT_NODE_TYPE;
  }

  public override readonly type = GRAPH_OUTPUT_NODE_TYPE;
  public inputs = {
    name: new CodeNodeInterface("Name", "Output"),
    placeholder: new CodeNodeInterface("Value", undefined),
  };
  public outputs = {
    output: new CodeNodeInterface("Output", undefined).setHidden(true),
  };

  public override calculate: CalculateFunction<{ placeholder: unknown }, { output: unknown }> = ({ placeholder }) => {
    return {
      output: placeholder,
    };
  };
}

export type CodeGraphOutputNodeState = IGraphInterfaceNodeState<
  { name: string; placeholder: unknown },
  { output: unknown }
>;
