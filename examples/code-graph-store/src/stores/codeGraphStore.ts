import { reactive, type UnwrapRef } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

import { useCodeGraph, type ICodeGraphViewModel } from '@babsey/code-graph'

import { MyCode } from '../code'

import {
  registerNodeTypes
} from '../codeNodeTypes'
import { type Editor } from 'baklavajs'

export const useCodeGraphStore = defineStore(
  'code-graph',
  () => {
    const state: UnwrapRef<{
      codeGraph: ICodeGraphViewModel | null
      editorStates: Record<string, Editor>
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
      if (!editorId || !editorIds.includes(editorId)) return newEditor()

      state.codeGraph.editor.load(state.editorStates[editorId])
      state.codeGraph.engine.runOnce()
      subscribe()

      return true
    }

    const newEditor = () => {
      state.codeGraph.engine.pause()
      state.codeGraph.code.clear()
      state.codeGraph.editor.graph.id = uuidv4()
      const editorId = saveEditor()
      state.codeGraph.engine.resume()
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

    return { loadEditor, newEditor, removeEditorState, state }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['state.editorStates'],
    },
  },
)
