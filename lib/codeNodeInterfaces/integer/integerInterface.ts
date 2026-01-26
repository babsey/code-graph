// integerInterface.ts

import { IntegerInterfaceComponent } from "@baklavajs/renderer-vue";
import { markRaw, type ComponentOptions } from "vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class IntegerInterface extends BaseNumericInterface {
  public component: ComponentOptions = markRaw(IntegerInterfaceComponent) as ComponentOptions;
  public componentName: string = "IntegerInterface";

  public validate(v: number) {
    return Number.isInteger(v) && super.validate(v);
  }
}
