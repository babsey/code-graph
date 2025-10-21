// numpyCorrelate.ts

import { setType } from 'baklavajs'

import {
  CodeNodeInputInterface,
  CodeNodeOutputInterface,
  SelectInterface,
  defineCodeNode,
  setOptional,
} from '@babsey/code-graph'

import { arrayType } from './interfaceTypes'

export default defineCodeNode({
  name: 'np.correlate',
  type: 'numpy.correlate',
  title: 'correlate',
  variableName: 'c',
  inputs: {
    a: () => new CodeNodeInputInterface('a').use(setType, arrayType),
    v: () => new CodeNodeInputInterface('v').use(setType, arrayType),
    mode: () => new SelectInterface('mode', 'valid', ['valid', 'same', 'full']).use(setOptional, true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
})
