// integerInterface.ts

import { IntegerInterfaceComponent } from "baklavajs";
import { markRaw, type ComponentOptions } from "vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class IntegerInterface extends BaseNumericInterface {
  component = markRaw(IntegerInterfaceComponent) as ComponentOptions;

  public validate(v: number) {
    return Number.isInteger(v) && super.validate(v);
  }
}
