// add.ts

import { setType } from 'baklavajs'

import { CodeInputInterface, CodeOutputInterface, defineCodeNode } from '@babsey/code-graph'

import { numberType } from './interfaceTypes'

export default defineCodeNode({
  type: 'add',
  inputs: {
    arg1: () => new CodeInputInterface('arg1'),
    arg2: () => new CodeInputInterface('arg2'),
  },
  outputs: {
    code: () => new CodeOutputInterface().use(setType, numberType),
  },
  calculate: ({ arg1, arg2 }) => ({ code: `${arg1} + ${arg2}` }),
  codeTemplate: () => '{{ &inputs.arg1 }} + {{ &inputs.arg2 }}',
  variableName: 'a',
})
