// buttonInterface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { ButtonInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class ButtonInterface extends CodeNodeInterface<undefined> {
  public component = markRaw(ButtonInterfaceComponent) as ComponentOptions
  public callback?: () => void

  public constructor(name: string, callback: () => void) {
    super(name, undefined)
    this.callback = callback
    this.setPort(false)
  }
}

export { ButtonInterfaceComponent }
