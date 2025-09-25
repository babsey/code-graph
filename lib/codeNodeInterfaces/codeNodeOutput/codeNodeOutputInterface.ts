// codeNodeOutputInterface.ts

import { markRaw } from 'vue'

import CodeNodeInterfaceComponent from '../codeNode/CodeNodeInterface.vue'
import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class CodeNodeOutputInterface extends CodeNodeInterface<string> {
  public isCodeNodeOutput: boolean = true

  constructor(name: string = '', value: string = '') {
    super(name, value)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))
  }

  get script(): string {
    return this.name.length > 0 ? this.name : this.state.script
  }
}
