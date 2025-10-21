// numpyCode.ts

import { Code, useCodeGraph, type ICodeGraphViewModel } from '@babsey/code-graph'

import { registerNumpyNodeTypes } from '@/codeNodeTypes/numpy'

export class NumpyCode extends Code {
  public readonly name = 'numpy'

  constructor(viewModel: ICodeGraphViewModel) {
    super(viewModel)

    this.loadTemplate(import('./templates/python.mustache?raw'))
  }
}

export const registerNumpyCodeGraph = () => {
  const codeGraph = useCodeGraph({ code: NumpyCode })
  codeGraph.init()

  // registerDefaultNodeTypes(codeGraph)
  registerNumpyNodeTypes(codeGraph)

  return codeGraph
}
