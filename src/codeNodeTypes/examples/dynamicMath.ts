// dynamicMath.ts

import { setType } from 'baklavajs'

import { CodeOutputInterface, NumberInterface, SelectInterface, defineDynamicCodeNode } from '@babsey/code-graph'

import { numberType } from '../default/interfaceTypes'

export default defineDynamicCodeNode({
  type: 'dynamicMath',
  title: 'dynamic math',
  inputs: {
    operation: () => new SelectInterface('Operation', 'Addition', ['Addition', 'Subtraction', 'Sine']).setPort(false),
  },
  outputs: {
    code: () => new CodeOutputInterface('').use(setType, numberType),
  },
  onUpdate({ operation }) {
    if (operation === 'Sine') {
      return {
        inputs: {
          number1: () => new NumberInterface('number', 0).use(setType, numberType),
        },
      }
    } else {
      return {
        inputs: {
          number1: () => new NumberInterface('number', 0).use(setType, numberType),
          number2: () => new NumberInterface('number', 0).use(setType, numberType),
        },
      }
    }
  },
  calculate(inputs) {
    let code: string = ''
    switch (inputs.operation) {
      case 'Addition':
        code = `${inputs.number1} + ${inputs.number2}`
        break
      case 'Subtraction':
        code = `${inputs.number1} - ${inputs.number2}`
        break
      case 'Sine':
        code = `sin(${inputs.number1})`
        break
    }
    return { code }
  },
})
