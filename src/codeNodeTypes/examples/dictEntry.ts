// dialog.ts

import { setType } from 'baklavajs'

import { CodeOutputInterface, TextareaInputInterface, TextInputInterface, defineCodeNode } from 'code-graph'

import { stringType } from '../default/interfaceTypes'

export default defineCodeNode({
  type: 'dictEntry',
  title: 'dict entry',
  inputs: {
    key: () => new TextInputInterface('key', '').use(setType, stringType).setPort(false),
    value: () => new TextareaInputInterface('value', '').use(setType, stringType),
  },
  outputs: {
    code: () => new CodeOutputInterface(),
  },
  calculate: ({ key, value }) => ({ code: `'${key}': ${value}` }),
  codeTemplate: () => '{{ &inputs.key }}: {{ &inputs.value }}',
})
