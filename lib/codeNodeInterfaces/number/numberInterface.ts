// numberInterface.ts

import { NumberInterfaceComponent } from "@baklavajs/renderer-vue";
import { markRaw, type ComponentOptions } from "vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class NumberInterface extends BaseNumericInterface {
  public component: ComponentOptions = markRaw(NumberInterfaceComponent) as ComponentOptions;
  public componentName: string = "NumberInterface";
}
