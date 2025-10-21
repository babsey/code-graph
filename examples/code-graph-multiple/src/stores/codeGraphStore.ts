// codeGraphStore.ts

import { defineStore } from 'pinia'
import { reactive, type UnwrapRef } from 'vue'
import { type IEditorState } from 'baklavajs'

import { type ICodeGraphViewModel } from '@babsey/code-graph'

import { registerExampleCodeGraph, registerNumpyCodeGraph } from '@/codes'

export const useCodeGraphStore = defineStore(
  'code-graph',
  () => {
    const state: UnwrapRef<{
      codeGraph: ICodeGraphViewModel | null
      codeGraphs: Record<string, ICodeGraphViewModel>
      codeName: string
      editorStates: Record<string, IEditorState>
      token: symbol | null
    }> = reactive({
      codeGraph: null,
      codeGraphs: {},
      codeName: 'example',
      editorStates: {},
      token: null,
    })

    const init = () => {
      // console.log('init')
      state.codeGraphs['example'] = registerExampleCodeGraph()
      state.codeGraphs['numpy'] = registerNumpyCodeGraph()
    }

    const loadCodeGraph = (codeName: string) => {
      // console.log('load code graph', codeName)
      unsubscribe()

      if (state.codeGraph) {
        state.codeGraph.unsubscribe()
        state.codeGraph.engine.stop()
      }

      if (!state.codeGraph || state.codeGraph.code.name !== codeName) state.codeGraph = state.codeGraphs[codeName]

      state.codeGraph.subscribe()
      state.codeGraph.engine.start()
      subscribe()
    }

    const loadEditor = (editorId?: string) => {
      // console.log('load editor', editorId)

      unsubscribe()

      const editorIds = Object.keys(state.editorStates)
      if (!editorId || !editorIds.includes(editorId)) return newEditor(state.codeGraph.code.name)

      const editorState = state.editorStates[editorId]

      if (editorState) {
        // load code graph from the state
        if (editorState.codeName) loadCodeGraph(editorState.codeName as string)

        // load editor from editor state
        if (state.codeGraph.displayedGraph.id !== editorId) state.codeGraph.loadEditor(editorState)
      }

      subscribe()

      return true
    }

    const newEditor = (codeName: string) => {
      // console.log('new editor', codeName)
      loadCodeGraph(codeName as string)

      // create new graph
      state.codeGraph.newGraph()

      const editorId = saveEditor()
      return { name: 'edit', params: { editorId } }
    }

    const removeEditorState = (editorId: string) => {
      // console.log('remove editor', editorId)
      delete state.editorStates[editorId]
    }

    const saveEditor = () => {
      // console.log('save editor', state.codeGraph.editor.graph.id)
      state.editorStates[state.codeGraph.editor.graph.id] = state.codeGraph.editor.save()
      return state.codeGraph.editor.graph.id
    }

    const subscribe = () => {
      if (state.token) unsubscribe()

      const token = Symbol()
      state.codeGraph.engine.events.afterRun.subscribe(token, saveEditor)
      state.codeGraph.editor.hooks.save.subscribe(token, (editorState: IEditorState) => {
        editorState.codeName = state.codeGraph.code.name
        return editorState
      })

      state.token = token
    }

    const unsubscribe = () => {
      if (!state.token || !state.codeGraph) return
      state.codeGraph.engine.events.afterRun.unsubscribe(state.token)
      state.codeGraph.editor.hooks.save.unsubscribe(state.token)

      state.token = null
    }

    init()

    return { init, loadCodeGraph, loadEditor, newEditor, removeEditorState, state }
  },
  {
    persist: {
      storage: sessionStorage, // localStorage
      pick: ['state.codeName', 'state.editorStates'],
    },
  },
)
