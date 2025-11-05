// graphInterface.ts

import { v4 as uuidv4 } from "uuid";
import { NodeInterface, type CalculateFunction, type IGraphInterface } from "@baklavajs/core";

import { AbstractCodeNode, CodeNode, type ICodeNodeState } from "@/codeNode";

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
  }

  onPlaced() {
    super.onPlaced();
    this.initializeIo();
  }

  load(state: IGraphInterfaceNodeState<I, O>) {
    super.load(state as ICodeNodeState<I, O>);
    this.graphInterfaceId = state.graphInterfaceId;
  }

  save(): IGraphInterfaceNodeState<I, O> {
    return {
      ...super.save(),
      graphInterfaceId: this.graphInterfaceId,
    };
  }

  update() {}
}

export class CodeGraphInputNode extends CodeGraphInterfaceNode<{ name: string }, { placeholder: any }> {
  public static isGraphInputNode(v: AbstractCodeNode): v is CodeGraphInputNode {
    return v.type === GRAPH_INPUT_NODE_TYPE;
  }

  public override readonly type = GRAPH_INPUT_NODE_TYPE;
  public inputs = {
    name: new NodeInterface("Name", "Input"),
  };
  public outputs = {
    placeholder: new NodeInterface("Value", undefined),
  };
}
export type CodeGraphInputNodeState = IGraphInterfaceNodeState<{ name: string }, { placeholder: any }>;

export class CodeGraphOutputNode extends CodeGraphInterfaceNode<{ name: string; placeholder: any }, { output: any }> {
  public static isGraphOutputNode(v: AbstractCodeNode): v is CodeGraphOutputNode {
    return v.type === GRAPH_OUTPUT_NODE_TYPE;
  }

  public override readonly type = GRAPH_OUTPUT_NODE_TYPE;
  public inputs = {
    name: new NodeInterface("Name", "Output"),
    placeholder: new NodeInterface("Value", undefined),
  };
  public outputs = {
    output: new NodeInterface("Output", undefined).setHidden(true),
  };
  public override calculate: CalculateFunction<{ placeholder: any }, { output: any }> = ({ placeholder }) => ({
    output: placeholder,
  });
}
export type CodeGraphOutputNodeState = IGraphInterfaceNodeState<{ name: string; placeholder: any }, { output: any }>;
