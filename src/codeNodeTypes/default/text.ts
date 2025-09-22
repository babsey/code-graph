// text.ts

import { displayInSidebar, setType } from 'baklavajs'

import { CodeOutputInterface, TextInputInterface, defineCodeNode } from '@code-graph'

import { stringType } from './interfaceTypes'

export default defineCodeNode({
  type: 'text',
  inputs: {
    text: () => new TextInputInterface('text', '').use(displayInSidebar, true).use(setType, stringType).setPort(false),
  },
  outputs: {
    code: () => new CodeOutputInterface().use(setType, stringType),
  },
  calculate: ({ text }) => ({ code: `'${text}'` }),
  variableName: 't',
})
