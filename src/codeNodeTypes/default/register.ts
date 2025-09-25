// register.ts

import type { IBaklavaViewModel } from 'baklavajs'

import { addDefaultInterfaceTypes } from '@babsey/code-graph'

import boolean from './boolean'
import number from './number'
import text from './text'

export const registerDefaultNodeTypes = (viewModel: IBaklavaViewModel) => {
  addDefaultInterfaceTypes(viewModel)

  viewModel.editor.registerNodeType(boolean)
  viewModel.editor.registerNodeType(number)
  viewModel.editor.registerNodeType(text)
}
