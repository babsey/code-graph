// numpyHistogram.ts

import { setType } from 'baklavajs';

import { CodeNodeInputInterface, CodeNodeOutputInterface, IntegerInterface, defineCodeNode } from '@babsey/code-graph';

import { arrayType } from './interfaceTypes';

export default defineCodeNode({
  name: 'np.histogram',
  type: 'numpy.histogram',
  title: 'histogram',
  variableName: 'h',
  inputs: {
    x: () => new CodeNodeInputInterface('x').use(setType, arrayType),
    bins: () => new IntegerInterface('bins', 10),
  },
  outputs: {
    hist: () => new CodeNodeOutputInterface('hist', '[0]').use(setType, arrayType),
    bin_edges: () => new CodeNodeOutputInterface('bin_edges', '[1]').use(setType, arrayType),
  },
});
