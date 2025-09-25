// math.ts

import { setType } from 'baklavajs'

import {
  CodeNodeOutputInterface,
  NumberInterface,
  SelectInterface,
  defineCodeNode,
  numberType,
} from '@babsey/code-graph'

export default defineCodeNode({
  type: 'math',
  inputs: {
    operation: () => new SelectInterface('Operation', 'Add', ['Add', 'Subtract']).setPort(false),
    number1: () => new NumberInterface('Number', 1),
    number2: () => new NumberInterface('Number', 1),
  },
  outputs: {
    code: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate() {
    switch (this.inputs.operation.value) {
      case 'Add':
        return '{{& inputs.number1 }} + {{& inputs.number2 }}'
      case 'Subtract':
        return '{{& inputs.number1 }} - {{& inputs.number2 }}'
    }
  },
})
