// numberInterface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { NumberInterfaceComponent } from 'baklavajs'

import { BaseNumericInterface } from '../baseNumericInterface'

export class NumberInterface extends BaseNumericInterface {
  component = markRaw(NumberInterfaceComponent) as ComponentOptions
}

export { NumberInterfaceComponent }
