// viewModel.ts

import {
  applyResult,
  type CalculationResult,
  DependencyEngine,
  Editor,
  type IBaklavaViewModel,
  type IViewSettings,
  useBaklava,
} from 'baklavajs'
import { type UnwrapRef, reactive } from 'vue'

import type { AbstractCodeNode } from './codeNode/codeNode'
import { Code, transferCodeScript } from './code'
import { addToolbarCommands, DEFAULT_SETTINGS } from './settings'

export interface ICodeGraphViewModel extends IBaklavaViewModel {
  code: Code
  engine: DependencyEngine
  state: UnwrapRef<{
    modules: Record<string, string>
    token: symbol | null
  }>
  subscribe: () => void
  unsubscribe: () => void
}

export function useCodeGraph(existingEditor?: Editor): ICodeGraphViewModel {
  const viewModel = useBaklava(existingEditor) as ICodeGraphViewModel
  addToolbarCommands(viewModel)

  viewModel.code = new Code(viewModel)

  const settings: Partial<IViewSettings> = {}
  Object.keys(DEFAULT_SETTINGS).forEach((K: string) => {
    settings[K] =
      typeof DEFAULT_SETTINGS[K] === 'object'
        ? { ...viewModel.settings[K], ...DEFAULT_SETTINGS[K] }
        : DEFAULT_SETTINGS[K]
  })

  viewModel.settings = reactive({ ...viewModel.settings, ...settings })
  viewModel.settings.nodes.defaultWidth = 350 // This is the way!

  viewModel.state = reactive({
    modules: {},
    token: null,
  })
  viewModel.engine = new DependencyEngine(viewModel.editor)

  viewModel.subscribe = () => {
    if (viewModel.state.token) viewModel.unsubscribe()

    const token = Symbol()

    viewModel.displayedGraph.events.addNode.subscribe(token, (node: AbstractCodeNode) => (node.code = viewModel.code))

    viewModel.engine.events.beforeRun.subscribe(token, () => {
      viewModel.engine.pause()

      // update code nodes from the definition
      viewModel.code.onCodeUpdate()

      // sort code nodes using toposort
      viewModel.code.sortNodes()

      // update intf.state.variableName
      viewModel.code.updateOutputVariableNames()

      viewModel.engine.resume()
    })

    viewModel.engine.events.afterRun.subscribe(token, (result: CalculationResult) => {
      viewModel.engine.pause()

      // apply results from calculation on editor
      applyResult(result, viewModel.editor)

      // transfer script from node code output to node input interface
      transferCodeScript(viewModel.displayedGraph)

      // render code nodes using its code templates
      viewModel.code.renderNodeCodes()

      // render code from scripted code nodes
      viewModel.code.renderCode()

      viewModel.engine.resume()
    })

    viewModel.state.token = token
  }

  viewModel.unsubscribe = () => {
    if (!viewModel.state.token) return

    const token = viewModel.state.token

    viewModel.displayedGraph.events.addNode.unsubscribe(token)
    viewModel.engine.events.beforeRun.unsubscribe(token)
    viewModel.engine.events.afterRun.unsubscribe(token)

    viewModel.state.token = null
  }

  return viewModel as ICodeGraphViewModel
}
