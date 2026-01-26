// selectInterface.ts

import { markRaw, type ComponentOptions } from "vue";

import { BaseStringInterface } from "../baseStringInterface";
import { SelectInterface as SelectInterfaceComponent } from "../components";

export interface IAdvancedSelectInterfaceItem<V> {
  text: string;
  value: V;
}

export type SelectInterfaceItem<V> = string | IAdvancedSelectInterfaceItem<V>;

export class SelectInterface<V = string> extends BaseStringInterface {
  public component: ComponentOptions = markRaw(SelectInterfaceComponent) as ComponentOptions;
  public componentName: string = "SelectInterface";
  public items: SelectInterfaceItem<V>[] = [];

  constructor(name: string, value: V, items: SelectInterfaceItem<V>[] | undefined) {
    super(name, value as string);
    if (items) this.items = items;
  }
}
