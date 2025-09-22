import { type ComponentOptions, markRaw } from 'vue'

import { IntegerInterfaceComponent } from 'baklavajs'

import { BaseNumericInterface } from '../baseNumericInterface'

export class IntegerInterface extends BaseNumericInterface {
  component = markRaw(IntegerInterfaceComponent) as ComponentOptions

  public validate(v: number) {
    return Number.isInteger(v) && super.validate(v)
  }
}

export { IntegerInterfaceComponent }
