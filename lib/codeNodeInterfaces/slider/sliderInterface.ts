// sliderInterface.ts

import { markRaw } from "vue";
import { SliderInterfaceComponent } from "@baklavajs/renderer-vue";

import { BaseNumericInterface } from "../baseNumericInterface";

export class SliderInterface extends BaseNumericInterface {
  constructor(name: string, value: number, min: number, max: number) {
    super(name, value, min, max);
    this.componentName = "SliderInterface";
    this.setComponent(markRaw(SliderInterfaceComponent));
  }

  override getValue = (): string => `${Math.round(this.value * 1000) / 1000}`;
}
