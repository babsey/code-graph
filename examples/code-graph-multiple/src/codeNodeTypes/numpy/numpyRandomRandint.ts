// numpyRandomRandint.ts

import { setType } from 'baklavajs'

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode, setOptional } from '@babsey/code-graph'

import { arrayType } from './interfaceTypes'

export default defineCodeNode({
  name: 'np.random.randint',
  type: 'numpy.random.randint',
  title: 'random integer',
  variableName: 'r',
  inputs: {
    low: () => new IntegerInterface('low', 0),
    high: () => new IntegerInterface('high', 1).use(setOptional, true),
    size: () => new IntegerInterface('size', 1).use(setOptional, true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
})
