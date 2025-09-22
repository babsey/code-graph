// register.ts

import type { IBaklavaViewModel } from 'baklavajs'

import dictEntry from './dictEntry'
import dynamicMath from './dynamicMath'
import math from './math'
import myFunction from './myFunction'

const category = 'examples'

export const registerExampleNodeTypes = (viewModel: IBaklavaViewModel) => {
  viewModel.editor.registerNodeType(dictEntry, { category })
  viewModel.editor.registerNodeType(dynamicMath, { category })
  viewModel.editor.registerNodeType(math, { category })
  viewModel.editor.registerNodeType(myFunction, { category })
}
