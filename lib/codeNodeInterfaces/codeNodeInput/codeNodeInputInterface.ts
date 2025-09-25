// codeNodeInputInterface.ts

import { markRaw } from 'vue'

import CodeNodeInterfaceComponent from '../codeNode/CodeNodeInterface.vue'
import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class CodeNodeInputInterface<T = unknown> extends CodeNodeInterface<T> {
  constructor(name: string = '', value?: T) {
    super(name, value as T)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))
  }

}
