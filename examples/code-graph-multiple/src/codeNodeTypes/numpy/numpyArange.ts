// numpyArange.ts

import { setType } from 'baklavajs'

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode, formatInputs, setOptional } from '@babsey/code-graph'

import { arrayType } from './interfaceTypes'

export default defineCodeNode({
  name: 'np.arange',
  type: 'numpy.arange',
  title: 'arange',
  variableName: 'a',
  inputs: {
    start: () => new NumberInterface('start', 0).use(setOptional, true),
    stop: () => new NumberInterface('stop', 1),
    step: () => new NumberInterface('step', 1).use(setOptional, true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, arrayType),
  },
  codeTemplate() {
    let args = []
    if (!this.inputs.start.hidden) {
      args = formatInputs(this.codeNodeInputs)
    } else {
      const codeNodeInputs = { ...this.codeNodeInputs }
      args.push(formatInputs({ stop: codeNodeInputs.stop }, false)[0])
      delete codeNodeInputs.stop
      args = args.concat(formatInputs(codeNodeInputs))
    }
    return `np.arange(${args.join(', ')})`
  },
})
