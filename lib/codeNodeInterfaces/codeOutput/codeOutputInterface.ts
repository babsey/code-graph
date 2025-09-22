// nodeOutputInterface.ts

import { markRaw } from 'vue'

import CodeNodeInterfaceComponent from '../codeNode/CodeNodeInterface.vue'
import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class CodeOutputInterface extends CodeNodeInterface<unknown> {
  public isCodeOutput: boolean = true

  constructor(name: string = '', value: string = '') {
    super(name, value)
    this.setComponent(markRaw(CodeNodeInterfaceComponent))
  }

  get script(): string {
    return this.state.script
  }

  override get value(): unknown {
    return super.value
  }

  override set value(value: unknown) {
    super.value = value
    this.state.script = this.name.length > 0 ? this.name : (this.value as string)
  }
}
