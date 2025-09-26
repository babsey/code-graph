// textInputInterface.ts

import { markRaw, type ComponentOptions } from 'vue'
import { TextInputInterfaceComponent } from 'baklavajs'

import { BaseStringInterface } from '../baseStringInterface'

export class TextInputInterface extends BaseStringInterface {
  component = markRaw(TextInputInterfaceComponent) as ComponentOptions
}
