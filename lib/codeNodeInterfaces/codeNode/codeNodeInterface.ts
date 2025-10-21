// codeNodeInterface.ts

import { NodeInterface } from 'baklavajs'
import { markRaw, reactive, type UnwrapRef } from 'vue'

import CodeNodeInterfaceComponent from './CodeNodeInterface.vue'
import type { Code } from '@/code'

export interface ICodeNodeInterfaceState {
  optional: boolean
  script: string
}

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public isCodeNode: boolean = true
  public code: Code | undefined
  public state: UnwrapRef<ICodeNodeInterfaceState>
  public type: string | null = null

  constructor(name: string, value: T) {
    super(name, value)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))

    this.state = reactive({
      optional: false,
      script: '',
    })
  }

  get optional(): boolean {
    return this.state.optional
  }

  get script(): string {
    return this.state.script
  }

  set script(value: string) {
    this.state.script = value
  }

  get shortId(): string {
    return this.id.slice(0, 6)
  }

  getValue = (): string => `${this.value ?? 'None'}`

  resetScript = () => (this.state.script = '')
}

export { CodeNodeInterfaceComponent }

export const setOptional = (intf: CodeNodeInterface, value: boolean) => {
  intf.state.optional = value
  intf.setHidden(value)
}
