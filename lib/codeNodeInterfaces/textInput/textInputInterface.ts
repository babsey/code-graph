// textInputInterface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { TextInputInterfaceComponent } from 'baklavajs'

import { BaseStringInterface } from '../baseStringInterface'

export class TextInputInterface extends BaseStringInterface {
  component = markRaw(TextInputInterfaceComponent) as ComponentOptions
}

export { TextInputInterfaceComponent }
