// codeNodeInterface.ts

import { markRaw, reactive, type UnwrapRef } from 'vue'
import { NodeInterface } from 'baklavajs'

import CodeNodeInterfaceComponent from './CodeNodeInterface.vue'
import type { Code } from '@/code'

interface ICodeNodeInterfaceState {
  script: string
}

export class CodeNodeInterface<T = unknown> extends NodeInterface<T> {
  public optional: boolean = false
  public code: Code | undefined
  public state: UnwrapRef<ICodeNodeInterfaceState>

  constructor(name: string, value: T) {
    super(name, value)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))

    this.state = reactive({
      script: '',
    })
  }

  get shortId(): string {
    return this.id.slice(0, 6)
  }

  // override get value(): T {
  //   return super.value
  // }

  // override set value(value: T) {
  //   super.value = value;
  //   if (this.name !== '_node') this.setHidden(false);
  // }
}
