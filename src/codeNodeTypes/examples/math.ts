// math.ts

import { setType } from 'baklavajs'

import { CodeOutputInterface, NumberInterface, SelectInterface, defineCodeNode } from '@babsey/code-graph'

import { numberType } from '../default/interfaceTypes'

export default defineCodeNode({
  type: 'math',
  inputs: {
    operation: () => new SelectInterface('Operation', 'Add', ['Add', 'Subtract']).setPort(false),
    number1: () => new NumberInterface('Number', 1).use(setType, numberType),
    number2: () => new NumberInterface('Number', 1).use(setType, numberType),
  },
  outputs: {
    code: () => new CodeOutputInterface('code').use(setType, numberType),
  },
  calculate({ operation, number1, number2 }) {
    let code: string = ''

    switch (operation) {
      case 'Add':
        code = `${number1} + ${number2}`
        break
      case 'Subtract':
        code = `${number1} - ${number2}`
        break
    }

    return { code }
  },
})
