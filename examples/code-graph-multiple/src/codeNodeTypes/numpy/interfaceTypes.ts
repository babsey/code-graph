// numpy/interfaceTypes.ts

// Create the types. It is recommended to define them in a separate file and import them when creating the nodes.
import { BaklavaInterfaceTypes, NodeInterfaceType } from '@baklavajs/interface-types';

import type { ICodeGraphViewModel } from '@babsey/code-graph';

interface INumpyArray {
  dtype?: string;
  copy?: boolean;
  order?: 'K' | 'A' | 'C' | 'F';
}
export const arrayType = new NodeInterfaceType<INumpyArray>('array');

export const addNumpyInterfaceTypes = (baklavaView: ICodeGraphViewModel) => {
  const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklavaView.editor, { viewPlugin: baklavaView });
  nodeInterfaceTypes.addTypes(arrayType);
};
