// boolean.ts

import { setType } from 'baklavajs'

import { CodeNodeOutputInterface, CheckboxInterface, defineCodeNode, booleanType } from '@babsey/code-graph'

export default defineCodeNode({
  type: 'boolean',
  inputs: {
    boolean: () => new CheckboxInterface('boolean', false).setPort(false),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface().use(setType, booleanType),
  },
  codeTemplate: () => '{{ inputs.boolean }}',
})
