import { type ComponentOptions, markRaw } from 'vue'
import { TextInputInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export class TextInputInterface extends CodeNodeInterface<string> {
  public isString: boolean = true

  component = markRaw(TextInputInterfaceComponent) as ComponentOptions
}

export { TextInputInterfaceComponent }
