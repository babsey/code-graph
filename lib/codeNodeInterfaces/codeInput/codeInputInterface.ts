// nodeInputInterface.ts

import { markRaw } from 'vue'

import CodeNodeInterfaceComponent from '../codeNode/CodeNodeInterface.vue'
import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class CodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  public isCodeInput: boolean = true

  constructor(name: string = '', value?: T) {
    super(name, value as T)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))
  }
}
