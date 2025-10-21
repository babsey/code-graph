// viewModel.ts

import {
  DependencyEngine,
  Editor,
  applyResult,
  type BeforeNodeCalculationEventData,
  type CalculationResult,
  type IBaklavaViewModel,
  type IConnection,
  type IViewSettings,
  useBaklava,
  Commands,
  type IEditorState,
} from 'baklavajs'
import { type UnwrapRef, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import type { AbstractCodeNode } from './codeNode'
import { Code } from './code'
import { addToolbarCommands, DEFAULT_SETTINGS } from './settings'

export interface ICodeGraphViewModel extends IBaklavaViewModel {
  code: Code
  engine: DependencyEngine
  init: () => void
  loadEditor: (editorState: IEditorState) => void
  newGraph: () => void
  state: UnwrapRef<{
    modules: Record<string, string>
    token: symbol | null
  }>
  subscribe: () => void
  unsubscribe: () => void
}

export function useCodeGraph(props?: {
  existingEditor?: Editor
  code?: new (viewModel: ICodeGraphViewModel) => Code
}): ICodeGraphViewModel {
  const viewModel = useBaklava(props?.existingEditor) as ICodeGraphViewModel
  viewModel.code = props?.code ? new props.code(viewModel) : new Code(viewModel)

  addToolbarCommands(viewModel)

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

  /**
   * Initialize view model.
   */
  viewModel.init = () => {
    viewModel.unsubscribe()
    viewModel.engine = new DependencyEngine(viewModel.editor)
  }

  /**
   * Load editor from editor state
   */
  viewModel.loadEditor = (editorState: IEditorState) => {
    viewModel.engine?.pause()
    viewModel.code.clear()

    viewModel.editor.load(editorState)

    // needs to clear clipboard and history after loading editor.
    viewModel.commandHandler.executeCommand<Commands.ClearClipboardCommand>(Commands.CLEAR_CLIPBOARD_COMMAND)
    viewModel.commandHandler.executeCommand<Commands.ClearHistoryCommand>(Commands.CLEAR_HISTORY_COMMAND)

    viewModel.engine?.resume()
    viewModel.engine?.runOnce(undefined)
  }

  /**
   * Create a new graph (new ID).
   */
  viewModel.newGraph = () => {
    viewModel.engine?.pause()
    viewModel.code.clear()

    // set new graph id
    viewModel.editor.graph.id = uuidv4()

    viewModel.engine?.resume()
    viewModel.engine?.runOnce(undefined)
  }

  /**
   * Subscribe view model.
   */
  viewModel.subscribe = () => {
    if (viewModel.state.token) viewModel.unsubscribe()

    const token = Symbol()

    const graph = viewModel.displayedGraph

    graph.events.addNode.subscribe(token, (node: AbstractCodeNode) => {
      node.code = viewModel.code
    })

    graph.events.addConnection.subscribe(token, (data: IConnection) => {
      viewModel.code.findNodeById(data.to.nodeId)?.onConnected()
      viewModel.code.findNodeById(data.from.nodeId)?.onConnected()
    })

    graph.events.removeConnection.subscribe(token, (data: IConnection) => {
      viewModel.code.findNodeById(data.to.nodeId)?.onUnconnected()
      viewModel.code.findNodeById(data.from.nodeId)?.onUnconnected()
    })

    viewModel.engine.events.beforeRun.subscribe(token, () => {
      viewModel.engine.pause()

      if (viewModel.code) {
        // update code nodes
        viewModel.code.updateCodeNodes()

        // sort code nodes using toposort
        viewModel.code.sortNodes()

        // update code templates
        viewModel.code.updateCodeTemplates()

        // reset scripts of input interfaces
        viewModel.code.resetInputInterfaceScript()
      }

      viewModel.engine.resume()
    })

    viewModel.engine.events.beforeNodeCalculation.subscribe(token, (data: BeforeNodeCalculationEventData) => {
      viewModel.engine.pause()

      const codeNode = data.node as AbstractCodeNode
      if (codeNode.isCodeNode) {
        // update variable name of output (outputs.code)
        codeNode.updateOutputNames()

        // update connected input interfaces (with code rendering of source nodes)
        codeNode.updateConnectedInputInterfaces()
      }

      viewModel.engine.resume()
    })

    viewModel.engine.events.afterRun.subscribe(token, (result: CalculationResult) => {
      viewModel.engine.pause()

      // apply results from calculation on editor
      applyResult(result, viewModel.editor)

      if (viewModel.code) {
        // transfer script from node code output to node input interface
        // transferCodeScript(viewModel.displayedGraph)

        // render code nodes using its code templates
        viewModel.code.renderNodeCodes()

        // render code from scripted code nodes
        viewModel.code.renderCode()
      }

      viewModel.engine.resume()
    })

    viewModel.state.token = token
  }

  /**
   * Unsubscribe view model.
   */
  viewModel.unsubscribe = () => {
    if (!viewModel.state.token) return

    const token = viewModel.state.token

    viewModel.displayedGraph.events.addNode.unsubscribe(token)
    viewModel.displayedGraph.events.addConnection.unsubscribe(token)
    viewModel.engine.events.beforeRun.unsubscribe(token)
    viewModel.engine.events.afterRun.unsubscribe(token)

    viewModel.state.token = null
  }

  return viewModel as ICodeGraphViewModel
}
