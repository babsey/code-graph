// numpyConvolve.ts

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
  name: 'np.convolve',
  type: 'numpy.convolve',
  title: 'convolve',
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
