// register.ts

import type { IBaklavaViewModel } from 'baklavajs'

import add from './add'
import number from './number'
import text from './text'
import { addDefaultTypes } from './interfaceTypes'

export const registerDefaultNodeTypes = (viewModel: IBaklavaViewModel) => {
  addDefaultTypes(viewModel)

  viewModel.editor.registerNodeType(add)
  viewModel.editor.registerNodeType(number)
  viewModel.editor.registerNodeType(text)
}
