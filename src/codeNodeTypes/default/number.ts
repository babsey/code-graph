// number.ts

import { displayInSidebar, setType } from 'baklavajs'

import { CodeOutputInterface, IntegerInterface, defineCodeNode } from '@babsey/code-graph'

import { numberType } from './interfaceTypes'

export default defineCodeNode({
  type: 'number',
  inputs: {
    number: () => new IntegerInterface('number', 0).use(displayInSidebar, true).use(setType, numberType).setPort(false),
  },
  outputs: {
    code: () => new CodeOutputInterface().use(setType, numberType),
  },
  calculate: ({ number }) => ({ code: `${number}` }),
  variableName: 'n',
})
