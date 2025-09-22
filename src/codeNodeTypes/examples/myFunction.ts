// text.ts

import { setType } from 'baklavajs'

import { CodeOutputInterface, NumberInterface, TextInputInterface, defineCodeNode } from '@code-graph'

import { numberType, stringType } from '../default/interfaceTypes'

export default defineCodeNode({
  type: 'myFunction',
  title: 'my function',
  inputs: {
    arg1: () => new TextInputInterface('arg1', 'a').use(setType, stringType),
    arg2: () => new NumberInterface('arg2', 1).use(setType, numberType),
  },
  outputs: {
    code: () => new CodeOutputInterface(),
  },
  calculate: ({ arg1, arg2 }) => ({ code: `myFunction(${arg1}, ${arg2})` }),
  codeTemplate: () => 'myFunction({{ &inputs.arg1 }}, {{ &inputs.arg2 }})',
})
