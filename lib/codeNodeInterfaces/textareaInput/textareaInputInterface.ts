// textareaInpoutInteface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { TextareaInputInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class TextareaInputInterface extends CodeNodeInterface<string> {
  component = markRaw(TextareaInputInterfaceComponent) as ComponentOptions
}

export { TextareaInputInterfaceComponent }
