// codeNodeTypes/register.ts

import { registerDefaultNodeTypes, registerExampleNodeTypes } from '.';

export const registerNodeTypes = (codeGraph: ICodeGraphViewModel) => {
  registerDefaultNodeTypes(codeGraph);
  registerExampleNodeTypes(codeGraph);
};
