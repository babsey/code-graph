// code.ts

import { Code, type ICodeGraphViewModel } from '@babsey/code-graph'

export class MyCode extends Code {
  constructor(viewModel: ICodeGraphViewModel) {
    super(viewModel)

    this.loadTemplate(import('./templates/python.mustache?raw'))
  }
}
