// numpyLinspace.ts

import { setType } from 'baklavajs'

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode, formatInputs } from '@babsey/code-graph'

import { arrayType } from './interfaceTypes'

export default defineCodeNode({
  name: 'np.linspace',
  type: 'numpy.linspace',
  title: 'linspace',
  variableName: 'a',
  inputs: {
    start: () => new NumberInterface('start', 0).setOptional(true),
    stop: () => new NumberInterface('stop', 1),
    num: () => new NumberInterface('num', 50).setOptional(true),
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
    return `np.linspace(${args.join(', ')})`
  },
})
