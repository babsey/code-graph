// textInterface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { TextInputInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class TextInterface extends CodeNodeInterface<string> {
  component = markRaw(TextInputInterfaceComponent) as ComponentOptions

  public constructor(name: string, value: string) {
    super(name, value)
    this.setPort(false)
  }
}
