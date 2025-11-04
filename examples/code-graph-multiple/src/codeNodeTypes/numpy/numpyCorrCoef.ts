// numpyCorrCoef.ts

import { setType } from 'baklavajs';

import { CodeNodeInputInterface, CodeNodeOutputInterface, defineCodeNode } from '@babsey/code-graph';

import { arrayType } from './interfaceTypes';

export default defineCodeNode({
  name: 'np.corrcoef',
  type: 'numpy.corrcoef',
  title: 'correlation coefficients',
  variableName: 'cc',
  inputs: {
    x: () => new CodeNodeInputInterface('x').use(setType, arrayType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
});
