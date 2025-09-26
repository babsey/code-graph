// tupleInputInterface.ts

import { markRaw } from 'vue'
import { setType, TextInputInterfaceComponent } from 'baklavajs'

import { CodeNodeInputInterface, tupleType } from '@/main'

export class TupleInputInterface extends CodeNodeInputInterface {
  constructor(name: string = '', value: string = '') {
    super(name, value)
    this.setComponent(markRaw(TextInputInterfaceComponent))

    this.use(setType, tupleType)
  }

  override getValue = (): string => `(${this.value})`
}
