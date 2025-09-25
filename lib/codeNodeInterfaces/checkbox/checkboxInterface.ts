// checkboxInterface.ts

import { markRaw } from 'vue'
import { CheckboxInterfaceComponent, displayInSidebar, setType } from 'baklavajs'

import { CodeNodeInputInterface } from '../codeNodeInput/codeNodeInputInterface'
import { booleanType } from '@/interfaceTypes'

export class CheckboxInterface extends CodeNodeInputInterface<boolean> {
  public constructor(name: string, value: boolean) {
    super(name, value)
    this.setComponent(markRaw(CheckboxInterfaceComponent))

    this.use(setType, booleanType).use(displayInSidebar, true)
  }
}

export { CheckboxInterfaceComponent }
