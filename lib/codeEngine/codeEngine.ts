// codeEngine.ts

import type { CalculationResult } from "@baklavajs/core";
import { BaseEngine, type ITopologicalSortingResult, sortTopologically } from "@baklavajs/engine";

import type { CodeGraph } from "@/codeGraph";
import type { CodeEditor } from "@/codeEditor";
import type { CodeNodeInterface } from "@/codeNodeInterfaces";

export const allowMultipleConnections = <T extends Array<unknown>>(intf: CodeNodeInterface<T>) => {
  intf.allowMultipleConnections = true;
};

export class CodeEngine<CalculationData = unknown> extends BaseEngine<CalculationData, []> {
  private order: Map<string, ITopologicalSortingResult> = new Map();

  public constructor(editor: CodeEditor) {
    super(editor);
  }

  public override start() {
    super.start();
    this.recalculateOrder = true;
    void this.calculateWithoutData();
  }

  public override async runGraph(
    graph: CodeGraph,
    inputs: Map<string, unknown>,
    calculationData: CalculationData,
  ): Promise<CalculationResult> {
    // console.log(graph.shortId, "run graph");
    if (!this.order.has(graph.id)) this.order.set(graph.id, sortTopologically(graph));
    const { calculationOrder, connectionsFromNode } = this.order.get(graph.id)!;

    const result: CalculationResult = new Map();
    for (const n of calculationOrder) {
      const inputsForNode: Record<string, unknown> = {};
      Object.entries(n.inputs).forEach(([k, v]) => {
        inputsForNode[k] = this.getInterfaceValue(inputs, v.id);
      });

      // Update code nodes.
      if (n.isCodeNode) {
        n.updateCodeTemplate();
        n.updateOutputNames();
      }

      this.events.beforeNodeCalculation.emit({ inputValues: inputsForNode, node: n });

      let r: Record<string, unknown>;
      if (n.calculate) {
        r = await n.calculate(inputsForNode, { globalValues: calculationData, engine: this });

        // Set calculation result to node interface.
        if (connectionsFromNode.has(n)) {
          for (const [k, value] of Object.entries(r)) {
            this.hooks.transferData.execute(r[k], value);

            connectionsFromNode.get(n)!.forEach((c) => inputs.set(c.to.id, value));
          }
        }
      } else {
        r = {};
        for (const [k, intf] of Object.entries(n.outputs)) {
          r[k] = this.getInterfaceValue(inputs, intf.id);
        }
      }

      // this.validateNodeCalculationOutput(n, r);
      this.events.afterNodeCalculation.emit({ outputValues: r, node: n });

      result.set(n.id, new Map(Object.entries(r)));
      if (connectionsFromNode.has(n)) {
        connectionsFromNode.get(n)!.forEach((c) => {
          const intfKey = Object.entries(n.outputs).find(([, intf]) => intf.id === c.from.id)?.[0];
          if (!intfKey) {
            throw new Error(
              `Could not find key for interface ${c.from.id}\n` +
                "This is likely an internal issue. Please report it on GitHub.",
            );
          }
          const v = this.hooks.transferData.execute(r[intfKey], c);
          if (intfKey === "_code") return;

          if (c.to.allowMultipleConnections) {
            if (inputs.has(c.to.id)) {
              (inputs.get(c.to.id)! as Array<unknown>).push(v);
            } else {
              inputs.set(c.to.id, [v]);
            }
          } else {
            inputs.set(c.to.id, v);
          }
        });
      }
    }

    return result;
  }

  protected override async execute(calculationData: CalculationData): Promise<CalculationResult> {
    if (this.recalculateOrder) {
      this.order.clear();
      this.recalculateOrder = false;
    }

    const inputValues = this.getInputValues(this.editor.graph);
    return await this.runGraph(this.editor.graph, inputValues, calculationData);
  }

  public override getInputValues(graph: CodeGraph): Map<string, unknown> {
    // Gather all values of the unconnected inputs.
    // maps NodeInterface.id -> value
    // The reason it is done here and not during calculation is
    // that this way we prevent race conditions because calculations can be async.
    // For the same reason, we need to gather all output values for nodes that do not have a calculate function.
    const inputValues = new Map<string, unknown>();
    for (const n of graph.nodes) {
      Object.values(n.inputs).forEach((ni) => {
        if (ni.connectionCount === 0) inputValues.set(ni.id, ni.getValue ? ni.getValue() : ni.value);
      });

      if (!n.calculate)
        Object.values(n.outputs).forEach((ni) => {
          inputValues.set(ni.id, ni.getValue ? ni.getValue() : ni.value);
        });
    }
    return inputValues;
  }

  protected onChange(recalculateOrder: boolean): void {
    this.recalculateOrder = recalculateOrder || this.recalculateOrder;
    void this.calculateWithoutData();
  }

  private getInterfaceValue(values: Map<string, unknown>, id: string): unknown {
    if (!values.has(id))
      throw new Error(
        `Could not find value for interface ${id}\n` + "This is likely an internal issue. Please report it on GitHub.",
      );

    return values.get(id);
  }
}
