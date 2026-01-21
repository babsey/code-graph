// topologicalSorting.ts

import { type IConnection } from "@baklavajs/core";

import type { AbstractCodeNode } from "../codeNode";
import { CodeGraph } from "../codeGraph";

export interface ITopologicalSortingResult {
  calculationOrder: AbstractCodeNode[];
  connectionsFromNode: Map<AbstractCodeNode, IConnection[]>;
  /** NodeInterface.id -> parent Node.id */
  interfaceIdToNodeId: Map<string, string>;
}

export class CycleError extends Error {
  public constructor() {
    super("Cycle detected");
  }
}

function isString(v: string | undefined): v is string {
  return typeof v === "string";
}

/** Uses Kahn's algorithm to topologically sort the nodes in the graph */
export function sortTopologically(graph: CodeGraph): ITopologicalSortingResult;
/** Uses Kahn's algorithm to topologically sort the nodes in the graph */
export function sortTopologically(
  nodes: ReadonlyArray<AbstractCodeNode>,
  connections: ReadonlyArray<IConnection>,
): ITopologicalSortingResult;
/** This overload is only used for internal purposes */
export function sortTopologically(
  nodesorGraph: ReadonlyArray<AbstractCodeNode> | CodeGraph,
  connections?: ReadonlyArray<IConnection>,
): ITopologicalSortingResult;
export function sortTopologically(
  nodesorGraph: ReadonlyArray<AbstractCodeNode> | CodeGraph,
  pConnections?: ReadonlyArray<IConnection>,
): ITopologicalSortingResult {
  /** NodeInterface.id -> parent Node.id */
  const interfaceIdToNodeId = new Map<string, string>();

  /** Node.id -> set of connected node.id */
  const adjacency = new Map<string, Set<string>>();
  const connectionsFromNode = new Map<AbstractCodeNode, IConnection[]>();

  let nodes: ReadonlyArray<AbstractCodeNode>;
  let connections: ReadonlyArray<IConnection>;

  if (nodesorGraph instanceof CodeGraph) {
    nodes = nodesorGraph.nodes;
    connections = nodesorGraph.connections;
  } else {
    if (!pConnections) {
      throw new Error("Invalid argument value: expected array of connections");
    }
    nodes = nodesorGraph;
    connections = pConnections;
  }

  nodes.forEach((n) => {
    Object.values(n.inputs).forEach((intf) => interfaceIdToNodeId.set(intf.id, n.id));
    Object.values(n.outputs).forEach((intf) => interfaceIdToNodeId.set(intf.id, n.id));
  });

  // build adjacency list
  nodes.forEach((n) => {
    const connectionsFromCurrentNode = connections.filter((c) => c.from && interfaceIdToNodeId.get(c.from.id) === n.id);
    const adjacentNodes = new Set<string>(
      connectionsFromCurrentNode.map((c) => interfaceIdToNodeId.get(c.to.id)).filter(isString),
    );
    adjacency.set(n.id, adjacentNodes);
    connectionsFromNode.set(n, connectionsFromCurrentNode);
  });

  // startNodes are all nodes that don't have any input connected
  const startNodes = nodes.slice();
  connections.forEach((c) => {
    const index = startNodes.findIndex((n) => interfaceIdToNodeId.get(c.to.id) === n.id);
    if (index >= 0) {
      startNodes.splice(index, 1);
    }
  });

  const sorted: AbstractCodeNode[] = [];

  while (startNodes.length > 0) {
    const n = startNodes.pop()!;
    sorted.push(n);
    const nodesConnectedFromN = adjacency.get(n.id)!;
    while (nodesConnectedFromN.size > 0) {
      const mId: string = nodesConnectedFromN.values().next().value!;
      nodesConnectedFromN.delete(mId);
      if (Array.from(adjacency.values()).every((connectedNodes) => !connectedNodes.has(mId))) {
        const m = nodes.find((node) => node.id === mId)!;
        startNodes.push(m);
      }
    }
  }

  if (Array.from(adjacency.values()).some((c) => c.size > 0)) {
    throw new CycleError();
  }

  return {
    calculationOrder: sorted,
    connectionsFromNode,
    interfaceIdToNodeId,
  };
}

/** Checks whether a graph contains a cycle */
export function containsCycle(graph: CodeGraph): boolean;
/** Checks whether the provided set of nodes and connections contains a cycle */
export function containsCycle(nodes: ReadonlyArray<AbstractCodeNode>, connections: ReadonlyArray<IConnection>): boolean;
export function containsCycle(
  nodesorGraph: ReadonlyArray<AbstractCodeNode> | CodeGraph,
  connections?: ReadonlyArray<IConnection>,
): boolean {
  try {
    sortTopologically(nodesorGraph, connections);
    return false;
  } catch (err) {
    if (err instanceof CycleError) {
      return true;
    }
    throw err;
  }
}
