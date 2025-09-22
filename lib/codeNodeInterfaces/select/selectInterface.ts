// selectInterface.ts

import { type ComponentOptions, markRaw } from 'vue'
import { SelectInterfaceComponent } from 'baklavajs'

import { CodeNodeInterface } from '../codeNode/codeNodeInterface'

export interface IAdvancedSelectInterfaceItem<V> {
  text: string
  value: V
}

export type SelectInterfaceItem<V> = string | IAdvancedSelectInterfaceItem<V>

export class SelectInterface<V = string> extends CodeNodeInterface<V> {
  component = markRaw(SelectInterfaceComponent) as ComponentOptions
  items: SelectInterfaceItem<V>[]

  constructor(name: string, value: V, items: SelectInterfaceItem<V>[]) {
    super(name, value)
    this.items = items
  }
}

export { SelectInterfaceComponent }
