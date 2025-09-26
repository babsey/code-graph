// selectInterface.ts

import { markRaw, type ComponentOptions } from 'vue'
import { SelectInterfaceComponent } from 'baklavajs'

import { BaseStringInterface } from '../baseStringInterface'

export interface IAdvancedSelectInterfaceItem<V> {
  text: string
  value: V
}

export type SelectInterfaceItem<V> = string | IAdvancedSelectInterfaceItem<V>

export class SelectInterface<V = string> extends BaseStringInterface {
  component = markRaw(SelectInterfaceComponent) as ComponentOptions
  items: SelectInterfaceItem<V>[]

  constructor(name: string, value: V, items: SelectInterfaceItem<V>[]) {
    super(name, value as string)
    this.items = items
  }
}
