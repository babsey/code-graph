// codeGraphStore.ts

import { reactive, type UnwrapRef } from 'vue'
import { type IEditorState } from 'baklavajs'
import { defineStore } from 'pinia'

import { useCodeGraph, type ICodeGraphViewModel } from '@babsey/code-graph'

import { MyCode } from '../code'
import { registerNodeTypes } from '../codeNodeTypes'

export const useCodeGraphStore = defineStore(
  'code-graph',
  () => {
    const state: UnwrapRef<{
      codeGraph: ICodeGraphViewModel | null
      editorStates: Record<string, IEditorState>
      token: symbol | null
    }> = reactive({
      codeGraph: null,
      editorStates: {},
      token: null,
    })

    const init = () => {
      state.codeGraph = useCodeGraph({ code: MyCode })
      state.codeGraph.init()
      registerNodeTypes(state.codeGraph)
    }

    const loadEditor = (editorId?: string) => {
      // console.log('load editor', editorId)
      unsubscribe()

      const editorIds = Object.keys(state.editorStates)
      if (!editorId || !editorIds.includes(editorId)) return newGraph()

      const editorState = state.editorStates[editorId]

      // load editor from editor state
      if (editorState) state.codeGraph.loadEditor(editorState)

      subscribe()

      return true
    }

    const newGraph = () => {
      // create new graph
      state.codeGraph.newGraph()

      const editorId = saveEditor()
      return { name: 'edit', params: { editorId } }
    }

    const removeEditorState = (editorId: string) => {
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
      state.token = token
    }

    const unsubscribe = () => {
      if (!state.token || !state.codeGraph) return
      state.codeGraph.engine.events.afterRun.unsubscribe(state.token)
      state.token = null
    }

    init()

    return { loadEditor, newGraph, removeEditorState, state }
  },
  {
    persist: {
      storage: sessionStorage, // localStorage
      pick: ['state.editorStates'],
    },
  },
)
