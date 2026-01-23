// integerInterface.ts

import { IntegerInterfaceComponent } from "@baklavajs/renderer-vue";
import { markRaw } from "vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class IntegerInterface extends BaseNumericInterface {
  constructor(name: string, value: number = 0) {
    super(name, value);
    this.componentName = "IntegerInterface";
    this.setComponent(markRaw(IntegerInterfaceComponent));
  }

  public validate(v: number) {
    return Number.isInteger(v) && super.validate(v);
  }
}
