// add.ts

import { setType } from 'baklavajs'

import { CodeNodeInputInterface, CodeNodeOutputInterface, defineCodeNode, numberType } from '@babsey/code-graph'

export default defineCodeNode({
  type: 'add',
  inputs: {
    arg1: () => new CodeNodeInputInterface('arg1'),
    arg2: () => new CodeNodeInputInterface('arg2'),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  calculate: ({ arg1, arg2 }) => ({ code: `${arg1} + ${arg2}` }),
  codeTemplate: () => '{{ inputs.arg1 }} + {{ inputs.arg2 }}',
})
