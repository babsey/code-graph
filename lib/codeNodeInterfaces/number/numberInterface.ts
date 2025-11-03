// numberInterface.ts

import { NumberInterfaceComponent } from "baklavajs";
import { markRaw, type ComponentOptions } from "vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class NumberInterface extends BaseNumericInterface {
  component = markRaw(NumberInterfaceComponent) as ComponentOptions;
}
