// numpyFull.ts

import { setType } from 'baklavajs'

import { CodeNodeOutputInterface, IntegerInterface, NumberInterface, defineCodeNode } from '@babsey/code-graph'

import { arrayType } from './interfaceTypes'

export default defineCodeNode({
  name: 'np.full',
  type: 'numpy.full',
  title: 'full',
  variableName: 'a',
  inputs: {
    shape: () => new IntegerInterface('shape', 1),
    fill_value: () => new NumberInterface('fill_value', 1),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
})
