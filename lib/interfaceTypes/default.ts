// default/interfaceTypes.ts

// Create the types. It is recommended to define them in a separate file and import them when creating the nodes.
import { BaklavaInterfaceTypes, NodeInterfaceType } from "@baklavajs/interface-types";
import type { IBaklavaViewModel } from "@baklavajs/renderer-vue";

export const booleanType = new NodeInterfaceType<boolean>("boolean");
export const dictType = new NodeInterfaceType<object>("dict");
export const listType = new NodeInterfaceType<object>("list");
export const nodeType = new NodeInterfaceType<null>("node");
export const numberType = new NodeInterfaceType<number>("number");
export const stringType = new NodeInterfaceType<string>("string");
export const tupleType = new NodeInterfaceType<object>("tuple");

export const addDefaultInterfaceTypes = (baklavaView: IBaklavaViewModel) => {
  const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklavaView.editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(booleanType, dictType, listType, nodeType, numberType, stringType, tupleType);
};
