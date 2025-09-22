// checkbox.ts

import { type ComponentOptions, markRaw } from 'vue'
import { CheckboxInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class CheckboxInterface extends CodeNodeInterface<boolean> {
  component = markRaw(CheckboxInterfaceComponent) as ComponentOptions
}

export { CheckboxInterfaceComponent }
